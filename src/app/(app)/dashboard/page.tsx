"use client";

import Link from "next/link";
import { useDevices } from "@/components/devices/DeviceProvider";

export default function DashboardPage() {
  const { devices } = useDevices();
  const total = devices.length;
  const withVideo = devices.filter((d) => d.videoUrl).length;

  return (
    <div className="space-y-8 text-slate-100">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Overzicht
          </p>
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          <p className="text-slate-300">Beheer je apparaten en QR uitlegpagina&apos;s.</p>
        </div>
        <Link
          href="/devices"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 sm:w-auto"
        >
          Naar apparaten
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <StatCard label="Totaal apparaten" value={total} />
        <StatCard label="Met video" value={withVideo} />
        <StatCard label="Met stappenplan" value={devices.filter((d) => d.steps.length).length} />
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-800 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-white">Hoe werkt het?</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-300">
          <p>1. Voeg een apparaat toe met video en stappenplan.</p>
          <p>2. Print de QR code en plak de sticker op het toestel.</p>
          <p>3. De sporter scant de QR en ziet direct de uitlegpagina.</p>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-800 p-5 shadow-sm">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

