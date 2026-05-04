export class DragAndDropFile {
  isDragging: boolean
  files: any | null
  file: File | null
  dropTarget: HTMLElement | null

  constructor(dropTarget: HTMLElement | null) {
    this.isDragging = false
    this.files = null
    this.file = null

    this.dropTarget = dropTarget
  }

  preventDefaults(e: Event): void {
    e.preventDefault()
    e.stopPropagation()
  }

  handleDragEnter(e: DragEvent): void {
    this.preventDefaults(e)
    this.isDragging = true
  }

  handleDragLeave(e: DragEvent): void {
    this.preventDefaults(e)
    if (e.target === this.dropTarget) {
      this.isDragging = false
    }
  }

  handleDrop(e: DragEvent): void {
    this.preventDefaults(e)
    this.isDragging = false

    this.files = e.dataTransfer?.files
    if (this.files.length > 0) {
      this.file = this.files[0]
    }
  }
}
