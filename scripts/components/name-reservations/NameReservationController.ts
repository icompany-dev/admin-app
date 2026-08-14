import { NameReservation } from "~/scripts/types/NameReservation"
import { StringUtil } from "~/scripts/utils/String"
import { useCompanyNameFilterStore } from "#imports"
import { useCompanyNameRegisterStore } from "#imports"
import { useAdminSettingStore } from "#imports"
import { useLanguage } from "#imports"
import { useMyDataNameSearchStore } from "#imports"
import { CompanyNameFilter } from "~/scripts/models/CompanyNameFilter"
import { AdminSetting } from "~/scripts/models/AdminSetting"
import { AskSairaNameSuggestions } from "~/scripts/types/ask-saira/AskSairaNameSuggestions"
import { AskSairaNameDescriptionDraft } from "~/scripts/types/ask-saira/AskSairaNameDescriptionDraft"
import { NameReservationChecker } from "~/scripts/library/NameReservationChecker"

export class NameReservationController {
  nameReservation: NameReservation = new NameReservation("", "")
  emitEvents: any = []

  nameToReserve = ref<string>("")
  description = ref<string>("")

  otherNamesToReserve = ref<string[]>([])

  uploadedFileId = ref<string | null>(null)

  // This is the items for name reservation check
  isChecking = ref<boolean>(false)
  nameToCheck = ref<string>("")
  validationRemarks = ref<string>("")
  canNameProceed = ref<boolean>(false)
  isWarningRequired = ref<boolean>(false)
  isDescriptionRequired = ref<boolean>(false)
  warningMessages = ref<string>("")
  isSupportingDocumentRequired = ref<boolean>(false)
  hasClickedEnter = ref<boolean>(false)

  nameReservationChecker: Ref<NameReservationChecker> = ref<NameReservationChecker>(new NameReservationChecker())

  language = useLanguage()

  //UI
  isInputInFocused = ref<boolean>(false)
  canShowSaira = ref<boolean>(false)
  canAskForRecommendations = ref<boolean>(false)
  canAskForDrafts = ref<boolean>(false)
  hasRunValidationOnce = ref<boolean>(false)
  showNameRecommendations = ref<boolean>(false)
  nameRecommendations = ref<string[]>([])

  availabilityNoticeRef: any | null = null
  isFocusedOnAvailability: Ref<boolean> = ref<boolean>(false)

  constructor(
    nameReservation: NameReservation | null,
    otherNamesToReserve: string[],
    emitEvents: any,
    canShowSaira: boolean = false
  ) {
    if (nameReservation) {
      this.setNameReservation(nameReservation)
    }

    this.setOtherNamesToReserve(otherNamesToReserve)

    this.emitEvents = emitEvents
    this.setCanShowSaira(canShowSaira)
  }

  setAvailabilityNoticeRef(availabilityNoticeRef: any): void {
    this.availabilityNoticeRef = availabilityNoticeRef

    if (this.availabilityNoticeRef) {
      this.isFocusedOnAvailability.value = true
    }
  }

  async setOtherNamesToReserve(otherNamesToReserve: string[]): Promise<void> {
    this.otherNamesToReserve.value = otherNamesToReserve

    if (!StringUtil.isNullOrEmpty(this.nameToReserve.value)) {
      if (this.isDuplicated()) {
        this.setWarningForDuplicated()
      } else if (!this.canNameProceed.value) {
        await this.onValidateInputClicked()
      }
    }
  }

  setCanShowSaira(canShowSaira: boolean): void {
    this.canShowSaira.value = canShowSaira
  }

  setNameReservation(nameReservation: NameReservation): void {
    this.nameReservation.clone(nameReservation)
    let shouldRunCheck = this.nameToReserve.value !== this.nameReservation.name
    this.nameToReserve.value = this.nameReservation.name ?? ""
    this.description.value = this.nameReservation.description ?? ""

    if (shouldRunCheck) {
      this.onValidateInputClicked()
    }
  }

