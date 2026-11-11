import Studio from "@/components/Studio";
import { pageMetadata } from "@/lib/i18n";
import { studio } from "@/lib/studio";

export const metadata = pageMetadata("en", "/kochandcode", studio.copy.en);

export default function Page() {
  return <Studio lang="en" />;
}
