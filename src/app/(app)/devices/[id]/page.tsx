"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDevices, type Device } from "@/components/devices/DeviceProvider";

const toEmbedUrl = (url?: string) => {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      const params = u.search ? `${u.search}&` : "?";
      return `https://www.youtube.com/embed/${id}${params}autoplay=1&rel=0`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      if (u.pathname.startsWith("/embed/")) return `${url}${url.includes("?") ? "&" : "?"}autoplay=1&rel=0`;
    }
    return `${url}${url.includes("?") ? "&" : "?"}autoplay=1`;
  } catch {
    return url;
  }
};

export default function DeviceDetailPage() {
  const params = useParams<{ id: string }>();
  const { getDevice } = useDevices();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // mark as client-only without triggering extra renders
    setTimeout(() => setHydrated(true), 0);
  }, []);

  const payloadDevice = useMemo(() => {
    const payload = searchParams.get("payload");
    if (!payload) return undefined;
    try {
      return JSON.parse(atob(payload)) as Device;
    } catch {
      return undefined;
    }
  }, [searchParams]);

  const device = useMemo(() => getDevice(params.id) ?? payloadDevice, [getDevice, params.id, payloadDevice]);
  const embedUrl = toEmbedUrl(device?.videoUrl);

  useEffect(() => {
    if (!device && hydrated) {
      // graceful fallback: show message, no redirect
      return;
    }
  }, [device, hydrated, router]);

  if (!device) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Aparat indisponibil</h1>
        <p className="text-sm">
          Nu am găsit acest aparat în datele locale. Deschide linkul din panoul de admin sau scanează un QR generat
          recent.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-indigo-500">
          {device.muscleGroup || "Aparat"}
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">{device.name}</h1>
        <p className="text-sm text-slate-600">{device.description}</p>
        {device.location && (
          <p className="mt-1 text-xs font-medium text-slate-500">Locație: {device.location}</p>
        )}
      </div>

      {embedUrl && (
        <div className="aspect-video overflow-hidden rounded-xl bg-slate-100">
          <iframe
            src={embedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={device.name}
          />
        </div>
      )}

      {device.steps.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Pași</h2>
          <ol className="space-y-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            {device.steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-indigo-600 px-2 text-xs font-semibold text-white leading-none">
                  {idx + 1}
                </span>
                <span className="pt-0.5 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {!device.videoUrl && !device.steps.length && (
        <p className="text-sm text-slate-500">
          Nu există încă video sau pași pentru acest aparat.
        </p>
      )}
    </div>
  );
}

