import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { Error } from "~/scripts/library/Error"
import { Toast } from "~/scripts/library/Toast"
import { Tag } from "~/scripts/models/Tag"
import { PropsAddNewTag } from "~/scripts/props/PropsAddNewTag"
import { PropsTags } from "~/scripts/props/PropsTags"

export class TagsController {
  targetType: Ref<string> = ref<string>("")
  targetId: Ref<string> = ref<string>("")
  tags: Ref<Tag[]> = ref<Tag[]>([])

  emitEvents: any | null = null

  addTagRef: any | null = null

  isUpdating: Ref<boolean> = ref<boolean>(false)

  language = useLanguage()

  constructor(props: PropsTags, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setDataFromProps(props)
  }

  setDataFromProps(props: PropsTags): void {
    this.targetType.value = props.targetType
    this.targetId.value = props.targetId
    this.tags.value = props.tags.map((t: Tag) => {
      return new Tag(t)
    })
  }

  setAddTagRef(addTagRef: any): void {
    this.addTagRef = addTagRef
  }

  onAddNewTagClicked(): void {
    if (this.addTagRef) {
      this.addTagRef.show()
    }
  }

  onAddedTag(newTag: Tag): void {
    this.tags.value.push(newTag)
    this.emitEvents(EmitMessages.REFRESH)
  }

  async onRemoveTagClicked(tag: Tag): Promise<void> {
    if (this.isUpdating.value) {
      return
    }

    try {
      this.isUpdating.value = true

      this.tags.value = this.tags.value.filter((t: Tag) => {
        return t.id !== tag.id
      })

      await tag.remove(useTagStore())

      let toastTitle = this.language.isMalay() ? "Tag telah dibuang." : "The Tag is successfully removed."
      let toastMessage = this.language.isMalay() ? "" : ""
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()
    } catch (e) {
      let error = new Error()
      error.setForCUD()
      error.handle()
    } finally {
      this.isUpdating.value = false
    }
  }

  get addNewTagProps(): PropsAddNewTag {
    return new PropsAddNewTag(this.targetType.value, this.targetId.value)
  }
}
