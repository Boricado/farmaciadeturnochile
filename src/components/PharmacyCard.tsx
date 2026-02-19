import { Phone, MapPin, Clock, Navigation } from 'lucide-react'
import { Farmacia } from '@/lib/types'

interface PharmacyCardProps {
  farmacia: Farmacia
  distancia?: number
}

function formatHora(hora: string): string {
  if (!hora) return '--'
  return hora.slice(0, 5) // "HH:MM"
}

export default function PharmacyCard({ farmacia, distancia }: PharmacyCardProps) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${farmacia.local_lat},${farmacia.local_lng}`
  const wazeUrl = `https://waze.com/ul?ll=${farmacia.local_lat},${farmacia.local_lng}&navigate=yes`
  const telUrl = `tel:${farmacia.local_telefono}`

  const apertura = formatHora(farmacia.funcionamiento_hora_apertura)
  const cierre = formatHora(farmacia.funcionamiento_hora_cierre)

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Nombre y comuna */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-tight">
            {farmacia.local_nombre}
          </h3>
          <p className="text-sm text-green-600 font-medium mt-0.5">{farmacia.comuna_nombre}</p>
        </div>
        {distancia !== undefined && (
          <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 border border-green-100">
            {distancia < 1
              ? `${Math.round(distancia * 1000)} m`
              : `${distancia.toFixed(1)} km`}
          </span>
        )}
      </div>

      {/* Dirección */}
      <div className="flex items-start gap-2 mb-2">
        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
        <span className="text-sm text-gray-600">{farmacia.local_direccion}</span>
      </div>

      {/* Horario */}
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-4 w-4 text-gray-400 shrink-0" />
        <span className="text-sm text-gray-600">
          {apertura} – {cierre}
        </span>
      </div>

      {/* Teléfono */}
      {farmacia.local_telefono && (
        <div className="flex items-center gap-2 mb-4">
          <Phone className="h-4 w-4 text-gray-400 shrink-0" />
          <a href={telUrl} className="text-sm text-blue-600 hover:underline">
            {farmacia.local_telefono}
          </a>
        </div>
      )}

      {/* Botones de navegación */}
      <div className="flex gap-2">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          <Navigation className="h-4 w-4" />
          Google Maps
        </a>
        <a
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500 px-3 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600 transition"
        >
          <Navigation className="h-4 w-4" />
          Waze
        </a>
      </div>
    </div>
  )
}
