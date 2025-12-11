"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import QRCode from "react-qr-code";
import { useDevices, Device } from "@/components/devices/DeviceProvider";

type FormState = {
  name: string;
  description: string;
  location: string;
  muscleGroup: string;
  videoUrl: string;
  stepsText: string;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  location: "",
  muscleGroup: "",
  videoUrl: "",
  stepsText: "",
};

export default function DevicesPage() {
  const { devices, addDevice, updateDevice, removeDevice } = useDevices();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const steps = form.stepsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: Omit<Device, "id"> = {
        name: form.name.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        muscleGroup: form.muscleGroup.trim(),
        videoUrl: form.videoUrl.trim(),
        steps,
      };

      if (!payload.name) throw new Error("Naam is verplicht.");
      if (!payload.description) throw new Error("Korte omschrijving is verplicht.");

      if (editingId) {
        updateDevice(editingId, payload);
      } else {
        addDevice(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Onbekende fout";
      setError(message);
    }
  };

  const startEdit = (device: Device) => {
    setEditingId(device.id);
    setForm({
      name: device.name,
      description: device.description,
      location: device.location,
      muscleGroup: device.muscleGroup,
      videoUrl: device.videoUrl ?? "",
      stepsText: device.steps.join("\n"),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">
            Apparaten
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">Apparaatbeheer</h1>
          <p className="text-slate-500">Voeg een toestel toe en genereer direct de QR sticker.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex w-full justify-center rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 sm:w-auto"
          aria-expanded={showForm}
          aria-controls="device-form"
        >
          {showForm ? "Formulier verbergen" : "Nieuw apparaat toevoegen"}
        </button>
      </div>

      {showForm && (
        <form
          id="device-form"
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? "Bewerk apparaat" : "Nieuw apparaat"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-sm font-medium text-slate-600 underline underline-offset-4"
              >
                Annuleer
              </button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Naam"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Field
              label="Locatie"
              placeholder="Circuit zone / zaal"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
            <Field
              label="Spiergroep"
              placeholder="Borst, rug, benen..."
              value={form.muscleGroup}
              onChange={(e) => setForm((f) => ({ ...f, muscleGroup: e.target.value }))}
            />
            <Field
              label="Video URL (YouTube, Vimeo...)"
              placeholder="https://youtu.be/..."
              value={form.videoUrl}
              onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
            />
          </div>
          <TextArea
            label="Korte omschrijving"
            required
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <TextArea
            label="Stappenplan (1 per regel)"
            value={form.stepsText}
            onChange={(e) => setForm((f) => ({ ...f, stepsText: e.target.value }))}
            placeholder={"Stap 1...\nStap 2...\nStap 3..."}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 sm:w-auto"
          >
            {editingId ? "Opslaan" : "Toevoegen"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onEdit={() => {
              startEdit(device);
              setShowForm(true);
            }}
            onDelete={() => removeDevice(device.id)}
          />
        ))}
        {!devices.length && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Nog geen apparaten. Gebruik de knop hierboven om het eerste toestel toe te voegen.
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  ...props
}: {
  label: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="space-y-1 text-sm text-slate-700">
      <span className="font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        {...props}
        required={required}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </label>
  );
}

function TextArea({
  label,
  required,
  ...props
}: {
  label: string;
  required?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="space-y-1 text-sm text-slate-700">
      <span className="font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <textarea
        {...props}
        required={required}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        rows={3}
      />
    </label>
  );
}

function DeviceCard({
  device,
  onEdit,
  onDelete,
}: {
  device: Device;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const origin =
    typeof window !== "undefined" && window.location.origin ? window.location.origin : "";
  const qrValue = `${origin}/devices/${device.id}`;

  const stepsText = useMemo(() => device.steps.join(", "), [device.steps]);

  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-indigo-500">
            {device.muscleGroup || "Apparaat"}
          </p>
          <h3 className="text-xl font-semibold text-slate-900">{device.name}</h3>
          <p className="text-sm text-slate-600">{device.description}</p>
          {device.location && (
            <p className="mt-1 text-xs font-medium text-slate-500">Locatie: {device.location}</p>
          )}
          {stepsText && <p className="mt-2 text-xs text-slate-500">Stappen: {stepsText}</p>}
          <div className="mt-3 flex gap-2 text-sm font-medium text-indigo-600">
            <Link href={`/devices/${device.id}`} className="hover:underline">
              Bekijken
            </Link>
            <button onClick={onEdit} className="text-slate-700 hover:underline">
              Bewerken
            </button>
            <button onClick={onDelete} className="text-red-600 hover:underline">
              Verwijderen
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-lg bg-white p-2 shadow-inner">
            <QRCode value={qrValue} size={110} />
          </div>
          <p className="text-[11px] text-slate-500">Scan voor uitleg</p>
        </div>
      </div>
    </div>
  );
}

