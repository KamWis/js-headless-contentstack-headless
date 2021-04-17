import React from 'react'
import classNames from 'classnames'

import styles from './Section.module.css'

interface Props {
  className?: string
}

const Section: React.FC<Props> = ({ children, className }) => (
  <div className={classNames([styles.section, className])}>{children}</div>
)

export default Section
