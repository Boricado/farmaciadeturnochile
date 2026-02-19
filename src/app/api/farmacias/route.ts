import { NextRequest, NextResponse } from 'next/server'
import { fetchFarmacias, filtrarFarmacias, getRegiones, getComunas } from '@/lib/minsal'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const region = searchParams.get('region')
  const comuna = searchParams.get('comuna')
  const tipo = searchParams.get('tipo') // 'regiones' | 'comunas' | 'farmacias'

  try {
    const farmacias = await fetchFarmacias()

    if (tipo === 'regiones') {
      const regiones = getRegiones(farmacias)
      return NextResponse.json(regiones)
    }

    if (tipo === 'comunas' && region) {
      const comunas = getComunas(farmacias, region)
      return NextResponse.json(comunas)
    }

    if (!region) {
      return NextResponse.json({ error: 'Se requiere el parámetro region' }, { status: 400 })
    }

    const resultado = filtrarFarmacias(farmacias, region, comuna ?? undefined)
    return NextResponse.json(resultado)
  } catch (error) {
    console.error('Error al obtener farmacias:', error)
    return NextResponse.json({ error: 'Error al conectar con el servicio de MINSAL' }, { status: 500 })
  }
}
