import "server-only";

export interface ContactMessageInput {
  name: string;
  email: string;
  phone: string | null;
  message: string;
  sourcePath: string;
}

function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  return { url, key };
}

export async function createContactMessage(
  input: ContactMessageInput
): Promise<void> {
  const { url, key } = getSupabaseAdminClient();

  const response = await fetch(`${url}/rest/v1/contact_messages`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
      source_path: input.sourcePath,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase write error: ${body || response.statusText}`);
  }
}
