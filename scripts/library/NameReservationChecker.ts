import { CompanyNameFilter } from "../models/CompanyNameFilter"
import { Error } from "./Error"
import { StringUtil } from "../utils/String"
import { AdminSetting } from "../models/AdminSetting"
import { NameReservationValidationResult } from "../types/NameReservationValidationResult"
import { NameReservationConstants } from "../constants/NameReservations"
import { CompanyNameRegister } from "../models/CompanyNameRegister"

// NOTE: This library checks the name to be reserved by the company
export class NameReservationChecker {
  nameToCheck: string = ""

  registeredMalaysianNames: string[] = []
  badWords: string[] = []
  badWordExceptions: string[] = []

  royaltyCompanyNameFilters: CompanyNameFilter[] = []
  royaltyLists: string[] = []
  royaltyListExceptions: string[] = []

  gazetteCompanyNameFilters: CompanyNameFilter[] = []
  gazetteControlledWords: string[] = []
  gazetteControlledWordExceptions: string[] = []

  religiousWords: string[] = []
  religiousWordExceptions: string[] = []
  culturalWords: string[] = []
  culturalWordExceptions: string[] = []
  politicalWords: string[] = []
  politicalWordExceptions: string[] = []

  trademarkCompanyNameFilters: CompanyNameFilter[] = []
  trademarks: string[] = []
  trademarkExceptions: string[] = []

  naturalDisasterWords: string[] = []
  naturalDisasterWordExceptions: string[] = []

  omittedList: string[] = []

  language = useLanguage()

  validationResult: NameReservationValidationResult = new NameReservationValidationResult()

  constructor() {
    this.init()
  }

