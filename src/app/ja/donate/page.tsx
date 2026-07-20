import Link from 'next/link'
import type { Metadata } from 'next'
import DonateWalletsClient from '../../../components/donate/donate-wallets-client'
import { CONTACT_HREF, SITE_NAME, SITE_URL } from '../../../lib/site-constants'

const title = 'HEIを支援する'
const description = 'Historical Exchange Indexのレコード追加、アーカイブ確認、evidence検証、公開サイト保守を任意の寄付で支援できます。'

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/ja/donate/',
    languages: {
      en: '/donate/',
      ja: '/ja/donate/',
    },
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/ja/donate/`,
    title: `${title} | ${SITE_NAME}`,
    description,
    siteName: SITE_NAME,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} | ${SITE_NAME}`,
    description,
    images: ['/twitter-image'],
  },
}

export default function JapaneseDonatePage() {
  return (
    <main className="longform">
      <section className="panel longform-panel">
        <p className="muted">寄付</p>
        <h1 style={{ marginTop: 0, fontSize: '34px' }}>{title}</h1>
        <p className="muted" style={{ lineHeight: 1.75, maxWidth: '80ch' }}>
          HEIは、暗号資産取引所の歴史をentity・event・evidenceとして整理し、公開する独立したレジストリです。
          寄付は任意であり、レコード追加、アーカイブ確認、情報の再検証、公開サイトの維持に使用されます。
        </p>
        <div className="hero-actions">
          <Link className="btn" href="/donate/" hrefLang="en">English</Link>
          <a className="btn" href={CONTACT_HREF} target="_blank" rel="noreferrer">問い合わせ・訂正</a>
        </div>
      </section>

      <section className="panel longform-panel">
        <div className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
          <h2>寄付で支援される作業</h2>
          <div className="fact-grid">
            <div className="fact"><div className="k">レコード拡充</div><div className="v">稼働側・終了側のentity、event、evidenceを追加します。</div></div>
            <div className="fact"><div className="k">アーカイブ確認</div><div className="v">過去サイトの保存URLを確認し、安全な歴史導線を増やします。</div></div>
            <div className="fact"><div className="k">検証</div><div className="v">日付、終了理由、status、出典の不確実な箇所を再確認します。</div></div>
            <div className="fact"><div className="k">保守</div><div className="v">公開レジストリ、機械可読データ、監査workflowを維持します。</div></div>
          </div>
        </div>

        <div className="section">
          <h2>ウォレットアドレス</h2>
          <p className="muted" style={{ marginTop: 0, lineHeight: 1.75 }}>
            表示された資産を、表示されたネットワークでのみ送付してください。送付前にネットワークとアドレスを必ず確認してください。
            下のカードでは各アドレスをコピーできます。
          </p>
          <DonateWalletsClient />
        </div>

        <div className="section">
          <h2>重要事項</h2>
          <div className="fact-grid">
            <div className="fact"><div className="k">編集上の独立性</div><div className="v">寄付の有無や金額は、掲載、status、evidence基準、編集判断に影響しません。</div></div>
            <div className="fact"><div className="k">ネットワーク</div><div className="v">誤ったネットワークへの送付は資産を失う可能性があります。</div></div>
            <div className="fact"><div className="k">XRP</div><div className="v">このページにはDestination Tagを記載していません。Tagなし送付に対応するサービスか確認してください。</div></div>
            <div className="fact"><div className="k">最終確認</div><div className="v">取引を確定する前に、コピーしたアドレスを自身の端末上で再確認してください。</div></div>
          </div>
        </div>
      </section>

      <section className="callout">
        支援は任意です。HEIは寄付の有無にかかわらず、公開レジストリとして利用できる状態を維持する方針です。
      </section>
    </main>
  )
}
