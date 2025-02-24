import styles from './CardDescriptions.module.css'

interface CardDescriptionProps {
    alt: string
    photographer: string
}

export function CardDescription({ alt, photographer }: CardDescriptionProps) {
    return (
        <div className={styles.description}>
        {alt && <p className={styles.caption}>{alt}</p>}
        {alt && photographer && <hr />}
        {photographer && <p className={styles.photographer}>{photographer}</p>}
      </div>
    )
}