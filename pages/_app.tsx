import React, { useEffect } from 'react'
import type { AppProps } from 'next/app'
import NProgress from 'nprogress'
import Router from 'next/router'
import Cookies from 'js-cookie'
import { Provider } from 'next-auth/client'

import { wrapper } from '../store'
import { setCategories } from '../actions'
import { getCategories } from '../libs/apis'
import dayjs from '../libs/dayjs'

import 'react-datepicker/dist/react-datepicker.css'
import 'nprogress/nprogress.css'
import '../styles/globals.css'

NProgress.configure({
  showSpinner: true
})

interface Props extends AppProps {
  errorMessage?: string
}

const App = ({ Component, pageProps, errorMessage }: Props) => {
  useEffect(() => {
    Router.events.on('routeChangeStart', () => NProgress.start())
    Router.events.on('routeChangeComplete', () => NProgress.done())
    Router.events.on('routeChangeError', () => NProgress.done())

    window.onload = () => {
      Cookies.set('categoriesAlreadyFetched', 'true', {
        expires: new Date(dayjs().add(1, 'hour').toISOString())
      })
    }

    window.onbeforeunload = () => {
      Cookies.remove('categoriesAlreadyFetched')
    }

    window.onunload = () => {
      Cookies.remove('categoriesAlreadyFetched')
    }
  }, [])

  return (
    <>
      {errorMessage && (
        <span className="error globalError">{errorMessage}</span>
      )}
      <Provider session={pageProps?.session}>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

App.getInitialProps = async ({ ctx }) => {
  const categoriesAlreadyFetched = ctx.req?.cookies?.categoriesAlreadyFetched

  if (categoriesAlreadyFetched === 'true') {
    return {}
  }

  const { data, responseStatus, message } = await getCategories()

  if (responseStatus === 'error') {
    return {
      errorMessage: `Categories fetch error: ${message}`
    }
  }

  ctx.store.dispatch(setCategories(data))

  return {}
}

export default wrapper.withRedux(App)
