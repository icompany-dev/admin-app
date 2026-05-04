import type { IModel } from "./IModel"
import _ from 'lodash'

export class AdminSetting implements IModel<AdminSetting> {
  id: string = ''
  nameSimilarityThreshold: number = 0.0
  nameMetaData: any | null = null
  minCharPerWord: number = 3

  constructor(data: any | null = null) {
    if(!data) {
      return
    }

    if (data instanceof AdminSetting) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.nameSimilarityThreshold = data.name_similarity_threshold
    this.nameMetaData = data.name_meta_data ? _.cloneDeep(data.name_meta_data) : null
    this.minCharPerWord = data.min_char_per_word
  }

  clone(data: AdminSetting): void {
    this.nameSimilarityThreshold = data.nameSimilarityThreshold
    this.nameMetaData = data.nameMetaData ? _.cloneDeep(data.nameMetaData) : null
    this.minCharPerWord = data.minCharPerWord
  }

  getRequestBody(): object {
    return {}
  }
}