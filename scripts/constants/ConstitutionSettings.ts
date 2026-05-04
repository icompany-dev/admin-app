import { ConstitutionSettingDescription } from "~/scripts/types/constitution-settings/ConstitutionSettingDescription"
import { ConstitutionSettingDefinition } from "../types/constitution-settings/ConstitutionSettingDefinition"

export enum CompanyTypes {
  PrivateLimitedByShares = "private-limited-by-shares",
}

export enum ConstitutionSettingPositionOfVariable {
  Beginning = "beginning",
  Middle = "middle",
  End = "end",
}

export enum ConstitutionSettingMeetingVenue {
  Physical = "physical",
  Hybrid = "hybrid",
  Virtual = "virtual",
}

export enum ConstitutionSettingSealCustodyLocation {
  RegisteredOffice = 'registered-office',
  Cosec = 'cosec',
  Other = 'other'
}

export enum ConstitutionSettingSealSignRequirement {
  TwoDirectors = 'two-directors',
  OneDirector = 'one-director',
  DirectorCosec = 'director-cosec',
  DirectorAuthorisedPerson = 'director-authorised'
}
export class ConstitutionSettings {
  static TYPE_PRIVATE_LIMITED_BY_SHARES = new ConstitutionSettingDescription(
    CompanyTypes.PrivateLimitedByShares,
    "private company limited by shares"
  )

  static DEFINITIONS_PART_1: ConstitutionSettingDefinition[] = [
    new ConstitutionSettingDefinition(
      "Act",
      "means the Companies Act 2016   and any statutory modification, amendment or re-enactment thereof and any and every other subsidiary legislation for the time being in force made thereunder"
    ),
    new ConstitutionSettingDefinition("Board", "means the Board of Directors for the time being of the Company."),
    new ConstitutionSettingDefinition("Business", "means any business activities undertaken by the Company."),
    new ConstitutionSettingDefinition(
      "Business Days",
      "means a day (other than a Saturday, Sunday or public holiday) in which banks licensed to carry out business under the Financial Services Act 2013 are open for business in",
      "baseOfOperations",
      ConstitutionSettingPositionOfVariable.End
    ),
    new ConstitutionSettingDefinition(
      "Casual Vacancy",
      "means a vacancy in the office of a Director arising by reason of the Director’s death, resignation, removal, disqualification, incapacity, or otherwise ceasing to hold office, occurring between general meetings."
    ),
    new ConstitutionSettingDefinition(
      "Company",
      "or by whatever name from time to time called.",
      "companyNameWithRegistrationNumber",
      ConstitutionSettingPositionOfVariable.Beginning
    ),
  ]

  static DEFINITIONS_PART_2: ConstitutionSettingDefinition[] = [
    new ConstitutionSettingDefinition(
      "Constitution",
      "The Constitution as originally framed, or as from time to time altered by Special Resolution."
    ),
    new ConstitutionSettingDefinition("Director", "The Directors for the time being of the Company."),
    new ConstitutionSettingDefinition("Meeting", "a meeting of the Member(s) of the Company."),
    new ConstitutionSettingDefinition("Ordinary Shares", "Ordinary shares in the capital of the Company."),
    new ConstitutionSettingDefinition(
      "Ordinary Resolution",
      "means a resolution passed by a simple majority of more than half of the Members who are entitled to vote and do vote in person, or where proxies are allowed, by proxy at a Meeting, or by written resolution, in accordance with Section 291 of the Act."
    ),
    new ConstitutionSettingDefinition(
      "Special Resolution",
      "means a resolution passed by a majority of not less than seventy-five per centum (75%) of the Members who are entitled to vote and do vote in person, or where proxies are allowed, by proxy at a Meeting, or by written resolution, where notice of not less than twenty-one (21) days has been given in accordance with Section 292 of the Act. "
    ),
    new ConstitutionSettingDefinition(
      "Related Company",
      "In relation to a company, means any associate company or subsidiary or parent/holding company of that company or any associate company or subsidiary of that parent/holding company."
    ),
    new ConstitutionSettingDefinition("Register", "The register of members to be kept pursuant to the Act."),
    new ConstitutionSettingDefinition(
      "Shares",
      "means ordinary shares in the Company, together where applicable with any preference shares or other classes of shares issued by the Company from time to time."
    ),
    new ConstitutionSettingDefinition(
      "Shareholding Proportions",
      "means the respective shareholdings in the capital of the Company of each of the Shareholders expressed as a percentage of the total issued and paid up share capital of the Company."
    ),
    new ConstitutionSettingDefinition("Seal", "The common seal of the Company."),
  ]

  static DEFINITIONS_PART_3: ConstitutionSettingDefinition[] = [
    new ConstitutionSettingDefinition(
      "Secretary",
      "Shall (subject to the provisions of the Act) include an Assistant or Deputy Secretary, and any person appointed by the Board to perform any of the duties of the Secretary of the Company in accordance with Sections 102, 235 and 241 of the Act."
    ),
    new ConstitutionSettingDefinition(
      "Shareholder",
      "means a Member or any shareholder(s) of the Company at any material time."
    ),
    new ConstitutionSettingDefinition(
      "Transferee",
      "means in respect of the transfer of any Shares in accordance with the provisions of this Agreement, the party to whom the Shares are to be transferred."
    ),
    new ConstitutionSettingDefinition(
      "Transferor",
      "means in respect of the transfer or proposed transfer of any Shares in accordance with the provisions of this Agreement, the Shareholder whose Shares are the subject of such transfer or proposed transfer."
    ),
  ]
}
