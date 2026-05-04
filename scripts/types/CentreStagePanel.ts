export class CentreStagePanel {
  id: string = ''
  isShowing = ref<boolean>(false)

  constructor(id: string, isShowing: boolean) {
    this.id = id
    this.isShowing.value = isShowing
  }
}