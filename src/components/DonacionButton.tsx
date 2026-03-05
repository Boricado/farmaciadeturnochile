'use client'

import { useState } from 'react'

export default function DonacionButton() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 w-64">
          <p className="font-semibold text-gray-800 text-sm mb-1">¡Gracias por apoyarnos! 💚</p>
          <p className="text-xs text-gray-500 mb-3">
            Tu aporte nos permite mantener este sitio libre de publicidad y seguir haciendo aportes a la comunidad.
          </p>
          <a
            href="https://link.mercadopago.cl/farmaciadeturnochile"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-[#009ee3] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#0080c0] transition"
          >
            Donar con Mercado Pago
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="bg-green-600 text-white px-5 py-3 rounded-full font-semibold shadow-lg hover:bg-green-700 transition flex items-center gap-2 text-sm"
        aria-label="Apoyar el proyecto"
      >
        <span>💚</span>
        Apóyanos
      </button>
    </div>
  )
}
