import { readFileSync } from "fs";
import { join } from "path";
import { resolveLazyImages } from "@/lib/lazyImages";

const headerHtml = resolveLazyImages(
  readFileSync(join(process.cwd(), "src/content/header.html"), "utf-8")
);

export default function SiteHeader() {
  return <div dangerouslySetInnerHTML={{ __html: headerHtml }} />;
}
