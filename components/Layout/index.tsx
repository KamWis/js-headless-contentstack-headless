import Head from 'next/head'
import GoogleFonts from 'next-google-fonts'

import Header from '../Header'
import Footer from '../Footer'

interface Props {
  title: string
}

const Layout: React.FC<Props> = ({ children, title }) => {
  return (
    <div className="mainContainer">
      <>
        <GoogleFonts href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap" />
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>{title}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </>
      <main className="container">
        <Header />
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
