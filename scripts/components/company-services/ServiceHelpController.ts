export class ServiceHelpController {
  isShowing = ref<boolean>(false)
  title = ref<string>("")
  description = ref<string>("")

  constructor(title: string, description: string) {
    this.setTitle(title)
    this.setDescription(description)
  }

  setTitle(title: string): void {
    this.title.value = title
  }

  setDescription(description: string): void {
    this.description.value = description
  }

  toggle(): void {
    this.isShowing.value = !this.isShowing.value
  }

  hide(): void {
    this.isShowing.value = false
  }
}
