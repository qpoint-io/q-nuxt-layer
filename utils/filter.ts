/**
 * Filter operator vocabulary shared by the Filter/* component namespace.
 * Ported from app.qpoint.io's utils/filters.ts — UI-shape half only.
 * URL/API marshaling (parseFilterValue, serializeFilterKey, marshalApiFilterValue,
 * etc.) is business logic and stays local to each consumer.
 */
export const FILTER_DEFAULT_OP = "eq" as const;

export const FILTER_OPS = [
  "eq",
  "neq",
  "starts_with",
  "ends_with",
  "contains",
] as const;

export type FilterOperator = (typeof FILTER_OPS)[number];

/** Display labels for filter UI */
export const FILTER_OP_LABELS: Record<FilterOperator, string> = {
  eq: "is",
  neq: "is not",
  starts_with: "starts with",
  ends_with: "ends with",
  contains: "contains",
};

export enum FilterType {
  // ATTRIBUTE is a resource attribute e.g. `method` on the http request resource
  ATTRIBUTE = "attribute",
  // TAG is a tag e.g. `bin`
  TAG = "tag",
}

export interface FilterKeyDefinition {
  key: string;
  // optional label. defaults to key.
  label?: string;
  // optional list of supported operators. defaults to all.
  operators?: FilterOperator[];
  type: FilterType;
  // optional display formatter for the value pill — the URL/API value stays
  // raw (an entity id, say) while the bar shows something readable.
  formatVal?: (val: string) => string;
}

export function getOperatorsForFilterKey(
  defs: FilterKeyDefinition[],
  key: string,
): FilterOperator[] {
  const def = defs.find((d) => d.key === key);
  return def?.operators ?? [FILTER_DEFAULT_OP];
}
