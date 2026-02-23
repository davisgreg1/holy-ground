"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { trackEvent } from "@/lib/analytics/track";

type LeadMagnetContextValue = {
  openLeadMagnet: (source?: string) => void;
  hasAccess: boolean;
  downloadUrl: string | null;
};

const STORAGE_KEY = "holy_ground_lead_magnet";

type LeadMagnetStorageState = {
  email: string;
  downloadUrl: string;
  capturedAt: string;
};

const LeadMagnetContext = createContext<LeadMagnetContextValue | null>(null);

function readStateFromStorage(): LeadMagnetStorageState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);

    if (!value) {
      return null;
    }

    const parsed = JSON.parse(value) as LeadMagnetStorageState;

    if (!parsed.downloadUrl || !parsed.email) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeStateToStorage(state: LeadMagnetStorageState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function LeadMagnetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState("site");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storageState, setStorageState] = useState<LeadMagnetStorageState | null>(
    null,
  );

  useEffect(() => {
    setStorageState(readStateFromStorage());
  }, []);

  const openLeadMagnet = useCallback(
    (triggerSource = "site") => {
      setSource(triggerSource);
      setError(null);
      setIsOpen(true);

      trackEvent("lead_magnet_open", {
        source: triggerSource,
        hasAccess: Boolean(storageState?.downloadUrl),
      });
    },
    [storageState?.downloadUrl],
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setError(null);
  }, []);

  const value = useMemo<LeadMagnetContextValue>(
    () => ({
      openLeadMagnet,
      hasAccess: Boolean(storageState?.downloadUrl),
      downloadUrl: storageState?.downloadUrl ?? null,
    }),
    [openLeadMagnet, storageState?.downloadUrl],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();

    if (!email) {
      setError("Email is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    trackEvent("lead_magnet_submit", {
      source,
    });

    try {
      const response = await fetch("/api/lead-magnet/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          email,
          source,
        }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
        downloadUrl?: string;
      };

      if (!response.ok || !payload.ok || !payload.downloadUrl) {
        setError(payload.error ?? "Could not process your signup.");
        return;
      }

      const nextState: LeadMagnetStorageState = {
        email,
        downloadUrl: payload.downloadUrl,
        capturedAt: new Date().toISOString(),
      };

      writeStateToStorage(nextState);
      setStorageState(nextState);

      trackEvent("lead_magnet_conversion", {
        source,
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasAccess = Boolean(storageState?.downloadUrl);

  return (
    <LeadMagnetContext.Provider value={value}>
      {children}
      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-magnet-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-2xl">
            <button
              type="button"
              onClick={closeModal}
              className="mb-6 ml-auto block rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-semibold tracking-wide text-[var(--color-muted)]"
            >
              Close
            </button>

            <h2
              id="lead-magnet-title"
              className="text-2xl font-semibold text-[var(--color-text)]"
            >
              Free eBook: Catholic Theology Starter Guide
            </h2>

            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              Get the guide instantly and receive the PDF in your inbox.
            </p>

            {hasAccess ? (
              <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
                <p className="text-sm text-[var(--color-text)]">
                  You already unlocked this resource.
                </p>
                <a
                  href={storageState?.downloadUrl ?? "#"}
                  className="mt-4 inline-flex items-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white"
                  onClick={() => {
                    trackEvent("lead_magnet_download", {
                      source,
                      location: "modal_existing",
                    });
                  }}
                >
                  Download PDF
                </a>
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <label className="block text-sm text-[var(--color-muted)]" htmlFor="firstName">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  autoComplete="given-name"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text)]"
                  placeholder="Maria"
                />

                <label className="block text-sm text-[var(--color-muted)]" htmlFor="email">
                  Email address
                </label>
                <input
                  required
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text)]"
                  placeholder="you@example.com"
                />

                {error ? (
                  <p className="text-sm font-medium text-[var(--color-danger)]">{error}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Sending your guide..." : "Unlock Free eBook"}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </LeadMagnetContext.Provider>
  );
}

export function useLeadMagnet() {
  const context = useContext(LeadMagnetContext);

  if (!context) {
    throw new Error("useLeadMagnet must be used inside LeadMagnetProvider");
  }

  return context;
}