  async onNameChanged(): Promise<void> {
    this.resetValues()
    this.hasClickedEnter.value = false
  }

  isShowSairaButton(): boolean {
    return this.canShowSaira.value && this.hasRunValidationOnce.value
  }

  isShowAskForRecommendation(): boolean {
    return this.canShowSaira.value && this.canAskForRecommendations.value && !this.canAskForDrafts.value
  }

  isShowAskForDrafts(): boolean {
    return this.canShowSaira.value && this.canAskForDrafts.value
  }

  async handleInputBlur(): Promise<void> {
    if (this.isChecking) {
      return
    }

    this.isInputInFocused.value = false
    await this.onValidateInputClicked()
  }

  isDuplicated(): boolean {
    return this.otherNamesToReserve.value.some((otherNameToReserve: string) => {
      return otherNameToReserve.toLowerCase() === this.nameToReserve.value.toLowerCase()
    })
  }

  setWarningForDuplicated(): void {
    this.canNameProceed.value = false
    this.nameToCheck.value = ""
    this.validationRemarks.value = this.language.isMalay()
      ? "Alamak! Nama yang sama dimasukkan. Sila tukar."
      : "Yikes! Same name already inserted. Please edit."
    this.isWarningRequired.value = true
    this.isDescriptionRequired.value = false
    this.warningMessages.value = ""
    this.isSupportingDocumentRequired.value = false
    this.canAskForRecommendations.value = false
    this.canAskForDrafts.value = false

    this.isChecking.value = false
  }

  async onValidateInputClicked(): Promise<void> {
    if (this.isChecking.value) {
      return
    }

    this.hasClickedEnter.value = true
    this.isChecking.value = true
    this.showNameRecommendations.value = false
    this.nameRecommendations.value = []
    this.description.value = ""

    // check again the existing
    if (this.isDuplicated()) {
      this.setWarningForDuplicated()
      return
    }

    this.nameReservationChecker.value.setName(this.nameToReserve.value)
    this.setValuesUsingChecker()
    await this.nameReservationChecker.value.validate()
    this.isChecking.value = false
    this.setValuesUsingChecker()

    this.hasRunValidationOnce.value = true
    this.emitEvents("nameChanged", this.getNameReservation())

    if (!this.canNameProceed.value) {
      setTimeout(() => {
        this.resetValues()
        this.canNameProceed.value = false
      }, 10000)
    }
  }

  async onInputBlur(): Promise<void> {
    this.isInputInFocused.value = false

    await this.onValidateInputClicked()
  }

  onFileUpload(fileId: string): void {
    this.uploadedFileId.value = fileId
  }

  onFileRemoved(): void {
    this.uploadedFileId.value = null
  }

  setValuesUsingChecker(): void {
    let result = this.nameReservationChecker.value.validationResult
    this.canNameProceed.value = result.isAccepted
    this.nameToCheck.value = this.nameReservationChecker.value.nameToCheck
    this.validationRemarks.value = result.validationRemarks.join(" ")
    this.isWarningRequired.value = result.isWarningRequired
    this.isDescriptionRequired.value = result.isDescriptionRequired
    this.warningMessages.value = result.warningMessages.join(" ")
    this.isSupportingDocumentRequired.value = result.isSupportingDocumentRequired
    this.canAskForRecommendations.value = result.canAskForRecommendation
    this.canAskForDrafts.value = result.canAskForDrafts
  }

  inputGroupClass(): string {
    let classes: string[] = []

    if (this.isInputInFocused.value) {
      classes.push("focused")
    }

    if (this.nameToReserve.value.length > 0) {
      if (this.isChecking.value || !this.hasClickedEnter.value) {
        classes.push("checking")
      } else if (this.isWarningRequired.value || this.isSupportingDocumentRequired.value) {
        classes.push("warning")
      } else if (!this.canNameProceed.value) {
        classes.push("danger")
      } else {
        classes.push("success")
      }
    }

    return classes.join(" ")
  }

