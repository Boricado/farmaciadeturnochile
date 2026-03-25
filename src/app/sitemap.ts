import { MetadataRoute } from 'next'
import { REGIONES_SLUGS } from '@/lib/minsal'

const BASE = 'https://farmaciadeturnochile.cl'

export default function sitemap(): MetadataRoute.Sitemap {
  const regionPages = Object.values(REGIONES_SLUGS).map((slug) => ({
    url: `${BASE}/turno/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE}/privacidad`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    ...regionPages,
  ]
}
