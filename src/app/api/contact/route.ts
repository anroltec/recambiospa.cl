import { NextResponse, type NextRequest } from "next/server";
import { createContactMessage } from "@/lib/contact-messages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactField = "name" | "email" | "phone" | "message";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  website?: string;
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateContactPayload(payload: ContactPayload) {
  const name = clean(payload.name);
  const email = clean(payload.email).toLowerCase();
  const phone = clean(payload.phone);
  const message = clean(payload.message);
  const website = clean(payload.website);

  const fieldErrors: Partial<Record<ContactField, string>> = {};

  if (name.length < 2) {
    fieldErrors.name = "Ingresa tu nombre.";
  }

  if (!email || !isValidEmail(email)) {
    fieldErrors.email = "Ingresa un correo valido.";
  }

  if (phone && phone.length > 32) {
    fieldErrors.phone = "El telefono es demasiado largo.";
  }

  if (message.length < 10) {
    fieldErrors.message = "Cuentanos un poco mas sobre tu consulta.";
  } else if (message.length > 2000) {
    fieldErrors.message = "El mensaje es demasiado largo.";
  }

  return {
    name,
    email,
    phone,
    message,
    website,
    fieldErrors,
  };
}

export async function POST(request: NextRequest) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Solicitud invalida." },
      { status: 400 }
    );
  }

  const { name, email, phone, message, website, fieldErrors } =
    validateContactPayload(payload);

  if (website) {
    return NextResponse.json({
      ok: true,
      message: "Recibimos tu mensaje. Te responderemos a la brevedad.",
    });
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "Revisa los campos marcados y vuelve a intentar.",
        fieldErrors,
      },
      { status: 400 }
    );
  }

  try {
    await createContactMessage({
      name,
      email,
      phone: phone || null,
      message,
      sourcePath: "/contacto",
    });

    return NextResponse.json({
      ok: true,
      message:
        "Recibimos tu mensaje. Te responderemos por correo o WhatsApp a la brevedad.",
    });
  } catch (error) {
    console.error("[contact] POST failed", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          "No fue posible enviar tu mensaje en este momento. Intenta nuevamente en unos minutos.",
      },
      { status: 500 }
    );
  }
}
