const stack = ref<string[]>([])

export const usePopupStack = () => {
  const addToStack = (id: string) => {
    if (!stack.value.includes(id)) {
      stack.value.push(id)
    }
  }

  const removeFromStack = (id: string) => {
    stack.value = stack.value.filter((i) => i !== id)
  }

  const isTop = (id: string) => {
    return stack.value[stack.value.length - 1] === id
  }

  return { addToStack, removeFromStack, isTop }
}
