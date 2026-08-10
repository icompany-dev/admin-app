import { PaperOrientation } from "~/scripts/constants/Paper"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"

export class SdnBhdSpineController extends SdnBhdLegalDocumentController {
  constructor(companyId: string, emitEvents: any) {
    super("Document Folder Spine", companyId, PaperOrientation.Landscape)
  }
}
