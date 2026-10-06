import { File } from "../models/File"

export interface IPropsEditFilenames {
  files: File[]
}

export class PropsEditFilenames implements IPropsEditFilenames {
  files: File[]

  constructor(files: File[]) {
    this.files = files.map((f: File) => {
      return new File(f)
    })
  }
}
