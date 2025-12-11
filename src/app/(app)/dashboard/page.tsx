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
            Privire de ansamblu
          </p>
          <h1 className="text-3xl font-semibold text-white">Panou de control</h1>
          <p className="text-slate-300">Administrează aparatele și paginile de instrucțiuni cu QR.</p>
        </div>
        <Link
          href="/devices"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 sm:w-auto"
        >
          Mergi la aparate
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <StatCard label="Total aparate" value={total} />
        <StatCard label="Cu video" value={withVideo} />
        <StatCard label="Cu pași" value={devices.filter((d) => d.steps.length).length} />
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-800 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-white">Cum funcționează?</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-300">
          <p>1. Adaugă un aparat cu video și pași.</p>
          <p>2. Prin­tează codul QR și lipește stickerul pe aparat.</p>
          <p>3. Sportivul scanează și vede instrucțiunile imediat.</p>
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

