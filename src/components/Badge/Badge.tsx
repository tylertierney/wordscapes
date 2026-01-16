import styles from './Badge.module.scss'
import type { PropsWithChildren, CSSProperties } from 'react'

export type BadgeType = 'success' | 'warning' | 'danger' | 'info'

interface Props {
  type?: BadgeType
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  style?: CSSProperties
}

export default function Badge({
  type = 'info',
  size = 'md',
  style = {},
  children,
}: PropsWithChildren<Props>) {
  return (
    <span
      className={`${styles.badge} ${styles[type]} ${styles[size]}`}
      style={style}
    >
      {children}
    </span>
  )
}
