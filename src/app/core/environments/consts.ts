// Deployed backend (Swagger confirmed at http://zizoshop.runasp.net/index.html)
// has no working HTTPS, so calling it directly from a browser on an https page
// (like your deployed https://shop-app-five-eta.vercel.app) gets blocked as
// mixed content -> "Failed to fetch".
//
// Fix: on an https page, use a same-origin relative URL ('') instead. The
// matching `vercel.json` rewrite proxies /api/* to the http backend
// server-side (Node-to-Node calls aren't subject to the browser's
// mixed-content rule). Everywhere else — SSR (no `window`) and local
// `ng serve` on plain http://localhost — call the backend directly, since
// there's no mixed-content issue there and no proxy is set up for local dev.
const isHttpsBrowser = typeof window !== 'undefined' && window.location.protocol === 'https:';

export const consts ={
baseUrl: isHttpsBrowser ? '' : 'http://zizoshop.runasp.net',
// Local dev backend instead: check the ports `dotnet run` prints and swap in
// one of these (https one avoids mixed-content/cert issues less often):
// baseUrl: 'https://localhost:7291',
// baseUrl: 'http://localhost:5268',
serverUrl:'http://localhost:4200'
}
