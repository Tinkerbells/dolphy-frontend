export function getActiveItem(index: number, itemsPerView: number, itemsLength: number): boolean {
  if (itemsLength <= 1)
    return true
  const effectiveIndex = Math.min(itemsLength, itemsPerView) - 1
  return index === effectiveIndex
}
