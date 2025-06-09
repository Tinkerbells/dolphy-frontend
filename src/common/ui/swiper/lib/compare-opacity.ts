function normalizeOpacity(value: number): number {
  // Normalize the opacity value to two decimal places
  return Math.round(value * 100) / 100
}

export function compareOpacity(opacity1: number, opacity2: number): boolean {
  // Normalize both opacity values
  const normalizedOpacity1 = normalizeOpacity(opacity1)
  const normalizedOpacity2 = normalizeOpacity(opacity2)

  // Define a tolerance for considering two opacity values as equal
  const tolerance = 0.05

  // Check if the absolute difference is within the tolerance
  return Math.abs(normalizedOpacity1 - normalizedOpacity2) <= tolerance
}
