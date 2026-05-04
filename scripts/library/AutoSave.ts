import type { IAutoSaveEnabled } from "../models/IAutoSaveEnabled"
import { StringUtil } from "../utils/String"
import { Error } from "./Error"

export class AutoSave<T, R> {
  initialRecord: IAutoSaveEnabled<T, R> | null = null
  updatedRecord: IAutoSaveEnabled<T, R> | null = null
  repository: R | null = null

  isSaving: boolean = false
  hasSaveOnce: boolean = false

  checkInterval: any | null = null

  constructor() {}

  setRepository(repository: R): void {
    this.repository = repository
  }

  async save(originalRecord: IAutoSaveEnabled<T, R>, updatedRecord: IAutoSaveEnabled<T, R>): Promise<void> {
    if (this.isSaving || !this.repository) {
      return
    }

    if (originalRecord.isTheSame(updatedRecord as T)) {
      return
    }

    this.isSaving = true
    try {
      if (StringUtil.isNullOrEmpty(updatedRecord.id)) {
        await updatedRecord.create(this.repository)
      } else {
        await updatedRecord.update(this.repository)
      }

      this.hasSaveOnce = true
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForCUD()
        errorMessage.handle()
      }
    } finally {
      this.isSaving = false
    }
  }
}
