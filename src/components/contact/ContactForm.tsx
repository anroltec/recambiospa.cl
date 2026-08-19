"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

type ContactField = "name" | "email" | "phone" | "message";

type ContactFormValues = Record<ContactField, string> & {
  website: string;
};

type FeedbackState = {
  tone: "idle" | "success" | "error";
  message: string;
};

const EMPTY_FORM: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
  website: "",
};

export default function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<ContactField, string>>
  >({});
  const [feedback, setFeedback] = useState<FeedbackState>({
    tone: "idle",
    message: "Completa tus datos y te responderemos por correo o WhatsApp.",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setFeedback({
      tone: "idle",
      message: "Enviando tu mensaje...",
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
        error?: string;
        fieldErrors?: Partial<Record<ContactField, string>>;
      };

      if (!response.ok || !data.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        throw new Error(
          data.error ?? "No fue posible enviar tu mensaje en este momento."
        );
      }

      setValues(EMPTY_FORM);
      setFeedback({
        tone: "success",
        message:
          data.message ??
          "Recibimos tu mensaje. Te responderemos a la brevedad.",
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "No fue posible enviar tu mensaje en este momento.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField(field: keyof ContactFormValues, value: string) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    if (field in fieldErrors) {
      setFieldErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  }

  return (
    <div className="border border-gray-200 bg-white p-8">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
        Formulario
      </p>
      <h2 className="mb-6 text-xl font-black uppercase text-dark">
        Envianos un mensaje
      </h2>

      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
        <fieldset disabled={isSubmitting} className="space-y-4 disabled:opacity-80">
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Sitio web</label>
            <input
              id="website"
              name="website"
              type="text"
              value={values.website}
              onChange={(event) => updateField("website", event.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <Field
            id="name"
            name="name"
            label="Nombre"
            type="text"
            placeholder="Tu nombre completo"
            autoComplete="name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
            maxLength={120}
            error={fieldErrors.name}
          />

          <Field
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="tu@email.com"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
            maxLength={160}
            error={fieldErrors.email}
          />

          <Field
            id="phone"
            name="phone"
            label="Teléfono"
            type="tel"
            placeholder="+569 1234 5678"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            maxLength={32}
            error={fieldErrors.phone}
          />

          <div>
            <label
              htmlFor="message"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-dark/50"
            >
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              minLength={10}
              maxLength={2000}
              value={values.message}
              onChange={(event) => updateField("message", event.target.value)}
              aria-invalid={fieldErrors.message ? "true" : "false"}
              aria-describedby={fieldErrors.message ? "message-error" : undefined}
              className="w-full resize-none border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none"
              placeholder="Nombre o código del producto que necesitas..."
            />
            {fieldErrors.message ? (
              <p id="message-error" className="mt-1.5 text-xs text-red-600">
                {fieldErrors.message}
              </p>
            ) : null}
          </div>

          <div aria-live="polite">
            <FeedbackBanner tone={feedback.tone} message={feedback.message} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-primary/70"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 size={15} className="animate-spin" />
                Enviando...
              </span>
            ) : (
              "Enviar mensaje"
            )}
          </button>
        </fieldset>
      </form>
    </div>
  );
}

function Field({
  id,
  name,
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  name: string;
  label: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-dark/50"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none"
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function FeedbackBanner({
  tone,
  message,
}: {
  tone: "idle" | "success" | "error";
  message: string;
}) {
  if (tone === "success") {
    return (
      <div className="flex items-start gap-2 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
        <span>{message}</span>
      </div>
    );
  }

  if (tone === "error") {
    return (
      <div className="flex items-start gap-2 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <AlertCircle size={16} className="mt-0.5 shrink-0" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-dark/60">
      {message}
    </div>
  );
}
