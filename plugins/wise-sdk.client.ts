export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  useHead({
    link: [
      {
        rel: "stylesheet",
        href: "/vendor/wise-ai/css/wailib-min-1.12.0.css",
      },
    ],
    script: [
      {
        src: "https://code.jquery.com/jquery-3.7.1.min.js",
        integrity: "sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=",
        crossorigin: "anonymous",
        tagPosition: "bodyClose",
      },
      { src: "/vendor/wise-ai/js/webrtc-adapter.js", defer: true },
      { src: "/vendor/wise-ai/js/wailib-util-min.js", defer: true },
      { src: "/vendor/wise-ai/js/wailib-sdk-1.12.0.js", defer: true },
      { src: "https://cdn.jsdelivr.net/npm/onnxjs/dist/onnx.min.js", defer: true },
      { src: "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.18.0/dist/ort.min.js", defer: true },
      { src: "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.18.0/dist/ort.webgpu.min.js", defer: true },
      { src: "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js", defer: true },
    ],
  })

  return {
    provide: {
      isWiseReady: () => {
        return typeof window.WAILib !== "undefined"
      },
    },
  }
})
