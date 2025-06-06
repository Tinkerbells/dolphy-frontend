export function getOpacity(offset: { x: number, y: number }, offsetBoundary: number): number {
  const { x, y } = offset
  const swipePercentageX = Math.min(Math.abs(x) / offsetBoundary, 1) // Clamp to 1 (100%)
  const swipePercentageY = Math.min(Math.abs(y) / offsetBoundary, 1) // Clamp to 1 (100%)
  return Math.max(swipePercentageX, swipePercentageY)
}
