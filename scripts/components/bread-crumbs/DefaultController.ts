import { type IPropsBreadCrumb, PropsBreadCrumbItem } from "~/scripts/props/PropsBreadCrumb"

export class DefaultController {
  crumbs = ref<PropsBreadCrumbItem[]>([])
  emitEvents: any | null = null

  constructor(props: IPropsBreadCrumb, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setCrumbs(props.crumbs)
  }

  setCrumbs(crumbs: PropsBreadCrumbItem[]): void {
    this.crumbs.value = crumbs.map((d: any) => {
      return new PropsBreadCrumbItem(d.pageName, d.url)
    })
  }

  isLastItem(index: number): boolean {
    return this.crumbs.value.length - 1 === index
  }

  onClick(crumb: PropsBreadCrumbItem, index: number): void {
    if (this.isLastItem(index)) {
      return
    }

    let router = useRouter()
    router.push(crumb.url)
  }
}
