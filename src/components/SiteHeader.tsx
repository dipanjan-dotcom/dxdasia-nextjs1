import { readFileSync } from "fs";
import { join } from "path";

const headerHtml = readFileSync(join(process.cwd(), "src/content/header.html"), "utf-8");

export default function SiteHeader() {
  return <div dangerouslySetInnerHTML={{ __html: headerHtml }} />;
}
