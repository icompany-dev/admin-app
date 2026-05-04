//NOTE(Bahiyah) : This file is needed for Singleton usage.
//  It will be instantiated once.
//  And then it will be used throughout
export type ConnectionStatus = {
  downlink: number
  effectiveType: "2g" | "3g" | "4g"
  saveData: boolean
}

export class ResourceChecker {
  private static instance: ResourceChecker
  private isOnline: boolean = true
  private memoryWarningTriggered: boolean = false

  private constructor() {
    if (typeof window !== "undefined") {
      this.initEventListeners()
      this.startMemoryMonitor() // Start watching immediately
      this.startCPUObserver()
    }
  }

  private initEventListeners() {
    window.addEventListener("online", () => this.handleConnectionChange(true))
    window.addEventListener("offline", () => this.handleConnectionChange(false))

    const conn = (navigator as any).connection
    if (conn) {
      conn.addEventListener("change", () => {
        const type = this.getNetworkFailureType()
        if (type === "SLOW") {
          window.dispatchEvent(new CustomEvent("app:network-slow"))
        }
      })
    }
  }

  private handleConnectionChange(status: boolean) {
    this.isOnline = status
    if (!status) {
      console.warn("ResourceChecker: Internet connection lost.")
    }
  }

  private startMemoryMonitor() {
    if (!("memory" in performance)) return

    setInterval(() => {
      const stats = this.getMemoryUsage()
      if (stats && parseFloat(stats.percentUsed) > 70) {
        if (!this.memoryWarningTriggered) {
          this.triggerMemoryAlert()
          this.memoryWarningTriggered = true
        }
      } else {
        this.memoryWarningTriggered = false
      }
    }, 10000)
  }

  private triggerMemoryAlert() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("app:memory-low"))
    }
  }

  private startCPUObserver() {
    if (!("PerformanceObserver" in window)) return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 500) {
          const attributions = (entry as any).attribution || []

          const isSDKTask = attributions.some((attr: any) => {
            return attr.containerId === "wise-ai" || attr.containerName === "wise-ai" || attr.containerType === "iframe"
          })

          if (!isSDKTask) {
            window.dispatchEvent(new CustomEvent("app:cpu-blocked"))
          }
        }
      }
    })

    try {
      observer.observe({ entryTypes: ["longtask"] })
    } catch (e) {
      //
    }
  }

  public async checkStorageHealth() {
    if (navigator.storage && navigator.storage.estimate) {
      const { quota, usage } = await navigator.storage.estimate()
      if (quota && usage) {
        const percentUsed = (usage / quota) * 100
        if (percentUsed > 90) {
          window.dispatchEvent(new CustomEvent("app:storage-low"))
        }
      }
    }
  }

  public debug_leakMemory() {
    console.log("Starting memory bloat test...")
    const leakStorage: any[] = []

    setInterval(() => {
      for (let i = 0; i < 5000; i++) {
        leakStorage.push({
          data: new Array(10000).fill("⚠️ BLOCKING POINT TEST ⚠️"),
          timestamp: Date.now(),
        })
      }
      console.log("Current Heap Used:", this.getMemoryUsage()?.used + "MB")
    }, 1000)
  }

  public checkConnectivity(): boolean {
    return typeof window !== "undefined" ? navigator.onLine : true
  }

  public getNetworkFailureType(): "OFFLINE" | "SLOW" | "ONLINE" {
    if (!this.checkConnectivity()) return "OFFLINE"

    const conn = (navigator as any).connection
    if (conn && (conn.effectiveType === "2g" || conn.downlink < 0.5)) {
      return "SLOW"
    }

    return "ONLINE"
  }

  public static getInstance(): ResourceChecker {
    if (!ResourceChecker.instance) {
      ResourceChecker.instance = new ResourceChecker()
    }
    return ResourceChecker.instance
  }

  public getBrowserInfo() {
    if (typeof window === "undefined") return null
    const ua = navigator.userAgent
    return {
      isChrome: ua.includes("Chrome") && !ua.includes("Edg"),
      isFirefox: ua.includes("Firefox"),
      isSafari: ua.includes("Safari") && !ua.includes("Chrome"),
      isEdge: ua.includes("Edg"),
      userAgent: ua,
    }
  }

  public getNetworkStatus(): ConnectionStatus | null {
    if (typeof window === "undefined" || !("connection" in navigator)) return null
    const conn = (navigator as any).connection
    return {
      downlink: conn.downlink,
      effectiveType: conn.effectiveType,
      saveData: conn.saveData,
    }
  }

  public getMemoryUsage() {
    if (typeof window === "undefined" || !("memory" in performance)) return null
    const mem = (performance as any).memory
    return {
      used: Math.round(mem.usedJSHeapSize / 1048576), // MB
      total: Math.round(mem.jsHeapSizeLimit / 1048576), // MB
      percentUsed: ((mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100).toFixed(2),
    }
  }

  public getSystemHealth() {
    const mem = this.getMemoryUsage()
    const net = this.getNetworkStatus()

    const isMemoryLow = mem ? parseFloat(mem.percentUsed) > 85 : false
    const isNetworkSlow = net ? net.effectiveType === "2g" || net.downlink < 1.5 : false

    return {
      isHealthy: !isMemoryLow && !isNetworkSlow,
      cause: isMemoryLow ? "DEVICE_MEMORY" : isNetworkSlow ? "NETWORK" : "OK",
    }
  }
}