  wrapperClass(): string {
    if (this.nameToReserve.value.length > 0) {
      if (this.isChecking.value || !this.hasClickedEnter.value) {
        return "show checking"
      }

      if (this.isWarningRequired.value || this.isSupportingDocumentRequired.value) {
        return "show warning"
      }

      if (!this.canNameProceed.value) {
        return "show danger"
      }

      return "show success"
    }

    return ""
  }

  iconClass(): string {
    if (this.nameToReserve.value.length > 0) {
      if (this.isChecking.value) {
        return "fa-spinner fa-spin"
      }

      if (this.isWarningRequired.value || this.isSupportingDocumentRequired.value) {
        return "fa-triangle-exclamation"
      }

      if (!this.canNameProceed.value) {
        return "fa-triangle-exclamation"
      }

      return "fa-circle-check"
    }

    return ""
  }

  validatingCopywriting(): string {
    return this.language.isMalay()
      ? "Penyemakan ketersediaan nama dengan SSM"
      : "Checking availability of name with SSM"
  }

  noticeContentCopywriting(): string {
    if (this.isChecking.value) {
      return this.language.isMalay()
        ? "Penyemakan ketersediaan nama dengan SSM"
        : "Checking availability of name with SSM"
    }

    if (
      this.canNameProceed.value &&
      this.validationRemarks.value.length <= 0 &&
      this.warningMessages.value.length <= 0
    ) {
      return this.language.isMalay()
        ? "Ini kelihatan baik, namun masih tertakluk kepada kelulusan akhir oleh SSM."
        : `This looks good, but still subject to final approval by SSM.`
    }

    return ""
  }

  pressEnterCopywriting(): string {
    if (this.isChecking.value) {
      return ""
    }

    if (!this.hasClickedEnter.value) {
      return this.language.isMalay()
        ? `Tekan butang 'Enter' untuk memulakan carian`
        : `Press 'Enter' to search SSM Database`
    }

    return ""
  }

  canProceed(): boolean {
    return this.nameToReserve.value.length >= 0 && this.canNameProceed.value //add additional requirement here
  }

  cleanName(): void {
    if (StringUtil.isNullOrEmpty(this.nameToReserve.value)) {
      return
    }

    let tempName = this.nameToReserve.value.trim().toUpperCase()
    tempName = tempName.replaceAll("SDN BHD", "")
    tempName = tempName.replaceAll("PRIVATE LIMITED", "")
    tempName = tempName.replaceAll("PTE LTD", "")
    tempName = tempName.replaceAll(/[^a-zA-Z0-9&() -.,]/g, "")
    tempName = tempName.replace(/\s+/g, " ")

    this.nameToCheck.value = tempName
  }

  resetValues(): void {
    this.canNameProceed.value = true
    this.isWarningRequired.value = false
    this.isSupportingDocumentRequired.value = false
    this.isDescriptionRequired.value = false
    this.warningMessages.value = ""
    this.validationRemarks.value = ""
  }

  getNameReservation(): NameReservation {
    this.nameReservation.name = this.nameToCheck.value
    this.nameReservation.description = this.description.value
    this.nameReservation.isAcceptable = this.canNameProceed.value
    this.nameReservation.isSupportingDocumentRequired = this.isSupportingDocumentRequired.value
    this.nameReservation.issueMessage = this.validationRemarks.value
    this.nameReservation.supportingDocumentId = this.uploadedFileId.value

    let copyNameReservation = new NameReservation("", "")
    copyNameReservation.clone(this.nameReservation)

    return copyNameReservation
  }

  getDraftInputForSaira(): string {
    if (!this.canAskForDrafts.value) {
      return ""
    }

    if (this.nameReservationChecker.value.validationResult.isMatchHumanName) {
      return `Draft me paragraph for reasons to use ${this.nameToReserve.value.toUpperCase()} as my company name ${this.nameToReserve.value.toUpperCase()} is ....`
    }

    return `Draft me paragraph for reasons to use ${this.nameToReserve.value.toUpperCase()} as my company name.`
  }

