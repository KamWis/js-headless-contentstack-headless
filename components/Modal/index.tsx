import classNames from 'classnames'
import { useState, useCallback, useEffect } from 'react'

import PortalWrapper from '../PortalWrapper'
import CloseIcon from '../SVGIcons/Close'

import styles from './Modal.module.css'

interface Props {
  children: React.ReactNode
  onClose: (event: React.MouseEvent<HTMLElement>) => void
  isActive: boolean
  closeOnBackdropClick?: boolean
}

const Modal: React.FC<Props> = ({
  children,
  onClose,
  isActive,
  closeOnBackdropClick
}) => {
  const [shouldMount, setShouldMount] = useState(false)

  useEffect(() => {
    if (!isActive) {
      return
    }

    setShouldMount(true)
  }, [isActive])
  const onTransitionEnd = useCallback(
    (e) => {
      if (e.propertyName !== 'visibility') {
        return
      }

      if (isActive) {
        return
      }

      setShouldMount(!shouldMount)
    },
    [isActive]
  )

  return (
    <PortalWrapper>
      <>
        <div
          className={classNames({
            [styles.backdrop]: true,
            [styles.active]: isActive
          })}
          onTransitionEnd={onTransitionEnd}
          onClick={closeOnBackdropClick && onClose}
        ></div>
        <div
          className={classNames({
            [styles.container]: true,
            [styles.active]: isActive
          })}
        >
          <CloseIcon onClose={onClose} />
          {shouldMount && children}
        </div>
      </>
    </PortalWrapper>
  )
}

export default Modal
