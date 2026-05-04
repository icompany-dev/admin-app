export class Toast {
  title: string = ""
  message: string = ""

  constructor(title: string, message: string) {
    this.title = title
    this.message = message
  }

  success(): void {
    let nuxtApp = useNuxtApp()
    nuxtApp.$iziToast.success({
      title: this.title,
      message: this.message,
      icon: "success",
      iconColor: "transparent",
      position: "bottomRight",
      pauseOnHover: true,
      close: false,
      timeout: 5000,
    })
  }

  warning(): void {
    let nuxtApp = useNuxtApp()
    nuxtApp.$iziToast.warning({
      title: this.title,
      message: this.message,
      icon: "warning",
      iconColor: "transparent",
      position: "bottomRight",
      pauseOnHover: true,
      close: false,
      timeout: 5000,
    })
  }

  error(): void {
    let nuxtApp = useNuxtApp()
    nuxtApp.$iziToast.error({
      title: this.title,
      message: this.message,
      icon: "error",
      iconColor: "transparent",
      position: "bottomRight",
      pauseOnHover: true,
      close: false,
      timeout: 5000,
    })
  }
}
