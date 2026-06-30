import { BankBranch } from "~/scripts/models/BankBranch"
import { Bank } from "~/scripts/models/Bank"
import { ObjectUtil } from "~/scripts/utils/Object"
import type { State } from "~/scripts/models/Location"
import { StringUtil } from "~/scripts/utils/String"

export class BranchDropdownController {
  bankId: Ref<string> = ref<string>("")
  bankBranches = ref<BankBranch[]>([])

  selectedBranchId: Ref<string> = ref<string>("")
  isShowBranchOptions: Ref<boolean> = ref<boolean>(false)
  searchBranch: Ref<string> = ref<string>("")

  emitEvents: any | null = null

  constructor(bankId: string, selectedBranchId: string, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setBankId(bankId)
    this.setSelectedBranchId(selectedBranchId)
  }

  async setBankId(bankId: string): Promise<void> {
    this.bankId.value = bankId

    await this.fetchBank()
  }

  setSelectedBranchId(branchId: string): void {
    this.selectedBranchId.value = branchId
  }

  async fetchBank(): Promise<void> {
    try {
      let repository = useBankStore()
      let response = await repository.fetch(this.bankId.value)
      if (!repository.error && response) {
        let bank = new Bank(response)

        this.bankBranches.value = bank.branches.map((b: BankBranch) => {
          return new BankBranch(b)
        })

        this.bankBranches.value = ObjectUtil.sort<BankBranch>(this.bankBranches.value, "stateId", "asc")
      }
    } catch (e) {
      console.error("Failed to fetch bank:", e)
    }
  }

  getBranchesInState(stateId: number): BankBranch[] {
    let branches: BankBranch[] = this.bankBranches.value.filter((b: BankBranch) => {
      return (
        b.stateId === stateId &&
        (StringUtil.isNullOrEmpty(this.searchBranch.value) ||
          b.name.toLowerCase().includes(this.searchBranch.value.toLowerCase()) ||
          b.state.name.toLowerCase().includes(this.searchBranch.value.toLowerCase()))
      )
    })

    return ObjectUtil.sort<BankBranch>(branches, "name", "asc")
  }

  onBranchOptionClicked(): void {
    this.isShowBranchOptions.value = !this.isShowBranchOptions.value
    this.searchBranch.value = ""
  }

  onBranchOptionSelected(branchId: string): void {
    this.selectedBranchId.value = branchId
    this.isShowBranchOptions.value = false
    this.searchBranch.value = ""
    this.emitEvents("branchSelected", this.selectedBranchId.value)
  }

  handleClick(event: MouseEvent | TouchEvent): void {
    const target = event.target as HTMLElement
    const dropdownElement = document.querySelector(".searchable-dropdown")

    if (dropdownElement && !dropdownElement.contains(target)) {
      this.isShowBranchOptions.value = false
    }
  }

  get loaderLabel(): string {
    return "Preparing Your"
  }

  get loaderSublabel(): string {
    return "Resolution"
  }

  get branchStates(): State[] {
    let states = this.bankBranches.value
      .filter((b: BankBranch) => {
        return (
          StringUtil.isNullOrEmpty(this.searchBranch.value) ||
          b.name.toLowerCase().includes(this.searchBranch.value.toLowerCase()) ||
          b.state.name.toLowerCase().includes(this.searchBranch.value.toLowerCase())
        )
      })
      .map((b: BankBranch) => {
        return b.state
      })

    let uniqueStates: State[] = []
    states.forEach((s: State) => {
      if (!uniqueStates.some((us: State) => us.id === s.id)) {
        uniqueStates.push(s)
      }
    })

    return ObjectUtil.sort<State>(uniqueStates, "name", "asc")
  }

  get selectedBranch(): BankBranch | null {
    let branch = this.bankBranches.value.find((b: BankBranch) => {
      return b.id === this.selectedBranchId.value
    })

    return branch ?? null
  }

  get selectedBranchName(): string {
    return this.selectedBranch?.name ?? "YOUR SELECTED BRANCH"
  }

  get isBranchPlaceholder(): boolean {
    return this.selectedBranch === null
  }

  get branchAddress(): string {
    let branch = this.selectedBranch
    if (!branch) {
      return "(BRANCH ADDRESS)"
    }

    return `(${branch.address.toUpperCase()})`
  }
}
