"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Device = {
  id: string;
  name: string;
  description: string;
  location: string;
  muscleGroup: string;
  videoUrl?: string;
  steps: string[];
};

type DeviceContextValue = {
  devices: Device[];
  addDevice: (device: Omit<Device, "id">) => void;
  updateDevice: (id: string, device: Omit<Device, "id">) => void;
  removeDevice: (id: string) => void;
  getDevice: (id: string) => Device | undefined;
};

const DeviceContext = createContext<DeviceContextValue | undefined>(undefined);
const STORAGE_KEY = "galaxy-devices-v1";

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [
        {
          id: "seed-seated-leg-press",
          name: "Seated Leg Press",
          description: "Întărește cvadricepșii și fesierii cu o împingere controlată.",
          location: "Zonă forță",
          muscleGroup: "Picioare",
          videoUrl: "https://www.youtube.com/watch?v=8EMbB0tCn7Q",
          steps: [
            "Ajustează scaunul și placa astfel încât genunchii să fie la ~90°.",
            "Așază picioarele la lățimea șoldurilor pe placă, tălpile plate.",
            "Împinge controlat până când picioarele sunt aproape întinse, fără blocarea genunchilor.",
            "Coboară încet la poziția de start.",
            "Repetă 10-15 repetări cu tensiune constantă.",
          ],
        },
      ];
    }
    try {
      const parsed: Device[] = JSON.parse(stored);
      // Migrare rapidă: aduce seed-ul în RO dacă există versiunea veche stocată
      return parsed.map((d) =>
        d.id === "seed-seated-leg-press"
          ? {
              ...d,
              name: "Seated Leg Press",
              description: "Întărește cvadricepșii și fesierii cu o împingere controlată.",
              location: "Zonă forță",
              muscleGroup: "Picioare",
              steps: [
                "Ajustează scaunul și placa astfel încât genunchii să fie la ~90°.",
                "Așază picioarele la lățimea șoldurilor pe placă, tălpile plate.",
                "Împinge controlat până când picioarele sunt aproape întinse, fără blocarea genunchilor.",
                "Coboară încet la poziția de start.",
                "Repetă 10-15 repetări cu tensiune constantă.",
              ],
            }
          : d,
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
  }, [devices]);

  const addDevice = useCallback((device: Omit<Device, "id">) => {
    const next: Device = { ...device, id: crypto.randomUUID() };
    setDevices((prev) => [...prev, next]);
  }, []);

  const updateDevice = useCallback((id: string, device: Omit<Device, "id">) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...device, id } : d)));
  }, []);

  const removeDevice = useCallback((id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const getDevice = useCallback(
    (id: string) => devices.find((d) => d.id === id),
    [devices],
  );

  const value = useMemo(
    () => ({ devices, addDevice, updateDevice, removeDevice, getDevice }),
    [devices, addDevice, updateDevice, removeDevice, getDevice],
  );

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
}

export const useDevices = () => {
  const ctx = useContext(DeviceContext);
  if (!ctx) {
    throw new Error("useDevices moet binnen DeviceProvider gebruikt worden.");
  }
  return ctx;
};

