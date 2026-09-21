import { Tag } from "~/scripts/models/Tag"
import type { PropsAddNewTag } from "~/scripts/props/PropsAddNewTag"
import { BasePopupController } from "./BasePopupController"
import { Error } from "~/scripts/library/Error"
import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"
import { Filter } from "~/scripts/library/Filter"
import { EmitMessages } from "~/scripts/constants/EmitMessages"

export class AddNewTagController extends BasePopupController {
  targetType: Ref<string> = ref<string>("")
  targetId: Ref<string> = ref<string>("")
  name: Ref<string> = ref<string>("")

  isSubmitting: Ref<boolean> = ref<boolean>(false)

  isAddNewType: Ref<boolean> = ref<boolean>(false)

  tags: Ref<Tag[]> = ref<Tag[]>([])

  constructor(props: PropsAddNewTag, emitEvents: any) {
    super(emitEvents)

    this.isCompliance.value = false

    this.setDataFromProps(props)
  }

  setDataFromProps(props: PropsAddNewTag): void {
    this.targetType.value = props.targetType
    this.targetId.value = props.targetId
  }

  async fetchExistingTags(): Promise<void> {
    let filter = new Filter()
    filter.takeAll = true

    let repository = useTagStore()
    let response = await repository.fetchAll(filter)
    this.tags.value = response.data.map((d: any) => {
      return new Tag(d)
    })
  }

  onSelectedValue(): void {
    this.isAddNewType.value = this.name.value === "+ Add New"

    if (this.isAddNewType.value) {
      this.name.value = ""
    }
  }

  onClearCustomName(): void {
    this.name.value = ""
    this.isAddNewType.value = false
  }

  onProceedClicked(): void {
    //
  }

  async onSave(): Promise<void> {
    try {
      this.isSubmitting.value = true

      let tag = new Tag()
      tag.targetType = this.targetType.value
      tag.targetId = this.targetId.value
      tag.name = this.name.value

      await tag.create(useTagStore())

      this.hide()
      this.emitEvents(EmitMessages.PROCEED, tag)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? `Tambah Tag` : `Add New Tag`
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get content(): string {
    if (this.language.isMalay()) {
      return `
        Pilih dari tag sedia ada atau tambah baru.
      `
    }

    return `
      Select an existing Tag or Add New.
    `
  }

  get existingTags(): string[] {
    let tagNames = this.tags.value.map((t: Tag) => {
      return t.name
    })

    let distinctNames = [...new Set(tagNames)]

    distinctNames.push("+ Add New")

    return distinctNames
  }
}
