"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { loginAction, type AuthState } from "@/actions/auth";
import { Button } from "@/components/ui/button";

const initialState: AuthState = {};

/**
 * A1: Layar Masuk Admin — Design.md §6 A1, §7
 * Kartu --surface di tengah, lebar maks 400.
 * Email, Kata sandi (dengan tombol Tampilkan), tombol Masuk lebar penuh.
 */
export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-paper flex flex-col items-center justify-center p-4">
      {/* Kartu Masuk */}
      <div className="w-full max-w-[400px] bg-surface rounded-lg border border-line shadow-xs p-6 sm:p-8">
        {/* Identitas / Header Kartu */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-md bg-sunken border border-line flex items-center justify-center mb-3">
            <span className="font-display font-semibold text-brand text-xl">K</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Masuk ke Admin
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Portal kelola menu & profil kedai
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

        {/* Form Masuk */}
        <form action={formAction} className="space-y-4">
          {/* Field Email */}
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

          {/* Field Kata Sandi */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-semibold text-ink">
                Kata Sandi
                <span className="text-danger ml-1" aria-hidden="true">*</span>
              </label>
              <Link
                href="/admin/lupa-sandi"
                className="text-xs text-brand font-semibold hover:underline"
                tabIndex={0}
              >
                Lupa sandi?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                disabled={isPending}
                className="h-11 w-full pl-3 pr-11 rounded-md border border-line-strong bg-surface text-ink text-sm placeholder:text-ink-muted/50 focus:border-ink focus:ring-2 focus:ring-ink/10 focus:outline-none transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-11 px-3 text-ink-muted hover:text-ink transition-colors flex items-center justify-center text-xs font-semibold cursor-pointer"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                tabIndex={-1}
              >
                {showPassword ? "Tutup" : "Lihat"}
              </button>
            </div>
          </div>

          {/* Tombol Masuk */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primer"
              size="md"
              loading={isPending}
              disabled={isPending}
              className="w-full justify-center"
            >
              {isPending ? "Memverifikasi..." : "Masuk"}
            </Button>
          </div>
        </form>
      </div>

      {/* Navigasi Balik ke Beranda */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-xs text-ink-muted hover:text-ink font-semibold transition-colors inline-flex items-center gap-1.5"
        >
          <span>←</span>
          <span>Kembali ke menu publik</span>
        </Link>
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
