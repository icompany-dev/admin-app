import { computed, ref, type Ref } from 'vue'

export class InputGroupController {
  private isFocused: Ref<boolean>
  public modelValue: Ref<any>

  constructor(modelValue: any) {
    this.modelValue = modelValue
    this.isFocused = ref(false)
  }

  get isFloated(): boolean {
    return this.isFocused.value || !!this.modelValue.value
  }

  onFocus() {
    this.isFocused.value = true
  }

  onBlur() {
    if (!this.modelValue) {
      this.isFocused.value = false
    }
  }
}
