import React from 'react'
import classNames from 'classnames'

import styles from './PageTitle.module.css'

interface Props {
  title: string
  description?: string
  className?: string
}

const PageTitle: React.FC<Props> = ({ title, description, className }) => (
  <div className={classNames([styles.container, className])}>
    <div className={styles.title}>{title}</div>
    {description ? (
      <div className={styles.description}>{description}</div>
    ) : null}
  </div>
)

export default PageTitle
