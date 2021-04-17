import React, { useRef, useCallback } from 'react'
import classNames from 'classnames'

import useDetectOutsideClick from '../../hooks/useDetectOutsideClick'

import styles from './DropDownMenu.module.css'

interface Props {
  buttonSlot: ({
    onClick,
    className
  }: {
    onClick: () => void
    className: string
  }) => React.ReactElement

  listSlot: () => React.ReactElement
}

const DropDownMenu: React.FC<Props> = ({
  buttonSlot: ButtonSlot,
  listSlot: ListSlot
}) => {
  const dropdownRef = useRef(null)
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false)
  const onClick = useCallback(() => setIsActive(!isActive), [isActive])

  return (
    <div className={styles.menuContainer}>
      <ButtonSlot onClick={onClick} className={styles.menuTrigger} />
      <nav
        ref={dropdownRef}
        className={classNames({
          [styles.menu]: true,
          [styles.active]: isActive
        })}
      >
        <ul>
          <ListSlot />
        </ul>
      </nav>
    </div>
  )
}

export default DropDownMenu
