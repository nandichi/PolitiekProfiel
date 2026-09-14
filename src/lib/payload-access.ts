export function hasPayloadAdmin(request: { user?: unknown | null }): boolean {
  const user = request.user;
  if (!user || typeof user !== "object") return false;

  const role = "role" in user ? user.role : undefined;

  // Existing CMS users predate roles and remain administrators until they are
  // explicitly assigned the new editor role.
  return role !== "editor";
}
