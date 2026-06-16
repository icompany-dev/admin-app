import { NameReservation } from "~/scripts/types/NameReservation"
import { StringUtil } from "~/scripts/utils/String"

export class NameReservationsController {
  nameReservations = ref<NameReservation[]>([])
  validatedNameReservations = ref<NameReservation[]>([])
  emitEvents: any = []

  constructor(nameReservations: NameReservation[], emitEvents: any) {
    this.setNameReservations(nameReservations)
    this.emitEvents = emitEvents
  }

  setNameReservations(nameReservations: NameReservation[]): void {
    if (nameReservations.length <= 0) {
      const newNameReservation: NameReservation = new NameReservation(crypto.randomUUID(), "")
      this.nameReservations.value.push(newNameReservation)
      this.validatedNameReservations.value.push(newNameReservation)
    } else {
      this.nameReservations.value = nameReservations.map((nr: NameReservation) => {
        const newNameReservation = new NameReservation("", "")
        newNameReservation.clone(nr)
        return newNameReservation
      })
      this.validatedNameReservations.value = nameReservations.map((nr: NameReservation) => {
        const newNameReservation = new NameReservation("", "")
        newNameReservation.clone(nr)
        return newNameReservation
      })
    }
  }

  onAddNameClicked(): void {
    let newId = crypto.randomUUID()
    const newNameReservation: NameReservation = new NameReservation(`${newId}`, "")
    this.nameReservations.value.push(newNameReservation)
    this.validatedNameReservations.value.push(newNameReservation)
    this.emitEvents("addName", this.validatedNameReservations.value)
  }

  onRemoveNameClicked(uuid: string): void {
    const itemIndex = this.nameReservations.value.findIndex((nr: NameReservation) => {
      return nr.id === uuid
    })

    const validatedItemIndex = this.validatedNameReservations.value.findIndex((nr: NameReservation) => {
      return nr.id === uuid
    })

    if (itemIndex < 0 && validatedItemIndex < 0) {
      return
    }

    if (itemIndex >= 0) {
      this.nameReservations.value.splice(itemIndex, 1)
      this.emitEvents("removeName", this.validatedNameReservations.value)
    }

    if (validatedItemIndex >= 0) {
      this.validatedNameReservations.value.splice(validatedItemIndex, 1)
    }
  }

  isLastItem(index: number): boolean {
    return index >= this.nameReservations.value.length - 1
  }

  canRemove(): boolean {
    return this.nameReservations.value.length > 1
  }

  canAddMore(): boolean {
    return this.nameReservations.value.length < 3
  }

  handleNameChanges(nameReservation: NameReservation): void {
    let existingNameReservation = this.validatedNameReservations.value.find((nr: any) => {
      return nr.id === nameReservation.id
    })

    if (!existingNameReservation) {
      let newValidatedNameReservation = new NameReservation("", "")
      newValidatedNameReservation.clone(nameReservation)
      this.validatedNameReservations.value.push(newValidatedNameReservation)
    } else {
      existingNameReservation.clone(nameReservation)
    }

    this.emitEvents("nameChanges", this.validatedNameReservations.value)
  }

  otherNamesToReserve(index: number): string[] {
    let names: string[] = []
    this.nameReservations.value.forEach((nameReservation: NameReservation, i: number) => {
      if (i === index || nameReservation.name === null || StringUtil.isNullOrEmpty(nameReservation.name)) {
        return
      }

      names.push(nameReservation.name)
    })

    return names
  }
}
