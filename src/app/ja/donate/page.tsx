import Link from 'next/link'
import type { Metadata } from 'next'
import DonateWalletsClient from '../../../components/donate/donate-wallets-client'
import { CONTACT_HREF, SITE_NAME, SITE_URL } from '../../../lib/site-constants'

const title = 'HEIを支援する'
const description = 'Historical Exchange Indexのレコード検証、アーカイブ確認、訂正対応、公開データ、長期保守を任意の支援で維持できます。'

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
        <p className="muted">支援</p>
        <h1 style={{ marginTop: 0, fontSize: '34px' }}>{title}</h1>
        <p className="muted" style={{ lineHeight: 1.75, maxWidth: '80ch' }}>
          HEIは、暗号資産取引所の歴史をentity・event・evidenceとして整理する独立した公開レジストリです。
          任意の支援は、レコード追加、アーカイブ確認、出典検証、訂正対応、機械可読データ、長期保守に使用されます。
        </p>
        <div className="hero-actions">
          <Link className="btn" href="/donate/" hrefLang="en">English</Link>
          <a className="btn" href={CONTACT_HREF} target="_blank" rel="noreferrer">問い合わせ・訂正</a>
        </div>
      </section>

      <section className="panel longform-panel">
        <div className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
          <h2>支援対象</h2>
          <div className="fact-grid">
            <div className="fact"><div className="k">レコード拡充</div><div className="v">稼働側・終了側のentity、event、evidenceを追加します。</div></div>
            <div className="fact"><div className="k">アーカイブ確認</div><div className="v">過去サイトの保存URLを確認し、安全な歴史導線を増やします。</div></div>
            <div className="fact"><div className="k">検証と訂正</div><div className="v">日付、終了理由、status、出典、送付された訂正を再確認します。</div></div>
            <div className="fact"><div className="k">公開保守</div><div className="v">公開サイト、機械可読データ、監視、画面監査workflowを維持します。</div></div>
          </div>
        </div>

        <div className="section">
          <h2>支援方法</h2>
          <p className="muted" style={{ marginTop: 0, lineHeight: 1.75 }}>
            表示された資産を、表示されたネットワークでのみ送付してください。送付前に資産、チェーン、アドレスを確認してください。
            主な送付方法を先に表示し、その他のネットワークは必要な場合だけ開けます。
          </p>
          <DonateWalletsClient locale="ja" />
        </div>

        <div className="section">
          <h2>編集上の独立性</h2>
          <div className="fact-grid">
            <div className="fact"><div className="k">支援で買えないもの</div><div className="v">掲載、削除、status変更、ランキング、有利な説明は保証されません。</div></div>
            <div className="fact"><div className="k">Evidence基準</div><div className="v">支援者にかかわらず、証拠とレビューの基準は同じです。</div></div>
            <div className="fact"><div className="k">訂正窓口</div><div className="v">支援の有無にかかわらず、送付された訂正を確認します。</div></div>
            <div className="fact"><div className="k">送付前確認</div><div className="v">取引を確定する前に、コピーしたアドレスとネットワークを自身の端末で再確認してください。</div></div>
          </div>
        </div>
      </section>

      <section className="callout">
        支援は任意です。掲載、分類、evidence基準、訂正、編集判断には影響しません。HEIは支援の有無にかかわらず公開レジストリとして利用できます。
      </section>
    </main>
  )
}
