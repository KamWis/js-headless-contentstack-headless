import classNames from 'classnames'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut, useSession, signIn } from 'next-auth/client'

import Button from '../Button'
import Drawer from '../Drawer'
import DropDownMenu from '../DropDownMenu'
import ArrowDownOutline from '../SVGIcons/ArrowDownOutline'
import Hamburger from '../SVGIcons/Hamburger'
import AmplifyingGlass from '../SVGIcons/AmplifyingGlass'
import Logo from '../SVGIcons/Logo'

import styles from './Header.module.css'

const useHeaderHeight = (headerRef: React.RefObject<HTMLElement>) => {
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    setHeaderHeight(headerRef.current.offsetHeight)
  }, [])

  return { headerHeight }
}

const useDrawer = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const handleHamburgerClick = useCallback(() => {
    setIsExpanded(!isExpanded)
  }, [isExpanded])

  return { hamburgerCallback: handleHamburgerClick, isExpanded }
}

const Header: React.FC = () => {
  const headerRef = useRef(null)
  const { headerHeight } = useHeaderHeight(headerRef)
  const { hamburgerCallback, isExpanded } = useDrawer()
  const [session, isLoadingSession] = useSession()
  const isAuthorized = !!session?.jwt

  const drawerItems = useSelector(
    (state: InitialState) => state.categories.drawerItems,
    shallowEqual
  )

  const router = useRouter()

  const onSignOut = useCallback(async () => {
    try {
      await signOut({
        callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/logout`
      })
    } catch (error) {
      console.log('signOut error: ', error.message)
    }
  }, [])

  const onSubmitSkill = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()

      if (isAuthorized) {
        router.push('/submit-post')

        return
      }

      signIn('auth0')
    },
    [isAuthorized]
  )

  const onGoogleSignIn = useCallback((event) => {
    event.preventDefault()
    signIn('auth0')
  }, [])

  return (
    <>
      <div className={styles.holder} style={{ minHeight: headerHeight }}></div>
      <div
        ref={headerRef}
        className={classNames({
          [styles.header]: true,
          [styles.sticky]: true,
          container: true
        })}
      >
        <div>
          <Hamburger className={styles.hamburger} onClick={hamburgerCallback} />
          <Link href="/">
            <span>
              <Logo className={styles.logo} />
            </span>
          </Link>
        </div>
        <div>
          <Link href="/">
            <span className={styles.searchIcon}>
              <AmplifyingGlass />
            </span>
          </Link>
          <Button
            className={styles.button}
            onClick={onSubmitSkill}
            disabled={isLoadingSession}
          >
            Submit skill
          </Button>
          {isAuthorized ? (
            <>
              <DropDownMenu
                buttonSlot={({ onClick }) => {
                  return (
                    <button
                      role="button"
                      type="button"
                      onClick={onClick}
                      className={styles.avatarButton}
                    >
                      <svg role="img" className={styles.avatar}>
                        <image
                          xlinkHref={
                            session?.user?.image || '/dummy-avatar.jpg'
                          }
                        />
                      </svg>
                      <ArrowDownOutline />
                    </button>
                  )
                }}
                listSlot={() => {
                  return (
                    <>
                      <li className={styles.dropDownUserName}>
                        Hi, {session?.user?.name}!
                      </li>
                      <li className={styles.submitSkillItem}>
                        <a href="#" onClick={onSubmitSkill}>
                          Submit Skill
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={onSignOut}>
                          Sign Out
                        </a>
                      </li>
                    </>
                  )
                }}
              />
            </>
          ) : (
            <>
              <Button
                className={styles.button}
                outline
                onClick={onGoogleSignIn}
              >
                Sign in / Sign up
              </Button>
            </>
          )}
        </div>
      </div>
      <Drawer
        isExpanded={isExpanded}
        onClose={hamburgerCallback}
        items={drawerItems}
      />
    </>
  )
}
export default Header
