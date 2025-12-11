"use client";

import { AuthProvider } from "../auth/AuthProvider";
import { DeviceProvider } from "../devices/DeviceProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DeviceProvider>{children}</DeviceProvider>
    </AuthProvider>
  );
}

