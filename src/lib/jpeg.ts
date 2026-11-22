import "server-only";

/**
 * Width and height from a JPEG's frame header, or null if the bytes aren't a JPEG.
 * Uploads are checked by content; the type and size the browser claims are never trusted.
 */
export function jpegSize(b: Buffer) {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8 || b[b.length - 2] !== 0xff || b[b.length - 1] !== 0xd9) {
    return null;
  }
  let at = 2;
  while (at + 8 < b.length && b[at] === 0xff) {
    const marker = b[at + 1];
    // Start of frame: baseline (C0), extended (C1) or progressive (C2).
    if (marker >= 0xc0 && marker <= 0xc2) {
      const height = b.readUInt16BE(at + 5);
      const width = b.readUInt16BE(at + 7);
      return width && height ? { width, height } : null;
    }
    const length = b.readUInt16BE(at + 2);
    if (length < 2) return null;
    at += 2 + length;
  }
  return null;
}
