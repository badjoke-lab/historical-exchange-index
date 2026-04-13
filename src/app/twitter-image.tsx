export const dynamic = 'force-static'

import { ImageResponse } from 'next/og'
import { SITE_NAME, SITE_DESCRIPTION } from '../lib/site-constants'

export const alt = 'Historical Exchange Index'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0b0f14',
          color: '#f3f5f7',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            padding: '56px',
            border: '1px solid #202a34',
            background: 'linear-gradient(180deg, #0b0f14 0%, #10161d 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '170px',
              height: '170px',
              borderRadius: '26px',
              background: '#111821',
              border: '2px solid #2a3644',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px',
              fontWeight: 800,
              letterSpacing: '-0.05em',
              flexShrink: 0,
            }}
          >
            HEI
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '40px',
              justifyContent: 'center',
              gap: '18px',
            }}
          >
            <div
              style={{
                fontSize: '22px',
                color: '#8ea0b5',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              Quiet registry · Archive-first · History-first
            </div>

            <div
              style={{
                fontSize: '66px',
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: '-0.05em',
                maxWidth: '820px',
              }}
            >
              {SITE_NAME}
            </div>

            <div
              style={{
                fontSize: '28px',
                color: '#b7c2cf',
                lineHeight: 1.35,
                maxWidth: '860px',
              }}
            >
              {SITE_DESCRIPTION}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
