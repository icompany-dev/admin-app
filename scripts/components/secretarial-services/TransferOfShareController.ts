import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyShareholderTransfer } from "~/scripts/models/CompanyShareholderTransfer"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"
import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

export class TransferOfShareController extends SecretarialServiceController<
  CompanyShareholderTransfer,
  ReturnType<typeof useCompanyShareholderTransferStore>
> {
  application = ref<CompanyShareholderTransfer>(new CompanyShareholderTransfer())

  isMovingToDocuments: Ref<boolean> = ref<boolean>(false)
  isDocumentsMoved: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_SHAREHOLDER_TRANSFER_OF_SHARES, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyShareholderTransferStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyShareholderTransfer(response)
  }

  async onMoveToDocuments(): Promise<void> {
    if (this.isMovingToDocuments.value || this.isDocumentsMoved.value) {
      return
    }

    this.isMovingToDocuments.value = true
    this.isDocumentsMoved.value = false

    try {
      this.selectedDocumentTarget.value = DocumentTargets.TARGET_SECTION105

      this.canCompleteService.value = true
    } catch (e) {
    } finally {
      this.isMovingToDocuments.value = false
    }
  }
}
