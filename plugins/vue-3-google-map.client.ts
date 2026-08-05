import { GoogleMap, Marker, InfoWindow } from "vue3-google-map"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("GoogleMap", GoogleMap)
  nuxtApp.vueApp.component("Marker", Marker)
  nuxtApp.vueApp.component("InfoWindow", InfoWindow)
})
