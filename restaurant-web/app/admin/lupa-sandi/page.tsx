"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction, type AuthState } from "@/actions/auth";
import { Button } from "@/components/ui/button";

const initialState: AuthState = {};

/**
 * A2: Layar Lupa Kata Sandi — Design.md §6 A2, §5 J9
 * Judul "Atur ulang kata sandi", satu kalimat penjelasan,
 * Email, tombol "Kirim tautan", tautan "Kembali ke Masuk".
 */
export default function AdminForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState);

  return (
    <main className="min-h-screen bg-paper flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-surface rounded-lg border border-line shadow-xs p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-md bg-sunken border border-line flex items-center justify-center mb-3">
            <span className="font-display font-semibold text-brand text-xl">K</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Atur Ulang Kata Sandi
          </h1>
          <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
            Masukkan alamat email admin Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
          </p>
        </div>

        {/* Pesan Error */}
        {state.error && (
          <div
            role="alert"
            className="mb-5 p-3 rounded-md bg-danger/10 border border-danger/20 text-danger text-xs font-semibold flex items-start gap-2"
          >
            <AlertCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Pesan Sukses Netral (Design.md J9) */}
        {state.success ? (
          <div className="space-y-4">
            <div
              role="status"
              className="p-4 rounded-md bg-success/10 border border-success/20 text-success text-xs font-semibold leading-relaxed"
            >
              {state.message}
            </div>

            <Link
              href="/admin/masuk"
              className="inline-flex items-center justify-center w-full h-11 px-5 rounded-md bg-ink text-paper text-sm font-semibold hover:bg-ink/90 transition-colors"
            >
              Kembali ke Masuk
            </Link>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-ink">
                Email
                <span className="text-danger ml-1" aria-hidden="true">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                placeholder="nama@email.com"
                disabled={isPending}
                className="h-11 px-3 rounded-md border border-line-strong bg-surface text-ink text-sm placeholder:text-ink-muted/50 focus:border-ink focus:ring-2 focus:ring-ink/10 focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primer"
                size="md"
                loading={isPending}
                disabled={isPending}
                className="w-full justify-center"
              >
                {isPending ? "Mengirim tautan..." : "Kirim Tautan Reset"}
              </Button>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/admin/masuk"
                className="text-xs text-ink-muted hover:text-ink font-semibold transition-colors"
              >
                Batal dan kembali ke Masuk
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

function AlertCircleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
