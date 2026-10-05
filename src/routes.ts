// Vite's base path ('/' by default, always ending in '/'), so the site can also live under a sub-path like /cgi/
const BASE = import.meta.env.BASE_URL

export type Route =
  | { name: 'landing' }
  | { name: 'app' }
  | { name: 'presentation' }
  | { name: 'screen'; screen: string }

// Builds a link to one of the site's pages, e.g. href('app') or href('presentation/screen/bill')
export function href(path = '') {
  return BASE + path.replace(/^\//, '')
}

// Works out which page to show from the URL; anything unknown gets the landing page
export function currentRoute(pathname = window.location.pathname): Route {
  const path = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, '')
  if (/^app\/?$/.test(path)) return { name: 'app' }
  if (/^presentation\/?$/.test(path)) return { name: 'presentation' }
  const screen = path.match(/^presentation\/screen\/([\w-]+)\/?$/)?.[1]
  if (screen) return { name: 'screen', screen }
  return { name: 'landing' }
}
