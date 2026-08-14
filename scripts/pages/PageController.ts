import { StatusConstants } from "../constants/Status"
import { ActivityLogger } from "../library/ActivityLogger"
import { Toast } from "../library/Toast"
import { SeoTools } from "../utils/SeoTools"

export class PageController {
  pageAlias: string = "centre stage"
  eventManager = useEventManagerStore()
  language = useLanguage()

  constructor(title: string, description: string, pageAlias: string) {
    SeoTools.addMetadata(title, description)
    this.pageAlias = pageAlias
  }

  setSeoMetadata(title: string, description: string): void {
    SeoTools.addMetadata(title, description)
  }

  async addPageViewLog(): Promise<void> {
    let activityLogger = new ActivityLogger()
    await activityLogger.init()
    activityLogger.addViewLog("", this.pageAlias, "user", activityLogger.userId, "success")
  }
}
