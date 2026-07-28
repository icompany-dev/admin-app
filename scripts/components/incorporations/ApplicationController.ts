import { Error } from "~/scripts/library/Error"
import { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"
import { PropsIncorporationApplication } from "~/scripts/props/PropsIncorporationApplication"
import { StringUtil } from "~/scripts/utils/String"

export class ApplicationController {
  applicationId: Ref<string> = ref<string>("")
  application: Ref<ApplicationIncorporate> = ref<ApplicationIncorporate>(new ApplicationIncorporate())

  emitEvents: any | null = null

  language = useLanguage()

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsIncorporationApplication, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  async setDataFromProps(props: PropsIncorporationApplication): Promise<void> {
    this.applicationId.value = props.applicationId
    await this.init()
  }

  async init(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      let error = new Error()
      error.title = this.language.isMalay() ? "ID Permohonan Tiada" : "No Application ID found"
      error.message = this.language.isMalay()
        ? "Anda akan dibawa ke laman utama"
        : "You will be redirected to the main page."
      error.promptWarning()

      this.emitEvents("back")
      return
    }

    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      let repository = useApplicationIncorporateStore()
      let response = await repository.fetch(this.applicationId.value)

      if (repository.error !== null) {
        throw repository.error
      }

      this.application.value = new ApplicationIncorporate(response)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }
}
