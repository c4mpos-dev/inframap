import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Public routes listed in the sitemap. Team and dev screens stay out.
const PUBLIC_ROUTES = ['/', '/mapa', '/indicadores', '/entrar', '/privacidade', '/termos']

/**
 * Link previews (WhatsApp, Instagram, Google) need absolute URLs. On Vercel the
 * production domain comes from VERCEL_PROJECT_PRODUCTION_URL; VITE_SITE_URL wins
 * when a custom domain is set.
 */
function siteUrl(): string {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const url = process.env.VITE_SITE_URL || (vercel ? `https://${vercel}` : 'http://localhost:5173')
  return url.replace(/\/+$/, '')
}

function siteMeta(): Plugin {
  const url = siteUrl()
  return {
    name: 'inframap-site-meta',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', url),
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nDisallow: /equipe\nDisallow: /dev/\n\nSitemap: ${url}/sitemap.xml\n`,
      })
      const entries = PUBLIC_ROUTES.map((route) => `  <url><loc>${url}${route}</loc></url>`)
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`,
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteMeta()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
