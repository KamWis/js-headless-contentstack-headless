import classnames from 'classnames'
import { ReactChild, FC } from 'react'

import styles from './Button.module.css'

interface Props {
  children: ReactChild
  outline?: boolean
  noBorder?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  big?: boolean
  fullWidth?: boolean
}

const Button: FC<Props> = ({
  children,
  outline,
  noBorder,
  onClick,
  className,
  type,
  big = false,
  fullWidth = false,
  disabled = false
}) => {
  const classes = classnames({
    [styles.button]: true,
    [styles.outline]: outline,
    [styles.solid]: !outline,
    [styles.noBorder]: noBorder,
    [styles.disabled]: disabled,
    [styles.big]: big,
    [styles.fullWidth]: fullWidth
  })

  return (
    <button
      type={type || 'button'}
      onClick={onClick}
      className={className ? `${classes} ${className}` : classes}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
