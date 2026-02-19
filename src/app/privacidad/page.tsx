import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Farmacia de Turno Chile',
  description: 'Política de privacidad del sitio Farmacia de Turno Chile',
}

export default function Privacidad() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/" className="text-green-600 hover:underline text-sm">
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
          <p className="text-gray-500 text-sm mb-6">Última actualización: febrero de 2026</p>

          <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">1. Información que recopilamos</h2>
          <p className="text-gray-600">
            Farmacia de Turno Chile no recopila información personal de sus usuarios.
            Los datos de farmacias provienen del sistema público FARMANET del Ministerio de Salud de Chile (MINSAL).
          </p>

          <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">2. Cookies y publicidad</h2>
          <p className="text-gray-600">
            Este sitio utiliza Google AdSense para mostrar anuncios. Google puede usar cookies
            para mostrar anuncios relevantes basados en tus visitas anteriores a este y otros sitios.
            Puedes desactivarlas en{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
              Configuración de anuncios de Google
            </a>.
          </p>

          <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">3. Geolocalización</h2>
          <p className="text-gray-600">
            Si usas "Usar mi ubicación", el sitio accede a tu GPS solo para mostrarte farmacias cercanas.
            Esta información no se almacena ni se comparte con terceros.
          </p>

          <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">4. Servicios de terceros</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Google AdSense (publicidad)</li>
            <li>OpenStreetMap / Leaflet (mapas)</li>
            <li>API FARMANET MINSAL (datos de farmacias)</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">5. Exactitud de la información</h2>
          <p className="text-gray-600">
            Los datos se obtienen directamente desde MINSAL y se actualizan diariamente.
            No nos responsabilizamos por errores en la información oficial de MINSAL.
          </p>
        </div>
      </main>

      <footer className="max-w-2xl mx-auto px-4 py-6 text-center">
        <p className="text-xs text-gray-400">© 2026 Farmacia de Turno Chile</p>
      </footer>
    </div>
  )
}
