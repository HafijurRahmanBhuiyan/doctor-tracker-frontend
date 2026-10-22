/**
 * Builds the initials shown in the avatar of a doctor or a patient.
 *
 * "Jane Doe" -> "JD", "Madonna" -> "MA", "" -> "?".
 * The result never depends on the environment, so it is safe to render on the
 * server and on the client.
 */
export function getInitials(name?: string | null): string {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
