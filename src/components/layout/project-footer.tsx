import Link from 'next/link'
import type { SupportedLocale } from '../../i18n/config'
import { buildLocalePath } from '../../lib/i18n/locale-routes'
import { CONTACT_HREF, ISSUES_HREF } from '../../lib/site-constants'
import { PROJECT_NETWORK } from '../../lib/project-network'
import styles from './project-footer.module.css'

type Props = {
  locale: SupportedLocale
  supportHref: string
}

function localHref(pathname: string, locale: SupportedLocale) {
  if (locale === 'en') return pathname
  return buildLocalePath(pathname, locale)
}

export default function ProjectFooter({ locale, supportHref }: Props) {
  const ja = locale === 'ja'
  const siteLinks = [
    { label: ja ? '終了済み取引所' : 'Dead exchanges', href: localHref('/dead', locale) },
    { label: ja ? '稼働側取引所' : 'Active exchanges', href: localHref('/active', locale) },
    { label: ja ? 'エクスプローラー' : 'Explorer', href: localHref('/explore', locale) },
    { label: ja ? '比較' : 'Compare', href: '/compare' },
    { label: ja ? 'インシデント' : 'Incidents', href: localHref('/incidents', locale) },
    { label: ja ? '月次アーカイブ' : 'Monthly archive', href: localHref('/monthly', locale) },
    { label: ja ? '統計' : 'Statistics', href: localHref('/stats', locale) },
  ]
  const projectLinks = [
    { label: ja ? '方法論' : 'Methodology', href: localHref('/methodology', locale) },
    { label: ja ? '概要' : 'About', href: localHref('/about', locale) },
    { label: ja ? '品質' : 'Quality', href: localHref('/quality', locale) },
    { label: ja ? '更新履歴' : 'Updates', href: localHref('/updates', locale) },
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.summary}>
        <strong>Historical Exchange Index</strong>
        <p>{ja ? '取引所の状態変化、終了、統合、根拠資料を記録する歴史台帳。' : 'A reviewed historical registry of crypto exchanges, active and gone.'}</p>
      </div>

      <section className={styles.group} aria-labelledby="hei-footer-network">
        <h2 id="hei-footer-network">{ja ? 'プロジェクトネットワーク' : 'Project network'}</h2>
        <div className={styles.links}>
          {PROJECT_NETWORK.map((project) => project.id === 'hei' ? (
            <span key={project.id} className={styles.current} aria-current="page">
              <span>{project.name}</span>
              <small>{ja ? '現在のプロジェクト' : 'Current project'}</small>
            </span>
          ) : (
            <a key={project.id} href={project.url} className={styles.networkLink}>
              <span>{project.name}</span>
              <small>{project.description}</small>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.group} aria-labelledby="hei-footer-explore">
        <h2 id="hei-footer-explore">{ja ? 'HEIを探索' : 'Explore HEI'}</h2>
        <nav className={styles.links} aria-label={ja ? 'HEI探索リンク' : 'HEI exploration links'}>
          {siteLinks.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
      </section>

      <section className={styles.group} aria-labelledby="hei-footer-project">
        <h2 id="hei-footer-project">{ja ? 'プロジェクト' : 'Project'}</h2>
        <nav className={styles.links} aria-label={ja ? 'プロジェクト情報' : 'Project information'}>
          {projectLinks.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          <a href={CONTACT_HREF} target="_blank" rel="noreferrer">{ja ? '連絡・訂正' : 'Contact / Corrections'}</a>
          <a href={ISSUES_HREF} target="_blank" rel="noreferrer">GitHub Issues</a>
        </nav>
      </section>

      <section className={`${styles.group} ${styles.supportGroup}`} aria-labelledby="hei-footer-support">
        <h2 id="hei-footer-support">{ja ? '支援と公開データ' : 'Support & public data'}</h2>
        <nav className={styles.links} aria-label={ja ? '支援と公開データ' : 'Support and public data'}>
          <Link className={styles.supportLink} href={supportHref}>{ja ? 'HEIを支援' : 'Support HEI'}</Link>
          <a href="/version.json">Version JSON</a>
          <a href="/data/manifest.json">Data manifest</a>
          <a href="/llms.txt">LLM guide</a>
          <a href="/ai.txt">AI guide</a>
        </nav>
      </section>
    </footer>
  )
}
