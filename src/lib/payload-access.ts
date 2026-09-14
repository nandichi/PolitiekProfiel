export function hasPayloadUser(request: { user?: unknown | null }): boolean {
  return Boolean(request.user);
}
