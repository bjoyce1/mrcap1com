// Serve dist/ the way Lovable's host does, so route pages can be checked before publishing:
// a real file first, then the folder's index.html (/music -> music/index.html), then the app
// shell. (vite preview only finds music/index.html for "/music/" with a trailing slash.)
//   npm run build && npm run seo:preview      then: node scripts/seo-verify.mjs http://127.0.0.1:4173
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "dist");
const port = +(process.argv[3] || 4173);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".txt": "text/plain", ".xml": "text/xml", ".webp": "image/webp", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".mp3": "audio/mpeg", ".mp4": "video/mp4",
};

http
  .createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const target = path.join(root, url);
    let file = path.join(root, "index.html");
    if (target.startsWith(root) && fs.existsSync(target) && fs.statSync(target).isFile()) file = target;
    else if (target.startsWith(root) && fs.existsSync(path.join(target, "index.html"))) file = path.join(target, "index.html");
    res.writeHead(200, { "content-type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "cache-control": "no-cache" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => console.log(`Serving ${root} like Lovable at http://127.0.0.1:${port}`));
