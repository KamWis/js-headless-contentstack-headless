import React from 'react'

import styles from './Checkbox.module.css'

interface Props {
  onChange: (event: React.SyntheticEvent<HTMLInputElement>) => void
  checked: boolean
}

const Checkbox: React.FC<Props> = ({ onChange, checked, children }) => {
  return (
    <label className={styles.container}>
      {children}
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className={styles.checkmark}></span>
    </label>
  )
}

export default Checkbox
