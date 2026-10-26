import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RevealObserver } from "@/components/reveal";
import { SettingsProvider } from "@/components/settings-provider";
import { getSettings } from "@/lib/content";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const { bookingUrl, phone, phoneHref } = await getSettings();
  return (
    <SettingsProvider settings={{ bookingUrl, phone, phoneHref }}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <RevealObserver />
    </SettingsProvider>
  );
}
