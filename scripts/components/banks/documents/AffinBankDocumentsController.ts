import { BankDocumentsController } from "./BankDocumentsController"
import { BankConstants } from "~/scripts/constants/Banks"
import { StringUtil } from "~/scripts/utils/String"

export class AffinBankDocumentsController extends BankDocumentsController {
  bankId: string = BankConstants.AFFIN_BANK_DETAIL.id

  override get documentsToDisplay(): string[] {
    if (this.documentFetcher.value.isLoading || StringUtil.isNullOrEmpty(this.companyId.value)) {
      return []
    }

    let documents = [
      "https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/documents/samples/affin-bank-application-form.pdf",
      this.documentFetcher.value.section14FileUrl,
      this.documentFetcher.value.section15FileUrl,
      this.documentFetcher.value.section17FileUrl,
    ]

    if (!StringUtil.isNullOrEmpty(this.documentFetcher.value.section46FileUrl)) {
      documents.push(this.documentFetcher.value.section46FileUrl)
    }

    documents = documents.concat([
      this.documentFetcher.value.section51FileUrl,
      this.documentFetcher.value.section58FileUrl,
    ])

    if (!StringUtil.isNullOrEmpty(this.documentFetcher.value.section78FileUrl)) {
      documents.push(this.documentFetcher.value.section78FileUrl)
    }

    if (!StringUtil.isNullOrEmpty(this.documentFetcher.value.constitutionFileUrl)) {
      documents.push(this.documentFetcher.value.constitutionFileUrl)
    }

    return documents
  }

  override get documentNames(): string[] {
    if (this.documentFetcher.value.isLoading || StringUtil.isNullOrEmpty(this.companyId.value)) {
      return []
    }

    let documents = [
      this.language.isMalay() ? "Universal Business<br>Banking Form" : "Universal Business<br>Banking Form",
      this.language.isMalay() ? "Seksyen 14<br>Superform" : "Section 14<br>Superform",
      this.language.isMalay()
        ? "Seksyen 15<br>Makluman<br>Pemerbadanan"
        : "Section 15<br>Notification of<br>Incorporation",
      this.language.isMalay() ? "Seksyen 17<br>Sijil Pemerbadanan" : "Section 17<br>Certificate of<br>Incorporation",
    ]

    if (!StringUtil.isNullOrEmpty(this.documentFetcher.value.section46FileUrl)) {
      documents.push(
        this.language.isMalay()
          ? "Seksyen 46<br>Makluman<br>Pertukaran<br>Alamat Berdaftar"
          : "Section 46<br>Notification of<br>Change<br>Registered Address"
      )
    }

    documents = documents.concat([
      this.language.isMalay() ? "Seksyen 51<br>Daftar<br>Pemegang Saham" : "Section 51<br>Register of<br>Members",
      this.language.isMalay() ? "Seksyen 58<br>Daftar<br>Pengarah..." : "Section 58<br>Register of<br>Directors...",
    ])

    if (!StringUtil.isNullOrEmpty(this.documentFetcher.value.section78FileUrl)) {
      documents.push(
        this.language.isMalay() ? "Seksyen 78<br>Return of<br>Allotment" : "Section 78<br>Return of<br>Allotment"
      )
    }

    if (!StringUtil.isNullOrEmpty(this.documentFetcher.value.constitutionFileUrl)) {
      documents.push(this.language.isMalay() ? "Perlembagaan<br>Syarikat" : "Company's<br>Constitution")
    }

    return documents
  }
}
