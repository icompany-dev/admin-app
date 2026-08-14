import { GoogleMapApi } from "~/scripts/external-apis/GoogleMapApi"
import { SleekflowApi } from "~/scripts/external-apis/SleekfowApi"
import { OpenAiApi } from "~/scripts/external-apis/OpenAiApi"
import { AwsApi } from "~/scripts/external-apis/AwsApi"

interface ExternalApis {
  googleMap: GoogleMapApi
  sleekflow: SleekflowApi
  openAi: OpenAiApi
  aws: AwsApi
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const externalApis: ExternalApis = {
    googleMap: new GoogleMapApi(
      "https://maps.googleapis.com/maps/api/geocode/json",
      "",
      config.public.googleMapsApiKey
    ),
    sleekflow: new SleekflowApi(
      "https://api.sleekflow.io/api/",
      "X-Sleekflow-Api-Key",
      config.public.sleekflowApiKey
    ),
    openAi: new OpenAiApi(
      "https://api.openAi.com/v1",
      "Authorization",
      `Bearer ${config.public.openAiApiKey}`,
      `${config.public.openAiAssistantId}`
    ),
    aws: new AwsApi(
      config.public.awsRegion,
      config.public.awsAccessKeyId,
      config.public.awsSecretAccessKey,
      config.public.awsBucket
    ),
  }

  nuxtApp.provide("externalApis", externalApis)
})

declare module "#app" {
  interface NuxtApp {
    $externalApis: {
      googleMap: import("~/scripts/external-apis/GoogleMapApi").GoogleMapApi
      sleekflow: import("~/scripts/external-apis/SleekfowApi").SleekflowApi
      openAi: import("~/scripts/external-apis/OpenAiApi").OpenAiApi
      aws: import("~/scripts/external-apis/AwsApi").AwsApi
    }
  }
}

declare module "pinia" {
  export interface PiniaCustomProperties {
    $externalApis: {
      googleMap: import("~/scripts/external-apis/GoogleMapApi").GoogleMapApi
      sleekflow: import("~/scripts/external-apis/SleekfowApi").SleekflowApi
      openAi: import("~/scripts/external-apis/OpenAiApi").OpenAiApi
      aws: import("~/scripts/external-apis/AwsApi").AwsApi
    }
  }
}
