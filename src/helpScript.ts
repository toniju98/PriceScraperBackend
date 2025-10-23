// Types for dimension mapping
export type WidthOption = "50" | "100";
export type DepthOption = "30" | "60";

// Dimension mapping configuration
const WIDTH_MAPPING: Record<WidthOption, number> = {
  "50": 1,
  "100": 2
};

const DEPTH_MAPPING: Record<DepthOption, number> = {
  "30": 1,
  "60": 2
};

/**
 * Maps product width to the corresponding div child index for idealo filter
 * @param productWidth - The width value as string
 * @returns The div child index (1-based) or 0 for invalid values
 */
export function widthToDivChild(productWidth: string): number {
  const width = productWidth as WidthOption;
  const divProduct = WIDTH_MAPPING[width] || 0;
  
  console.log(`Width mapping: ${productWidth} -> ${divProduct}`);
  return divProduct;
}

/**
 * Maps product depth to the corresponding div child index for idealo filter
 * @param productDepth - The depth value as string
 * @returns The div child index (1-based) or 0 for invalid values
 */
export function depthToDivChild(productDepth: string): number {
  const depth = productDepth as DepthOption;
  const divProduct = DEPTH_MAPPING[depth] || 0;
  
  console.log(`Depth mapping: ${productDepth} -> ${divProduct}`);
  return divProduct;
}

/**
 * Validates if a width value is supported
 * @param width - The width value to validate
 * @returns True if the width is supported
 */
export function isValidWidth(width: string): width is WidthOption {
  return width in WIDTH_MAPPING;
}

/**
 * Validates if a depth value is supported
 * @param depth - The depth value to validate
 * @returns True if the depth is supported
 */
export function isValidDepth(depth: string): depth is DepthOption {
  return depth in DEPTH_MAPPING;
}

/**
 * Gets all supported width options
 * @returns Array of supported width values
 */
export function getSupportedWidths(): WidthOption[] {
  return Object.keys(WIDTH_MAPPING) as WidthOption[];
}

/**
 * Gets all supported depth options
 * @returns Array of supported depth values
 */
export function getSupportedDepths(): DepthOption[] {
  return Object.keys(DEPTH_MAPPING) as DepthOption[];
}
