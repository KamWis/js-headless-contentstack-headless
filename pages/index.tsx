import { getSession } from 'next-auth/client'

import ProductListPage from '../components/ProductListPage'
import { getList } from '../libs/postHelpers'
import { getPosts, getPostCount } from '../libs/apis'

import { wrapper } from '../store'

interface Props {
  list: Post[]
  errorMessage?: string
  slug: string
  postCount: number
}

const Home: React.FC<Props> = (props) => <ProductListPage {...props} />

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    try {
      const session = await getSession(context)

      const [{ data, responseStatus }, { data: postCount }] = await Promise.all(
        [
          getPosts(
            {
              _limit: 6,
              _sort: 'created_at:DESC',
              _where: { expiresAt_gt: new Date() }
            },
            session?.jwt
          ),
          getPostCount({
            _sort: 'created_at:DESC',
            _where: { expiresAt_gt: new Date() }
          })
        ]
      )

      if (responseStatus === 'error') {
        return {
          props: {
            list: [],
            errorMessage:
              'Page encountered an error while fetching posts. Refresh the page to try again.'
          }
        }
      }

      return {
        props: {
          list: getList(data),
          session,
          postCount
        }
      }
    } catch (error) {
      return {
        props: {
          list: [],
          session: null,
          errorMessage: error.message
        }
      }
    }
  }
)

export default Home
