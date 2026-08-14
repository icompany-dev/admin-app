import { CompanyConstitutionSettingCasualVacanciesOfDirector } from "../models/CompanyConstitutionSettingCasualVacanciesOfDirector"
import { Repository } from "./Repository"

export class CompanyConstitutionSettingCasualVacanciesOfDirectorRepository extends Repository<CompanyConstitutionSettingCasualVacanciesOfDirector> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyConstitutionSettingCasualVacanciesOfDirector)
  }
}
