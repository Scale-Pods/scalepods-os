import { ContentStoreProvider } from "@/components/marketing/store";

export default function ContentOsLayout({ children }: { children: React.ReactNode }) {
  return <ContentStoreProvider>{children}</ContentStoreProvider>;
}
