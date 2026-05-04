export enum WiseAiDocumentTypes {
  IC = "mykad",
  Passport = "passport",
}

// NOTE: At the time, we do not have clear picture of other codes
export enum WiseAiResponseCodes {
  Success = "SUCCESS",
}

export enum EkycRegistrationStep {
  Preparation = 1,
  Citizenship = 2,
  Camera = 3,
  Failure = 4,
}

export enum WiseAiGender {
  Male = "M",
  Female = "F",
}

export class WiseAiConstants {
  static WISE_AI_URL = "https://wiseconsole-live.wiseai.tech/"
}
