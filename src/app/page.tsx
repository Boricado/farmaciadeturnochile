'use client'

import { useState } from 'react'
import { lazy, Suspense } from 'react'
import { Pill, ListFilter, Map as MapIcon } from 'lucide-react'
import SearchForm from '@/components/SearchForm'
import PharmacyCard from '@/components/PharmacyCard'
import AdBanner from '@/components/AdBanner'
import { useBuscarFarmacias } from '@/lib/useMinsal'

const PharmacyMap = lazy(() => import('@/components/PharmacyMap'))

export default function Home() {
  const { farmacias, loading, searched, buscar, buscarCercanas } = useBuscarFarmacias()
  const [view, setView] = useState<'lista' | 'mapa'>('lista')
  const [modoGeo, setModoGeo] = useState(false)

  const today = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handleSearch = (region: string, comuna: string) => {
    setModoGeo(false)
    buscar(region, comuna || undefined)
  }

  const handleNearby = (lat: number, lng: number) => {
    setModoGeo(true)
    buscarCercanas(lat, lng)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

        {/* Banner publicidad superior */}
        <AdBanner slot="6956129152" format="horizontal" />

        {/* Formulario de búsqueda */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4 text-base">
            ¿Dónde necesitas una farmacia?
          </h2>
          <SearchForm onSearch={handleSearch} onNearby={handleNearby} loading={loading} />
        </section>

        {/* Resultados */}
        {searched && (
          <>
            {farmacias.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                <Pill className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  No hay farmacias de turno para esta búsqueda hoy
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Intenta con otra región o comuna
                </p>
              </div>
            ) : (
              <>
                {/* Controles de resultados */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-600">
                    {modoGeo
                      ? `${farmacias.length} farmacias más cercanas`
                      : `${farmacias.length} farmacia${farmacias.length !== 1 ? 's' : ''} de turno hoy`}
                  </p>
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setView('lista')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                        view === 'lista'
                          ? 'bg-white text-gray-800 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <ListFilter className="h-4 w-4" />
                      Lista
                    </button>
                    <button
                      onClick={() => setView('mapa')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                        view === 'mapa'
                          ? 'bg-white text-gray-800 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <MapIcon className="h-4 w-4" />
                      Mapa
                    </button>
                  </div>
                </div>

                {/* Vista lista */}
                {view === 'lista' && (
                  <div className="flex flex-col gap-3">
                    {farmacias.map((f, i) => (
                      <div key={f.local_id}>
                        <PharmacyCard farmacia={f} distancia={'distancia' in f ? (f as { distancia: number }).distancia : undefined} />
                        {(i + 1) % 5 === 0 && i < farmacias.length - 1 && (
                          <div className="mt-3">
                            <AdBanner slot="3144441884" format="rectangle" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Vista mapa */}
                {view === 'mapa' && (
                  <Suspense
                    fallback={
                      <div className="h-72 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Cargando mapa...</span>
                      </div>
                    }
                  >
                    <PharmacyMap farmacias={farmacias} />
                  </Suspense>
                )}
              </>
            )}
          </>
        )}

        {searched && farmacias.length > 0 && (
          <AdBanner slot="3727330582" format="auto" />
        )}
      </main>

      <footer className="max-w-2xl mx-auto px-4 py-8 text-center flex flex-col gap-1">
        <p className="text-xs text-gray-400">
          Datos proporcionados por{' '}
          <a href="https://datos.gob.cl" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
            MINSAL / datos.gob.cl
          </a>
          {' '}· Actualizado diariamente
        </p>
        <p className="text-xs text-gray-400">
          <a href="/privacidad" className="underline hover:text-gray-600">
            Política de Privacidad
          </a>
          {' '}· © 2026 Farmacia de Turno Chile
        </p>
      </footer>
    </div>
  )
}
