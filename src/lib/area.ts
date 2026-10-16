/**
 * Utility functions for parsing, validating, formatting, and preserving
 * property areas (both single numeric values and range values such as 6500–7000).
 */

export interface ParsedAreaResult {
  valid: boolean;
  numericArea?: number;
  upperBound?: number | null;
  isRange?: boolean;
  displayArea?: string; // e.g. "6500–7000" or "6500"
  error?: string;
}

export const AREA_RANGE_TAG_REGEX = /\s*\[(?:Area Range|Plot Area):\s*([^\]]+)\]/i;

/**
 * Parses and validates an area string input.
 * Supports:
 * - Single numbers: "6500", "6,500", "6500.5"
 * - Ranges with hyphen, en dash, em dash, or "to":
 *   "6500-7000", "6500–7000", "6500—7000", "6,500 - 7,000", "6500 to 7000"
 * - Strings with units typed by user: "6500–7000 sq.ft", "4 - 5 Acres"
 */
export function parseAreaInput(val: unknown): ParsedAreaResult {
  if (val === undefined || val === null) {
    return { valid: false, error: 'Area size is required.' };
  }

  let str = String(val).trim();
  if (!str) {
    return { valid: false, error: 'Area size is required.' };
  }

  // Strip unit words if the user typed them inside the area input field
  const cleanStr = str
    .replace(/(?:sq\.?\s*ft\.?|sqft|sq\.?\s*yd\.?|sqyd|acres?|guntha|hectares?|vigha|bigha)/gi, '')
    .trim();

  if (!cleanStr) {
    return { valid: false, error: 'Please enter a valid numeric area or area range.' };
  }

  // Check for range patterns: hyphen -, en dash \u2013, em dash \u2014, or 'to'
  const rangePattern = /^([\d,]+(?:\.\d+)?)\s*(?:-|–|—|\bto\b)\s*([\d,]+(?:\.\d+)?)$/i;
  const match = cleanStr.match(rangePattern);

  if (match) {
    const minVal = parseFloat(match[1].replace(/,/g, ''));
    const maxVal = parseFloat(match[2].replace(/,/g, ''));

    if (isNaN(minVal) || isNaN(maxVal)) {
      return {
        valid: false,
        error: 'Invalid area range. Please enter valid numbers (e.g. 6500–7000).',
      };
    }
    if (minVal <= 0 || maxVal <= 0) {
      return { valid: false, error: 'Area must be greater than zero.' };
    }
    if (minVal > maxVal) {
      return {
        valid: false,
        error: `Area range minimum (${minVal}) cannot be greater than maximum (${maxVal}).`,
      };
    }

    const minDisplay = match[1].trim();
    const maxDisplay = match[2].trim();
    // Normalize to standard en dash for consistent presentation
    const displayRange = `${minDisplay}–${maxDisplay}`;

    return {
      valid: true,
      numericArea: minVal,
      upperBound: maxVal,
      isRange: true,
      displayArea: displayRange,
    };
  }

  // Check for single numeric value
  const singlePattern = /^[\d,]+(?:\.\d+)?$/;
  if (singlePattern.test(cleanStr)) {
    const num = parseFloat(cleanStr.replace(/,/g, ''));
    if (isNaN(num)) {
      return { valid: false, error: 'Please enter a valid numeric area (e.g. 6500).' };
    }
    if (num <= 0) {
      return { valid: false, error: 'Area must be greater than zero.' };
    }
    return {
      valid: true,
      numericArea: num,
      upperBound: null,
      isRange: false,
      displayArea: cleanStr,
    };
  }

  return {
    valid: false,
    error: 'Invalid area format. Please enter a valid number (e.g. 6500) or range (e.g. 6500–7000).',
  };
}

/**
 * Embeds or updates the area range in the property description.
 * If area is not a range, any existing area range tag is removed.
 */
export function embedAreaRangeInDescription(
  description: string,
  displayRange: string,
  areaUnit: string
): string {
  const clean = (description || '').replace(AREA_RANGE_TAG_REGEX, '').trim();
  const unit = (areaUnit || 'sq.ft').trim();
  const rangeWithUnit = displayRange.toLowerCase().includes(unit.toLowerCase())
    ? displayRange
    : `${displayRange} ${unit}`;

  return clean ? `${clean}\n\n[Area Range: ${rangeWithUnit}]` : `[Area Range: ${rangeWithUnit}]`;
}

/**
 * Strips the internal area range tag so description displays cleanly without bracket markup.
 */
export function cleanDescriptionForDisplay(description?: string | null): string {
  if (!description) return '';
  return description.replace(AREA_RANGE_TAG_REGEX, '').trim();
}

/**
 * Extracts the user-intended area string for display or form editing.
 * Checks:
 * 1. [Area Range: ...] metadata tag in description or short_description
 * 2. Explicit range pattern in short_description or title
 * 3. Fallback to numeric area with unit
 */
export function extractAreaDisplay(row: {
  area?: number | string | null;
  area_unit?: string | null;
  description?: string | null;
  short_description?: string | null;
  title?: string | null;
}): string {
  const unit = (row.area_unit || 'sq.ft').trim();

  // 1. Check description tag
  if (row.description) {
    const match = row.description.match(AREA_RANGE_TAG_REGEX);
    if (match && match[1]) {
      const tagContent = match[1].trim();
      return tagContent.toLowerCase().includes(unit.toLowerCase())
        ? tagContent
        : `${tagContent} ${unit}`;
    }
  }

  // 2. Check short_description tag
  if (row.short_description) {
    const match = row.short_description.match(AREA_RANGE_TAG_REGEX);
    if (match && match[1]) {
      const tagContent = match[1].trim();
      return tagContent.toLowerCase().includes(unit.toLowerCase())
        ? tagContent
        : `${tagContent} ${unit}`;
    }
  }

  // 3. Check for range pattern in short_description or title (e.g., "6500–7000 sq.ft")
  const combinedText = `${row.short_description || ''} ${row.title || ''}`;
  const rangeMatch = combinedText.match(
    /\b([\d,]+(?:\.\d+)?\s*(?:-|–|—|to)\s*[\d,]+(?:\.\d+)?)(?:\s*(?:sq\.?\s*ft\.?|acres?|sq\.?\s*yd\.?|guntha|hectares?))?/i
  );
  if (rangeMatch && rangeMatch[1]) {
    const r = rangeMatch[1].trim().replace(/\s*to\s*/i, '–').replace(/\s*[-—]\s*/g, '–');
    return `${r} ${unit}`;
  }

  // 4. Default to numeric area with unit
  if (row.area != null && row.area !== '') {
    const raw = String(row.area).trim();
    return raw.toLowerCase().includes(unit.toLowerCase()) ? raw : `${raw} ${unit}`;
  }

  return `— ${unit}`;
}

/**
 * Extracts raw area string for form inputs (e.g. "6500–7000" or "6500" without unit).
 */
export function extractRawAreaForInput(row: {
  area?: number | string | null;
  area_unit?: string | null;
  description?: string | null;
  short_description?: string | null;
  title?: string | null;
}): string {
  const display = extractAreaDisplay(row);
  const unit = (row.area_unit || 'sq.ft').trim();
  // Strip unit from the end
  const regex = new RegExp(`\\s*${unit}$`, 'i');
  return display.replace(regex, '').trim();
}
