import { useState, useCallback } from 'react'
import classNames from 'classnames'
import Link from 'next/link'

import CloseIcon from '../SVGIcons/Close'

import styles from './Drawer.module.css'

interface Props {
  isExpanded: boolean
  onClose: (event: React.MouseEvent<HTMLElement>) => void
  items: NavigationLinkWithNesting[]
}

const Drawer: React.FC<Props> = ({ isExpanded, onClose, items }) => {
  const [isTransitionFinished, setIsTransitionFinished] = useState(true)
  const handleOnTransitionEnd = useCallback((e) => {
    if (e.propertyName !== 'visibility') {
      return
    }

    setIsTransitionFinished(true)
  }, [])

  const handleOnClick = useCallback(
    (e) => {
      if (!isTransitionFinished) {
        return
      }

      onClose(e)
      setIsTransitionFinished(false)
    },
    [onClose, isTransitionFinished]
  )

  return (
    <>
      <div
        className={classNames({
          [styles.backdrop]: true,
          [styles.hidden]: !isExpanded
        })}
        onTransitionEnd={handleOnTransitionEnd}
        onClick={handleOnClick}
      ></div>
      <div
        className={classNames({
          [styles.container]: true,
          [styles.hidden]: !isExpanded
        })}
      >
        <CloseIcon onClose={handleOnClick} className={styles.closeIcon} />
        <h1 className={styles.title}>Categories</h1>
        <ul className={styles.menuList} onClick={onClose}>
          <li className={styles.menuItem}>
            <Link href="/">View all categories</Link>
          </li>
          {items.map((item: NavigationLinkWithNesting) => {
            return (
              <li className={styles.menuItem} key={item.id}>
                <Link href={item.url || `/${item.slug}`}>{item.text}</Link>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
export default Drawer
