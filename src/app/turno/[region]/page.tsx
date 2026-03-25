import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Pill, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import PharmacyCard from '@/components/PharmacyCard'
import {
  fetchFarmacias,
  filtrarFarmacias,
  REGIONES_NOMBRES,
  REGIONES_SLUGS,
  SLUG_A_REGION,
} from '@/lib/minsal'

export const revalidate = 3600

export async function generateStaticParams() {
  return Object.values(REGIONES_SLUGS).map((slug) => ({ region: slug }))
}

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

  const nombre = REGIONES_NOMBRES[regionId]
  const todas = await fetchFarmacias()
  const farmacias = filtrarFarmacias(todas, regionId)

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
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Buscar por comuna
        </Link>

        <section>
          <h2 className="text-xl font-bold text-gray-900">{nombre}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {farmacias.length} farmacia{farmacias.length !== 1 ? 's' : ''} de turno hoy
          </p>
        </section>

        {farmacias.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <Pill className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              No hay farmacias de turno en esta región hoy
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {farmacias.map((f) => (
              <PharmacyCard key={f.local_id} farmacia={f} />
            ))}
          </div>
        )}
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
