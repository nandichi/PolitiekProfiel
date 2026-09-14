export const SHARE_ID_PATTERN = /^[A-Za-z0-9_-]{6,32}$/;

export function isShareId(value: unknown): value is string {
  return typeof value === "string" && SHARE_ID_PATTERN.test(value);
}
