import { NextRequest, NextResponse } from 'next/server'
import { fetchFarmacias, farmaciasNearby } from '@/lib/minsal'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') ?? '')
  const lng = parseFloat(searchParams.get('lng') ?? '')

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Se requieren parámetros lat y lng' }, { status: 400 })
  }

  try {
    const farmacias = await fetchFarmacias()
    const cercanas = farmaciasNearby(farmacias, lat, lng, 10)
    return NextResponse.json(cercanas)
  } catch (error) {
    console.error('Error al obtener farmacias cercanas:', error)
    return NextResponse.json({ error: 'Error al conectar con MINSAL' }, { status: 500 })
  }
}
