"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useDevices } from "@/components/devices/DeviceProvider";

const toEmbedUrl = (url?: string) => {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      const params = u.search ? `${u.search}&` : "?";
      return `https://www.youtube.com/embed/${id}${params}autoplay=1&mute=1&rel=0`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&rel=0`;
      if (u.pathname.startsWith("/embed/")) return `${url}${url.includes("?") ? "&" : "?"}autoplay=1&mute=1&rel=0`;
    }
    return `${url}${url.includes("?") ? "&" : "?"}autoplay=1&mute=1`;
  } catch {
    return url;
  }
};

export default function DeviceDetailPage() {
  const params = useParams<{ id: string }>();
  const { getDevice } = useDevices();
  const router = useRouter();

  const device = useMemo(() => getDevice(params.id), [getDevice, params.id]);
  const embedUrl = toEmbedUrl(device?.videoUrl);

  useEffect(() => {
    if (!device) {
      // in scans, keep it graceful by redirecting after short delay
      const t = setTimeout(() => router.replace("/login"), 2200);
      return () => clearTimeout(t);
    }
  }, [device, router]);

  if (!device) {
    notFound();
  }

  if (!device) return null;

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
          <ol className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            {device.steps.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                  {idx + 1}
                </span>
                <span className="pt-0.5">{step}</span>
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

