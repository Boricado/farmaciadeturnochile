import { notFound } from 'next/navigation'
import { Pill } from 'lucide-react'
import type { Metadata } from 'next'
import RegionFarmacias from '@/components/RegionFarmacias'
import Breadcrumb from '@/components/Breadcrumb'
import { REGIONES_NOMBRES, SLUG_A_REGION } from '@/lib/minsal'

const BASE = 'https://farmaciadeturnochile.cl'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>
}): Promise<Metadata> {
  const { region: slug } = await params
  const regionId = SLUG_A_REGION[slug]
  if (!regionId) return {}
  const nombre = REGIONES_NOMBRES[regionId]
  return {
    title: `Farmacia de Turno ${nombre} | Hoy`,
    description: `Encuentra las farmacias de turno abiertas hoy en ${nombre}, Chile. Datos actualizados desde MINSAL.`,
  }
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>
}) {
  const { region: slug } = await params

  const regionId = SLUG_A_REGION[slug]
  if (!regionId) notFound()

  const regionNombre = REGIONES_NOMBRES[regionId]
  const shareUrl = `${BASE}/turno/${slug}`
  const titulo = `Farmacia de turno en ${regionNombre}`

  const today = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-green-600 rounded-xl p-2">
            <Pill className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg leading-tight">
              Farmacia de Turno Chile
            </h1>
            <p className="text-xs text-gray-500 capitalize">{today}</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: regionNombre },
          ]}
        />

        <RegionFarmacias
          regionId={regionId}
          regionSlug={slug}
          titulo={titulo}
          regionNombre={regionNombre}
          shareUrl={shareUrl}
        />
      </main>

      <footer className="max-w-2xl mx-auto px-4 py-8 text-center flex flex-col gap-1">
        <p className="text-xs text-gray-400">
          Datos proporcionados por{' '}
          <a
            href="https://datos.gob.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            MINSAL / datos.gob.cl
          </a>{' '}
          · Actualizado diariamente
        </p>
        <p className="text-xs text-gray-400">
          <a href="/privacidad" className="underline hover:text-gray-600">
            Política de Privacidad
          </a>{' '}
          · © 2026 Farmacia de Turno Chile
        </p>
      </footer>
    </div>
  )
}
