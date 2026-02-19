'use client'

import { useEffect, useRef } from 'react'
import { Farmacia } from '@/lib/types'

interface PharmacyMapProps {
  farmacias: Farmacia[]
}

export default function PharmacyMap({ farmacias }: PharmacyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || farmacias.length === 0) return

    // Importación dinámica de Leaflet (solo cliente)
    import('leaflet').then((L) => {
      // Evitar reinicialización
      if (mapInstanceRef.current) {
        const map = mapInstanceRef.current as ReturnType<typeof L.map>
        map.remove()
        mapInstanceRef.current = null
      }

      // Calcular centro del mapa
      const lats = farmacias.map((f) => parseFloat(f.local_lat)).filter(Boolean)
      const lngs = farmacias.map((f) => parseFloat(f.local_lng)).filter(Boolean)
      const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length
      const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length

      const map = L.map(mapRef.current!).setView([centerLat, centerLng], 12)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      }).addTo(map)

      // Ícono personalizado verde
      const icon = L.divIcon({
        html: `<div style="background:#16a34a;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        className: '',
      })

      farmacias.forEach((f) => {
        const lat = parseFloat(f.local_lat)
        const lng = parseFloat(f.local_lng)
        if (!lat || !lng) return

        const apertura = f.funcionamiento_hora_apertura?.slice(0, 5) ?? '--'
        const cierre = f.funcionamiento_hora_cierre?.slice(0, 5) ?? '--'

        L.marker([lat, lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="min-width:160px">
              <strong>${f.local_nombre}</strong><br/>
              <span style="color:#6b7280;font-size:13px">${f.local_direccion}</span><br/>
              <span style="color:#16a34a;font-size:13px">🕐 ${apertura} – ${cierre}</span><br/>
              ${f.local_telefono ? `<a href="tel:${f.local_telefono}" style="color:#2563eb;font-size:13px">📞 ${f.local_telefono}</a><br/>` : ''}
              <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" style="color:#2563eb;font-size:13px">📍 Cómo llegar</a>
            </div>`
          )
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        const map = mapInstanceRef.current as { remove: () => void }
        map.remove()
        mapInstanceRef.current = null
      }
    }
  }, [farmacias])

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={mapRef} className="h-72 md:h-96 w-full" />
    </div>
  )
}
