import { getSession } from 'next-auth/client'
import { GetServerSidePropsContext } from 'next-redux-wrapper'

export const getToken = async (
  context: GetServerSidePropsContext
): Promise<string | undefined> => {
  try {
    const session = await getSession({ req: context.req })

    return session.jwt
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('authorization token failure: ', error)
    }

    return undefined
  }
}
