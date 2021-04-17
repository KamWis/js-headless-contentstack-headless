import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  providers: [
    Providers.Auth0({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN
    })
  ],
  session: {
    jwt: true
  },
  debug: false,
  callbacks: {
    session: async (session, user) => {
      session.jwt = user.jwt
      session.id = user.id
      session.user.name = user.name

      return Promise.resolve(session)
    },
    jwt: async (token, user, account, profile) => {
      const isSignIn = user ? true : false
      if (isSignIn) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/${account.provider}/callback?access_token=${account?.accessToken}`
        )
        const data = await response.json()

        token.jwt = data.jwt
        token.id = data.user?.id
        token.name =
          profile[`${process.env.AUTH0_NAMESPACE}username`] || profile.name
      }
      return Promise.resolve(token)
    }
  }
}

const Auth = (req: NextApiRequest, res: NextApiResponse): Promise<void> =>
  NextAuth(req, res, options)

export default Auth
