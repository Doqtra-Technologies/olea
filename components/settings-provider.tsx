"use client";

import { createContext, useContext, type ReactNode } from "react";

type ClientSettings = { bookingUrl: string; phone: string; phoneHref: string };

const SettingsContext = createContext<ClientSettings | null>(null);

export function SettingsProvider({ settings, children }: { settings: ClientSettings; children: ReactNode }) {
  return <SettingsContext value={settings}>{children}</SettingsContext>;
}

export function useSettings() {
  const settings = useContext(SettingsContext);
  if (!settings) throw new Error("useSettings must be used inside <SettingsProvider>");
  return settings;
}