  async init(): Promise<void> {
    try {
      await Promise.all([
        this.fetchRegisteredMalaysianNames(),
        this.fetchBadWords(),
        this.fetchRoyaltyLists(),
        this.fetchGazetteControlledWords(),
        this.fetchReligiousWords(),
        this.fetchCulturalWords(),
        this.fetchPoliticalWords(),
        this.fetchTrademarks(),
        this.fetchNaturalDisasterWords(),
        this.fetchOmittedList(),
      ])
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error: Error = new Error(Error.ERROR_TYPE_API, "Unable to populate filters. Please try again.")
        error.handle()
      }
    }
  }

  setName(name: string): void {
    if (StringUtil.isNullOrEmpty(name)) {
      this.nameToCheck = ""
    }

    this.nameToCheck = name
      .trim()
      .toUpperCase()
      .replaceAll("SDN BHD", "")
      .replaceAll("PRIVATE LIMITED", "")
      .replaceAll("PTE LTD", "")
      .replaceAll(/[^a-zA-Z0-9&() -.,]/g, "")
      .replace(/\s+/g, " ")

    this.validationResult = new NameReservationValidationResult()
    this.validationResult.name = this.nameToCheck
  }

  //#region initialization
  async fetchOmittedList(): Promise<void> {
    this.omittedList = []
    try {
      let repository = useAdminSettingStore()
      await repository.fetchAllOld(null)
      if (repository.adminSettings.length <= 0) {
        return
      }
      let adminSetting = new AdminSetting(repository.adminSettings[0])

      if (!adminSetting.nameMetaData || !adminSetting.nameMetaData.omited) {
        return
      }

      this.omittedList = adminSetting.nameMetaData.omited.toUpperCase().split(",")
    } catch (e: any) {
      throw e
    }
  }

  async fetchRegisteredMalaysianNames(): Promise<void> {
    if (this.registeredMalaysianNames.length > 0) {
      return
    }

    const repository = useCompanyNameFilterStore()
    const slug = "search=in-malaysian-names&limit=26"
    const response = await repository.fetchAllOld(slug)
    if (response.length > 0) {
      let companyNameFilters = response.map((r: any) => {
        return new CompanyNameFilter(r)
      })

      this.registeredMalaysianNames = companyNameFilters
        .filter((cnf: CompanyNameFilter) => {
          return cnf.metaData !== null && cnf.metaData.similar
        })
        .flatMap((cnf: CompanyNameFilter) => {
          return cnf.metaData.similar.toUpperCase().replace(/-/g, " ").split(", ")
        })
    }
  }

  async fetchBadWords(): Promise<void> {
    if (this.badWords.length > 0) {
      return
    }

    const repository = useCompanyNameFilterStore()
    const slug = 'filter=[["keyword=bad-words"]]'
    const response = await repository.fetchAllOld(slug)
    if (response.length > 0) {
      let companyNameFilters = response.map((r: any) => {
        return new CompanyNameFilter(r)
      })

      this.badWords = companyNameFilters
        .filter((cnf: CompanyNameFilter) => {
          return cnf.metaData !== null && cnf.metaData.similar
        })
        .flatMap((cnf: CompanyNameFilter) => {
          return cnf.metaData.similar.toUpperCase().replace(/-/g, " ").split(", ")
        })

      this.badWordExceptions = companyNameFilters
        .filter((cnf: CompanyNameFilter) => {
          return cnf.metaData !== null && cnf.metaData.except
        })
        .flatMap((cnf: CompanyNameFilter) => {
          return cnf.metaData.except.toUpperCase().replace(/-/g, " ").split(", ")
        })
    }
  }

  async fetchRoyaltyLists(): Promise<void> {
    if (this.royaltyLists.length > 0) {
      return
    }

    const repository = useCompanyNameFilterStore()
    const slug = 'filter=[["keyword=royalties-matters"]]'
    const response = await repository.fetchAllOld(slug)
    if (response.length > 0) {
      this.royaltyCompanyNameFilters = response.map((r: any) => {
        return new CompanyNameFilter(r)
      })

      this.royaltyLists = this.royaltyCompanyNameFilters
        .filter((cnf: CompanyNameFilter) => {
          return cnf.metaData !== null && cnf.metaData.similar
        })
        .flatMap((cnf: CompanyNameFilter) => {
          return cnf.metaData.similar.toUpperCase().replace(/-/g, " ").split(", ")
        })

      this.royaltyListExceptions = this.royaltyCompanyNameFilters
        .filter((cnf: CompanyNameFilter) => {
          return cnf.metaData !== null && cnf.metaData.except
        })
        .flatMap((cnf: CompanyNameFilter) => {
          return cnf.metaData.except.toUpperCase().replace(/-/g, " ").split(", ")
        })
    }
  }

  async fetchGazetteControlledWords(): Promise<void> {
    if (this.gazetteControlledWords.length > 0) {
      return
    }

    const repository = useCompanyNameFilterStore()
    const slug = "search=related-matters&limit=100"
    const response = await repository.fetchAllOld(slug)
    if (response.length > 0) {
      this.gazetteCompanyNameFilters = response
        .map((r: any) => {
          return new CompanyNameFilter(r)
        })
        .filter((cnf: CompanyNameFilter) => {
          return cnf.keyword.includes("related-matters")
        })

      this.gazetteControlledWords = this.gazetteCompanyNameFilters
        .filter((cnf: CompanyNameFilter) => {
          return cnf.metaData !== null && cnf.metaData.similar
        })
        .flatMap((cnf: CompanyNameFilter) => {
          return cnf.metaData.similar.toUpperCase().replace(/-/g, " ").split(", ")
        })

      this.gazetteControlledWordExceptions = this.gazetteCompanyNameFilters
        .filter((cnf: CompanyNameFilter) => {
          return cnf.metaData !== null && cnf.metaData.except
        })
        .flatMap((cnf: CompanyNameFilter) => {
          return cnf.metaData.except.toUpperCase().replace(/-/g, " ").split(", ")
        })
    }
  }

  async fetchReligiousWords(): Promise<void> {
    if (this.religiousWords.length > 0) {
      return
    }

    const repository = useCompanyNameFilterStore()
    const slug = "search=religious"
    const response = await repository.fetchAllOld(slug)
    if (response.length > 0) {
      let companyNameFilters = response.map((r: any) => {
        return new CompanyNameFilter(r)
      })

      this.religiousWords = companyNameFilters
        .filter((cnf: CompanyNameFilter) => {
          return cnf.metaData !== null && cnf.metaData.similar
        })
        .flatMap((cnf: CompanyNameFilter) => {
          return cnf.metaData.similar.toUpperCase().replace(/-/g, " ").split(", ")
        })

      this.religiousWordExceptions = companyNameFilters
        .filter((cnf: CompanyNameFilter) => {
          return cnf.metaData !== null && cnf.metaData.except
        })
        .flatMap((cnf: CompanyNameFilter) => {
          return cnf.metaData.except.toUpperCase().replace(/-/g, " ").split(", ")
        })
    }
  }

  async fetchCulturalWords(): Promise<void> {
    if (this.culturalWords.length > 0) {
      return
    }

    const repository = useCompanyNameFilterStore()
    const slug = "search=cultural"
    const response = await repository.fetchAllOld(slug)
    if (response.length > 0) {
      let companyNameFilters = response.map((r: any) => {
        return new CompanyNameFilter(r)
      })

      this.culturalWords = companyNameFilters
        .filter((cnf: CompanyNameFilter) => {
          return cnf.metaData !== null && cnf.metaData.similar
        })
        .flatMap((cnf: CompanyNameFilter) => {
          return cnf.metaData.similar.toUpperCase().replace(/-/g, " ").split(", ")
        })

      this.culturalWordExceptions = companyNameFilters
        .filter((cnf: CompanyNameFilter) => {
          return cnf.metaData !== null && cnf.metaData.except
        })
        .flatMap((cnf: CompanyNameFilter) => {
          return cnf.metaData.except.toUpperCase().replace(/-/g, " ").split(", ")
        })
    }
  }

  async fetchPoliticalWords(): Promise<void> {
    if (this.politicalWords.length > 0) {
      return
    }

    const repository = useCompanyNameFilterStore()
    const slug = "search=political"
    const response = await repository.fetchAllOld(slug)
    if (response.length > 0) {
      let companyNameFilters = response.map((r: any) => {
        return new CompanyNameFilter(r)
      })

      this.politicalWords = companyNameFilters
        .filter((cnf: CompanyNameFilter) => {
          return cnf.metaData !== null && cnf.metaData.similar
        })
        .flatMap((cnf: CompanyNameFilter) => {
          return cnf.metaData.similar.toUpperCase().replace(/-/g, " ").split(", ")
        })

      this.politicalWordExceptions = companyNameFilters
        .filter((cnf: CompanyNameFilter) => {
          return cnf.metaData !== null && cnf.metaData.except
        })
        .flatMap((cnf: CompanyNameFilter) => {
          return cnf.metaData.except.toUpperCase().replace(/-/g, " ").split(", ")
        })
    }
  }

  async fetchTrademarks(): Promise<void> {
    if (this.trademarks.length > 0) {
      return
    }

    const repository = useCompanyNameFilterStore()
    const slug = "search=trademark-brand&limit=20"
    const response = await repository.fetchAllOld(slug)
    if (response.length > 0) {
      this.trademarkCompanyNameFilters = response.map((r: any) => {
        return new CompanyNameFilter(r)
      })

      this.trademarks = this.trademarkCompanyNameFilters
        .filter((cnf: CompanyNameFilter) => {
          return cnf.metaData !== null && cnf.metaData.similar
        })
        .flatMap((cnf: CompanyNameFilter) => {
          return cnf.metaData.similar.toUpperCase().replace(/-/g, " ").split(", ")
        })

      this.trademarkExceptions = this.trademarkCompanyNameFilters
        .filter((cnf: CompanyNameFilter) => {
          return cnf.metaData !== null && cnf.metaData.except
        })
        .flatMap((cnf: CompanyNameFilter) => {
          return cnf.metaData.except.toUpperCase().replace(/-/g, " ").split(", ")
        })
    }
  }

  async fetchNaturalDisasterWords(): Promise<void> {
    if (this.naturalDisasterWords.length > 0) {
      return
    }

    const repository = useCompanyNameFilterStore()
    const slug = 'filter=[["keyword=natural-disaster"]]'
    const response = await repository.fetchAllOld(slug)
    if (response.length > 0) {
      let companyNameFilters = response.map((r: any) => {
        return new CompanyNameFilter(r)
      })

      this.naturalDisasterWords = companyNameFilters
        .filter((cnf: CompanyNameFilter) => {
          return cnf.metaData !== null && cnf.metaData.similar
        })
        .flatMap((cnf: CompanyNameFilter) => {
          return cnf.metaData.similar.toUpperCase().replace(/-/g, " ").split(", ")
        })

      this.naturalDisasterWordExceptions = companyNameFilters
        .filter((cnf: CompanyNameFilter) => {
          return cnf.metaData !== null && cnf.metaData.except
        })
        .flatMap((cnf: CompanyNameFilter) => {
          return cnf.metaData.except.toUpperCase().replace(/-/g, " ").split(", ")
        })
    }
  }
  //#endregion

  //#region validation
  isMM2Hmatch(): boolean {
    const mm2hRegexCheck = /\bMM2H\b(?!\)(?=\s|$))|(?<!\()(\bMM2H\b)(?=\s|$)/i
    return mm2hRegexCheck.test(this.nameToCheck)
  }

  checkMM2H(): void {
    if (!this.isMM2Hmatch()) {
      return
    }

    this.nameToCheck = this.nameToCheck.replace(/\bMM2H|(MM2H|MM2H)|(MM2H)\b/i, "").trim()
    this.nameToCheck += " (MM2H)"
    this.validationResult.name = this.nameToCheck
    let validationRemark = `Your Proposed Name contains: <b>MM2H</b>. <br>
        SSM and MOTAC requires MM2H to be in the following manner:
        <br> <br>
        <b><i>YOUR PROPOSED NAME</i> (MM2H) SDN BHD</b>`
    if (this.language.isMalay()) {
      validationRemark = `
          Nama yang dicadangkan mengandungi <b>MM2H</b>.<br>
          SSM dan MOTAC mewajibkan MM2H dalam format berikut: <br><br>
          <b><i>NAMA YANG DICADANGKAN</i> (MM2H) SDN BHD</b>
        `
    }
    this.validationResult.validationRemarks.push(validationRemark)
  }

  charCount(): number {
    return this.nameToCheck.replace(/\s/g, "").length
  }

  characterCount(): number {
    const stopWords = NameReservationConstants.MALAY_STOP_WORDS.concat(NameReservationConstants.ENGLISH_STOP_WORDS)
    const wordsInName = this.nameToCheck.split(" ")
    let characterCount = 0

    wordsInName.forEach((word: string) => {
      if (stopWords.includes(word)) {
        characterCount++
      } else {
        characterCount += word.length
      }
    })

    return characterCount
  }

  isNameTooShort(): boolean {
    return this.charCount() <= 5 || this.characterCount() <= 3
  }

  isNameTooLong(): boolean {
    return this.charCount() >= 35
  }

  checkCharCount(): void {
    if (!this.isNameTooShort() && !this.isNameTooLong()) {
      return
    }

    if (this.isNameTooShort()) {
      this.validationResult.isAccepted = false
      this.validationResult.isTooShort = true
      const remarks = this.language.isMalay() ? "Nama yang dicadangkan terlalu umum." : "Proposed Name is too general."
      this.validationResult.validationRemarks.push(remarks)
      this.validationResult.canAskForRecommendation = true
    }

    if (this.isNameTooLong()) {
      this.validationResult.isAccepted = false
      this.validationResult.isTooLong = true
      const remarks = this.language.isMalay() ? "Nama yang dicadangkan terlalu panjang." : "Proposed Name is too long."
      this.validationResult.validationRemarks.push(remarks)
      this.validationResult.canAskForRecommendation = true
    }
  }

  isSpecialCharacterCheckPass(): boolean {
    // If no special characters, return
    if (/^[a-zA-Z0-9]+$/.test(this.nameToCheck)) {
      return true
    }

    // only accept () , . - &
    if (!/^[a-zA-Z0-9&\-.,() ]+$/.test(this.nameToCheck)) {
      return false
    }

    // Check for consecutive special characters
    if (/[&\-.,()]{2,}/.test(this.nameToCheck)) {
      return false
    }

    // Check for empty parentheses ()
    if (/\(\)/.test(this.nameToCheck)) {
      return false
    }

    // Check for balanced parentheses
    let balance = 0
    for (const char of this.nameToCheck) {
      if (char === "(") {
        balance++
      } else if (char === ")") {
        balance--
        if (balance < 0) {
          return false
        }
      }
    }
    if (balance !== 0) {
      return false
    }

    return true
  }

  checkSpecialCharacters(): void {
    if (this.isSpecialCharacterCheckPass()) {
      return
    }

    this.validationResult.isAccepted = false
    const remarks = this.language.isMalay()
      ? "Nama yang dicadangkan mengandungi aksara/simbol yang tidak dibenarkan."
      : "This Proposed Name contain invalid special characters."
    this.validationResult.validationRemarks.push(remarks)
    this.validationResult.canAskForRecommendation = true
  }

  isMatchedWithSensitiveWords(): boolean {
    const sensitiveWords = this.religiousWords.concat(this.culturalWords, this.politicalWords)
    const sensitiveExceptions = this.religiousWordExceptions.concat(
      this.culturalWordExceptions,
      this.politicalWordExceptions
    )
    const sensitiveRegexPattern = new RegExp(sensitiveExceptions.join("|"), "g")
    const nameWithoutSensitiveException = this.nameToCheck.replace(sensitiveRegexPattern, "")
    const sensitiveRegexCheck = new RegExp(`\\b(${sensitiveWords.join("|")})\\b`, "i")
    return sensitiveRegexCheck.test(nameWithoutSensitiveException)
  }

  checkSensitiveWords(): void {
    if (!this.isMatchedWithSensitiveWords()) {
      return
    }

    this.validationResult.isAccepted = false
    const remarks = this.language.isMalay()
      ? "Nama yang dicadangkan mengandungi nama yang sensitif dari segi agama, politik dan budaya."
      : "This Proposed Name contains religious, political and cultural sensitive name."
    this.validationResult.validationRemarks.push(remarks)
    this.validationResult.canAskForRecommendation = true
  }

  isMatchedWithBadWords(): boolean {
    const badWordRegexPattern = new RegExp(this.badWordExceptions.join("|"), "g")
    const nameWithoutBadWordException = this.nameToCheck.replace(badWordRegexPattern, "")
    const badwordRegexCheck = new RegExp(`\\b(${this.badWords.join("|")})\\b`, "i")
    return badwordRegexCheck.test(nameWithoutBadWordException)
  }

  checkBadWords(): void {
    if (!this.isMatchedWithBadWords()) {
      return
    }

    this.validationResult.isAccepted = false
    const remarks = this.language.isMalay()
      ? "<b>Nama yang Dicadangkan</b> ini dianggap sebagai tidak wajar dan tidak boleh diterima."
      : "This <b>Proposed Name</b> is deemed undesirable and unacceptable."
    this.validationResult.validationRemarks.push(remarks)
    this.validationResult.canAskForRecommendation = true
  }

  async isNameRegisteredInSSM(): Promise<boolean> {
    if (StringUtil.isNullOrEmpty(this.nameToCheck)) {
      return false
    }

    let repository = useMyDataNameSearchStore()
    const sdnbhdName = `${this.nameToCheck} SDN BHD`
    await repository.nameSearch(sdnbhdName)
    if (!repository.myDataNameSearch?.available) {
      // Add to registry
      let newCompanyNameRegister = new CompanyNameRegister()
      newCompanyNameRegister.name = sdnbhdName
      newCompanyNameRegister.nameType = "sdnbhd"
      newCompanyNameRegister.status = "active"
      let companyNameRegisterRepository = useCompanyNameRegisterStore()
      await newCompanyNameRegister.create(companyNameRegisterRepository)
      return true
    }

    const bhdName = `${this.nameToCheck} BERHAD`
    await repository.nameSearch(bhdName)
    if (!repository.myDataNameSearch?.available) {
      // Add to registry
      let newCompanyNameRegister = new CompanyNameRegister()
      newCompanyNameRegister.name = bhdName
      newCompanyNameRegister.nameType = "berhad"
      newCompanyNameRegister.status = "active"
      let companyNameRegisterRepository = useCompanyNameRegisterStore()
      await newCompanyNameRegister.create(companyNameRegisterRepository)
      return true
    }
    return false
  }

  async checkNameRegistry(): Promise<void> {
    let isNameRegistered = await this.isNameRegisteredInSSM()
    if (!isNameRegistered) {
      return
    }

    this.validationResult.isAccepted = false
    const remarks = this.language.isMalay()
      ? "Sdn Bhd ini sudah berdaftar dengan SSM."
      : "This Sdn Bhd already exist with SSM."
    this.validationResult.validationRemarks.push(remarks)
    this.validationResult.canAskForRecommendation = true
  }

  wordCount(): number {
    return this.nameToCheck.trim().split(" ").length
  }

  checkWordCount(): void {
    if (this.wordCount() > 1) {
      return
    }

    this.validationResult.isWarningRequired = true
    const remarks = this.language.isMalay()
      ? `Kami syorkan: ${this.nameToCheck.toUpperCase()} TECHNOLOGIES / RESOURCES / NETWORK atau lain-lain berdasarkan perihal perniagaan anda.`
      : `We recommend: ${this.nameToCheck.toUpperCase()} TECHNOLOGIES / RESOURCES / NETWORK or etc based on your Business Nature.`
    this.validationResult.validationRemarks.push(remarks)
    const warningMessage = this.language.isMalay()
      ? "Betulkan Nama yang dicadangkan seperti yang disyorkan atau masukkan perihalan tambahan pada Nama Dicadangkan anda atau anda boleh meneruskan atas risiko penolakan daripada pihak SSM."
      : "Amend the Proposed Name as suggested or insert more description to your Proposed Name or you can proceed at your own risk of rejection from SSM."
    this.validationResult.warningMessages.push(warningMessage)
    this.validationResult.canAskForRecommendation = true
    this.validationResult.canAskForDrafts = true
    this.validationResult.isDescriptionRequired = true
  }

  // Should we use Gemini AI for this?
  async getSimilarNamesInRegistry(): Promise<string[]> {
    const nameExcludingOmittedWords = this.nameToCheck
      .split(" ")
      .filter((word: string) => {
        return !this.omittedList.includes(word)
      })
      .join(" ")

    let companyNameRegisterRepository = useCompanyNameRegisterStore()
    const slug = `search=${nameExcludingOmittedWords}`
    const companyNameRegisters = await companyNameRegisterRepository.fetchAllOld(slug)
    if (companyNameRegisters.length <= 0) {
      return []
    }

    const matchedNames = companyNameRegisters.map((cnr: any) => {
      let companyNameRegister = new CompanyNameRegister(cnr)
      return companyNameRegister.name.toUpperCase()
    })

    let similarNames: string[] = []
    const wordsInName: string[] = this.nameToCheck.split(" ")
    for (const matchedName of matchedNames) {
      // Check if number of words is within the allowed difference range
      const nameWords = matchedName.split(" ")
      if (wordsInName.length - nameWords.length > 1) {
        break
      }

      // Check similarities
      wordsInName.forEach((wordsInName) => {
        let differences = matchedName
        differences = differences.replace(wordsInName, "")
        const check = differences.split(" ").filter((char: string) => {
          return char.length > 2
        })
        if (check.length <= 1) {
          similarNames.push(matchedName)
        }

        differences = matchedName
        differences = differences.replace(wordsInName.slice(2), "")
        const check2 = differences.split(" ").filter((char: string) => {
          return char.length > 2
        })
        if (check2.length <= 1) {
          similarNames.push(matchedName)
        }

        differences = matchedName
        differences = differences.replace(wordsInName.slice(-2), "")
        const check3 = differences.split(" ").filter((char: string) => {
          return char.length > 2
        })
        if (check3.length <= 1) {
          similarNames.push(matchedName)
        }

        differences = matchedName
        differences = differences.replace(wordsInName.slice(1, -1), "")
        const check4 = differences.split(" ").filter((char: string) => {
          return char.length > 2
        })
        if (check4.length <= 1) {
          similarNames.push(matchedName)
        }
      })
    }

    return [...new Set(similarNames)]
  }

  async checkSimilarNamesInRegistry(): Promise<void> {
    let similarNames = await this.getSimilarNamesInRegistry()
    if (similarNames.length <= 0) {
      return
    }

    const similarCompanyNames = similarNames
      .map((sn: string) => {
        return `${sn} SDN BHD`
      })
      .join(", ")

    this.validationResult.isWarningRequired = true
    this.validationResult.isSupportingDocumentRequired = true
    const remarks = this.language.isMalay()
      ? `Nama yang serupa, <b>${similarCompanyNames.toUpperCase()}</b> berdaftar dengan SSM. Jika anda adalah Pengarah/Pemilik Sdn Bhd tersebut, sila muat naik surat kebenaran.`
      : `A similar Name, <b>${similarCompanyNames.toUpperCase()}</b> exist with SSM. If you are the director/owner of that Sdn Bhd, please upload a letter of consent.`
    this.validationResult.validationRemarks.push(remarks)
    const warningMessage = this.language.isMalay()
      ? "Sila muat naik Surat Kebenaran yang sudah dilengkapkan untuk menggunakan Nama yang dicadangkan."
      : "Please upload a completed Letter of Consent to use this Proposed Name."
    this.validationResult.warningMessages.push(warningMessage)
    this.validationResult.isDescriptionRequired = true

    this.validationResult.canAskForRecommendation = true
    this.validationResult.canAskForDrafts = true
  }

  isMatchedWithRegisteredMalaysianNames(): boolean {
    const malaysianNameRegexCheck = new RegExp(`\\b(${this.registeredMalaysianNames.join("|")})\\b`, "i")
    return malaysianNameRegexCheck.test(this.nameToCheck)
  }

  checkWithRegisteredMalaysianNames(): void {
    if (!this.isMatchedWithRegisteredMalaysianNames()) {
      return
    }

    this.validationResult.isWarningRequired = true
    this.validationResult.isSupportingDocumentRequired = true
    const remarks = this.language.isMalay()
      ? "Nama Yang Dicadangkan ini merupakan nama individu yang lazim di Malaysia. Dokumen sokongan diperlukan."
      : "This Proposed Name is a common name of a person in Malaysia. Supporting document is required."
    this.validationResult.validationRemarks.push(remarks)
    const warningMessage = this.language.isMalay()
      ? "Sila jelaskan kegunaan Nama Individu ini dan hubungannya dengan Pengarah/Pemegang Saham Sdn Bhd ini."
      : "Please explain the use of this Person Name and the relationship with the Directors/Shareholders of this Sdn Bhd."
    this.validationResult.warningMessages.push(warningMessage)
    this.validationResult.isDescriptionRequired = true
    this.validationResult.isMatchHumanName = true

    this.validationResult.canAskForRecommendation = true
    this.validationResult.canAskForDrafts = true
  }

  getMatchedGazettedControlledWords(): string[] {
    const gazetteRegexPattern = new RegExp(this.gazetteControlledWordExceptions.join("|"), "g")
    const nameWithoutGazetteException = this.nameToCheck.replace(gazetteRegexPattern, "")
    const gazetteRegexCheck = new RegExp(`\\b(${this.gazetteControlledWords.join("|")})\\b`, "g")

    const matches = nameWithoutGazetteException.match(gazetteRegexCheck)
    if (!matches) {
      return []
    }

    return [...new Set(matches)]
  }

  checkGazettedControlledWords(): void {
    let matchedGazettedControlledWords = this.getMatchedGazettedControlledWords()
    if (matchedGazettedControlledWords.length <= 0) {
      return
    }

    let gazettedMatchedString = matchedGazettedControlledWords.join(", ")
    this.validationResult.isWarningRequired = true
    this.validationResult.isSupportingDocumentRequired = true
    const remarks = this.language.isMalay()
      ? `Nama Yang Dicadangkan mengandungi perkataan yang digazet/dikawal (<b>${gazettedMatchedString}</b>) oleh Undang-Undang Malaysia. Sila muat naik dokumen sokongan.`
      : `This Proposed Name contains a gazette/controlled word (<b>${gazettedMatchedString}</b>) by the laws of Malaysia. Please upload supporting document.`
    this.validationResult.validationRemarks.push(remarks)
    const warningMessage = this.language.isMalay()
      ? "Sila muat naik Surat Kelulusan daripada mana-mana Pihak Berkuasa yang Berkenaan untuk menggunakan Nama yang Dicadangkan ini."
      : "Please upload a Letter of Approval from any Relevant Authority to use this Proposed Name."
    this.validationResult.warningMessages.push(warningMessage)
    this.validationResult.isDescriptionRequired = true

    this.validationResult.canAskForRecommendation = true
    this.validationResult.canAskForDrafts = true
  }

  isMatchedWithTrademarks(): boolean {
    const trademarkRegexPattern = new RegExp(this.trademarkExceptions.join("|"), "g")
    const nameWithoutTrademarkException = this.nameToCheck.replace(trademarkRegexPattern, "")
    const trademarkRegexCheck = new RegExp(`\\b(${this.trademarks.join("|")})\\b`, "i")

    return trademarkRegexCheck.test(nameWithoutTrademarkException)
  }

  checkTrademarks(): void {
    if (!this.isMatchedWithTrademarks()) {
      return
    }

    this.validationResult.isWarningRequired = true
    this.validationResult.isSupportingDocumentRequired = true
    const remarks = this.language.isMalay()
      ? "Nama yang Dicadangkan ini mengandungi jenama atau tanda dagangan yang terkenal."
      : "This Proposed Name contains a well known brand or trademark."
    this.validationResult.validationRemarks.push(remarks)
    const warningMessage = this.language.isMalay()
      ? "Sila jelaskan kegunaan Nama yang Dicadangkan ini dan muat naik Surat Kebenaran untuk Menggunakan Nama tersebut. Individu yang mewakili jenama/tanda dagangan juga mesti dimasukkan sebagai Pemegang Saham Sdn Bhd yang baharu ini."
      : "Please explain the use of this Proposed Name and Upload a Letter to Use this Name. A person representing the brand/trademark must also be included as a Shareholder of this New Sdn Bhd."
    this.validationResult.warningMessages.push(warningMessage)
    this.validationResult.isDescriptionRequired = true

    this.validationResult.canAskForRecommendation = true
    this.validationResult.canAskForDrafts = true
  }

  isMatchedWithNaturalDisasterWords(): boolean {
    const naturalDisasterRegexPattern = new RegExp(this.naturalDisasterWordExceptions.join("|"), "g")
    const nameWithoutNaturalDisasterException = this.nameToCheck.replace(naturalDisasterRegexPattern, "")
    const naturalDisasterRegexCheck = new RegExp(`\\b(${this.naturalDisasterWords.join("|")})\\b`, "i")

    return naturalDisasterRegexCheck.test(nameWithoutNaturalDisasterException)
  }

  checkNaturalDisasterWords(): void {
    if (!this.isMatchedWithNaturalDisasterWords()) {
      return
    }

    this.validationResult.isWarningRequired = true
    this.validationResult.isSupportingDocumentRequired = true
    const remarks = this.language.isMalay()
      ? "Nama yang Dicadangkan adalah bencana alam yang diketahui dalam bahasa yang mudah dan jelas."
      : "The Proposed Name is a known natural disaster in simple plain language."
    this.validationResult.validationRemarks.push(remarks)
    const warningMessage = this.language.isMalay()
      ? "Jika nama ini digunakan secara kreatif atau metafora, sila nyatakan secara ringkas maksud yang dimaksudkan untuk atau berkaitan dengan Perniagaan anda."
      : "If the name is used creatively or metaphorically, briefly state the intended meaning for or related to your Business."
    this.validationResult.warningMessages.push(warningMessage)
    this.validationResult.isDescriptionRequired = true

    this.validationResult.canAskForRecommendation = true
    this.validationResult.canAskForDrafts = true
  }

  isMatchedWithRoyalties(): boolean {
    const royaltyRegexPattern = new RegExp(this.royaltyListExceptions.join("|"), "g")
    const nameWithoutRoyaltyExption = this.nameToCheck.replace(royaltyRegexPattern, "")
    const royaltyRegexCheck = new RegExp(`\\b(${this.royaltyLists.join("|")})\\b`, "i")

    return royaltyRegexCheck.test(nameWithoutRoyaltyExption)
  }

  getMatchedRoyaltyDescription(): string {
    const royaltyRegexPattern = new RegExp(this.royaltyListExceptions.join("|"), "g")
    const nameWithoutRoyaltyExption = this.nameToCheck.replace(royaltyRegexPattern, "")
    const royaltyRegexCheck = new RegExp(`\\b(${this.royaltyLists.join("|")})\\b`, "i")

    let matches = nameWithoutRoyaltyExption.match(royaltyRegexCheck)
    if (!matches) {
      return ""
    }
    let description = ""
    matches.forEach((matchedWord: string) => {
      const matchedRoyaltyCompanyNameFilter = this.royaltyCompanyNameFilters.find((cnf: CompanyNameFilter) => {
        return cnf.metaData.similar.toUpperCase().replace(/-/g, " ").split(", ").includes(matchedWord)
      })
      if (!matchedRoyaltyCompanyNameFilter) {
        return
      }

      description = matchedRoyaltyCompanyNameFilter.description
    })

    return description
  }

  checkRoyalties(): void {
    if (!this.isMatchedWithRoyalties()) {
      return
    }

    let description = this.getMatchedRoyaltyDescription()
    if (description.length > 0) {
      description = description.replaceAll("<p><br></p>", "") // formatting is important
    }

    this.validationResult.isWarningRequired = true
    this.validationResult.isSupportingDocumentRequired = true
    const remarks = this.language.isMalay()
      ? "Nama yang Dicadangkan ini mencadangkan kaitan dengan Institusi Diraja Malaysia."
      : "This Proposed Name suggest a connection with the Royal Institution of Malaysia."
    this.validationResult.validationRemarks.push(description.length > 0 ? description : remarks)
    const warningMessage = this.language.isMalay()
      ? "Sila muat naik Surat Persetujuan daripada Institusi Diraja Malaysia yang berkaitan. Sekiranya Nama yang Dicadangkan ini tiada kaitan, sila berikan penjelasan."
      : "Please upload a Letter of Consent from the relevant Royal Institution of Malaysia. If the Proposed Name has no connection whatsoever, please explain."
    this.validationResult.warningMessages.push(warningMessage)
    this.validationResult.isDescriptionRequired = true

    this.validationResult.canAskForRecommendation = true
    this.validationResult.canAskForDrafts = true
  }

  async validate(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.nameToCheck)) {
      this.validationResult.isAccepted = false
      this.validationResult.reasonsToReject.push(this.language.isMalay() ? "Tiada nama diberikan." : "Name is empty.")
      return
    }

    this.checkMM2H()

    this.checkCharCount()
    if (!this.validationResult.isAccepted) {
      return
    }

    this.checkSpecialCharacters()
    if (!this.validationResult.isAccepted) {
      return
    }

    this.checkSensitiveWords()
    if (!this.validationResult.isAccepted) {
      return
    }

    this.checkBadWords()
    if (!this.validationResult.isAccepted) {
      return
    }

    await this.checkNameRegistry()
    if (!this.validationResult.isAccepted) {
      return
    }

    this.checkWordCount()
    this.checkSimilarNamesInRegistry()
    this.checkWithRegisteredMalaysianNames()
    this.checkNaturalDisasterWords()
    this.checkGazettedControlledWords()
    this.checkTrademarks()
    this.checkRoyalties()
  }
  //#endregion
}
