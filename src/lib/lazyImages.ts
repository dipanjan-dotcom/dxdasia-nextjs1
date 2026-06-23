/**
 * WordPress/LiteSpeed serve images with a base64 placeholder in `src` and the
 * real URL in `data-src`/`data-srcset`, swapped in by a lazyload script we
 * don't ship. Resolve them server-side so images show up without that script.
 */
export function resolveLazyImages(html: string): string {
  return html.replace(/<img\b[^>]*>/g, (tag) => {
    const dataSrc = tag.match(/\sdata-src="([^"]*)"/)?.[1];
    const dataSrcset = tag.match(/\sdata-srcset="([^"]*)"/)?.[1];
    let result = tag;
    if (dataSrc) {
      result = result.replace(/\ssrc="[^"]*"/, ` src="${dataSrc}"`);
    }
    if (dataSrcset) {
      if (/\ssrcset="[^"]*"/.test(result)) {
        result = result.replace(/\ssrcset="[^"]*"/, ` srcset="${dataSrcset}"`);
      } else {
        result += ` srcset="${dataSrcset}"`;
      }
    }
    return result;
  });
}