  getRecommendationInputForSaira(): string {
    if (!this.canAskForRecommendations.value) {
      return ""
    }

    return `You are an experienced Company Secretary in Malaysia. Suggest 3 new names for a new SDN BHD name in Malaysia that will abide the SSM Naming Guidelines for company that is similar to ${this.nameToReserve.value.toUpperCase()}. Your response must be in JSON format with proposed_names as the key and the value is an array of names.`
  }

  // On Saira completed
  onDraftReceived(response: any): void {
    let draft = new AskSairaNameDescriptionDraft(response)
    this.description.value = draft.description
  }

  onRecommendationsReceived(response: any): void {
    let proposedNames = new AskSairaNameSuggestions(response)
    this.nameRecommendations.value = proposedNames.proposedNames.map((name: string) => {
      return name.toUpperCase()
    })
    this.showNameRecommendations.value = true
  }

  onSuggestedNameClick(name: string): void {
    this.nameToReserve.value = name.replaceAll("sdn bhd", "").replaceAll("SDN BHD", "").replaceAll("Sdn Bhd", "")
  }

  inputAreaName(): string {
    return this.language.isMalay()
      ? "Sebab-sebab untuk Menggunakan Nama yang Dicadangkan"
      : "Reasons for the Use of the Proposed Name"
  }

  alternativeRecommendationLabel(): string {
    return this.language.isMalay() ? "untuk cadangan alternatif." : "for alternative recommendations."
  }

  draftSairaPrompt(): string {
    if (this.nameReservationChecker.value.validationResult.isMatchHumanName) {
      return this.language.isMalay()
        ? "Huraikan hubungan orang yang dinamakan bersama syarikat ini.<br>Tambah perihal perniagaan anda bagi mendapat draf.<br><br>Tekan Tanya untuk dapatkan draf."
        : "Describe the relationship of the company with the named person in the company name.<br>Add description of your business name, or nature of your business.<br><br>Click Ask to get the draft."
    }

    return this.language.isMalay()
      ? "Tambah perihal perniagaan anda bagi mendapat draf.<br><br>Tekan Tanya untuk dapatkan draf."
      : "Add description of your business name, or nature of your business.<br><br>Click Ask to get the draft."
  }

  suggestionSairaPrompt(): string {
    return this.language.isMalay()
      ? "Gambarkan nama yang anda mahu buat Sdn Bhd anda. Tekan Tanya untuk dapatkan nama."
      : "Describe the name that you want for your Sdn Bhd. Click Ask for the proposed names."
  }

  nameSuggestedBySaira(): string {
    return this.language.isMalay()
      ? "Sila pilih cadangan nama oleh SAIRA di bawah, atau cadangkan nama yang lain."
      : "Please select the suggested name by SAIRA below, or propose a different name"
  }

  selectThisName(): string {
    return this.language.isMalay() ? "Pilih Name Ini" : "Select this Name"
  }

  previewLabel(): string {
    return this.language.isMalay() ? "NAMA SYARIKAT ANDA SDN BHD" : "YOUR COMPANY NAME SDN BHD"
  }

  // Supporting document notices
  handleClick(event: MouseEvent | TouchEvent): void {
    if (!this.availabilityNoticeRef) {
      this.isFocusedOnAvailability.value = false
      return
    }

    if (!this.availabilityNoticeRef.contains(event.target as Node)) {
      this.isFocusedOnAvailability.value = false
      return
    }

    this.isFocusedOnAvailability.value = true
  }

  getClassForFileUploader(): string {
    if (
      this.isFocusedOnAvailability.value ||
      !this.isSupportingDocumentRequired.value ||
      this.uploadedFileId.value !== null
    ) {
      return ""
    }

    return "shake"
  }
}
