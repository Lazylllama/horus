export default function ThrowError({ error }: { error: Error | null }) {
  if (error) throw error;
  return null;
}
