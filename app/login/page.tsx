'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../image.png';
import { Mail, Lock, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleInfo, setRoleInfo] = useState<string | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const showRole = roleInfo || isCheckingRole;

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!email || !email.includes('@')) {
        setRoleInfo(null);
        setError(null);
        return;
      }
      setIsCheckingRole(true);
      try {
        const res = await fetch('/api/check-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (res.ok) {
          const data = await res.json();
          setRoleInfo(data.role);
          setError(null);
        } else {
          setRoleInfo(null);
        }
      } catch {
        setRoleInfo(null);
      } finally {
        setIsCheckingRole(false);
      }
    }, 600);

    return () => clearTimeout(handler);
  }, [email]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        setIsLoggingIn(false);
        return;
      }
      router.push('/dashboard/teams');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4 relative selection:bg-emerald-500/30">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/25 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/25 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">

        {/* ── Header ── */}
        <div className="text-center mb-8">
          {/* Logo — clean, no box */}
          <div className="inline-block mb-5">
            <Image
              src={logo}
              alt="GFG RBU"

              className="rounded-[7px] shadow-[0_0_40px_rgba(16,185,129,0.18)]"
              style={{ width: '88px', height: 'auto' }}
              priority
            />
          </div>

          {/* <h1 className="text-[28px] font-semibold tracking-tight text-white leading-tight">
            Welcome Back!
          </h1> */}
          {/* <p className="mt-1.5 text-[13px] text-zinc-500 tracking-wide font-medium uppercase">
            GFG&nbsp;RBU &middot; Admin&nbsp;Portal
          </p>  */}
        </div>

        {/* ── Card ── */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-2xl p-6 shadow-[0_8px_48px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-700 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="name@gfg-rbu.com"
                  required
                />
              </div>
            </div>

            {/* Role pill — animates height, no reserved space */}
            <div
              className="overflow-hidden transition-all duration-500 ease-in-out"
              style={{
                maxHeight: showRole ? '52px' : '0px',
                opacity: showRole ? 1 : 0,
                marginTop: showRole ? '0' : '-8px',
              }}
            >
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-2.5">
                {isCheckingRole ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500 flex-shrink-0" />
                    <span className="text-[12px] font-medium text-emerald-400">Checking association…</span>
                  </>
                ) : roleInfo ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="text-[12px] font-medium text-emerald-300">
                      Logging in as&nbsp;<strong className="text-emerald-200">{roleInfo}</strong>
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-700 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-2.5 text-[12px] font-medium text-red-400 text-center">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="mt-1 w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 text-sm font-bold text-emerald-950 transition-all duration-200 hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 group"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Continue to Dashboard</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

          </form>
        </div>

        <p className="mt-6 text-center text-[11px] text-zinc-700 tracking-wide">
          Secure portal · GFG RBU Administration
        </p>
      </div>
    </div>
  );
}