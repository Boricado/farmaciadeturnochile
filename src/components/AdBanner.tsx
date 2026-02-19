'use client'

import { useEffect } from 'react'

interface AdBannerProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  className?: string
}

export default function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  useEffect(() => {
    try {
      const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle
      if (adsbygoogle) {
        adsbygoogle.push({})
      }
    } catch {
      // AdSense no disponible
    }
  }, [])

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5677105863319473"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
