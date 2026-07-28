import { PageController } from "~/scripts/pages/PageController"

export class PageIncorporationsController extends PageController {
  isLoading: Ref<boolean> = ref<boolean>(false)

  router = useRouter()
  route = useRoute()

  constructor(title: string, description: string, pageAlias: string) {
    super(title, description, pageAlias)

    this.addPageViewLog()
  }
}
