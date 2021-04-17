import { getSession } from 'next-auth/client'

import ProductListPage from '../../components/ProductListPage'
import { wrapper } from '../../store'
import { getList } from '../../libs/postHelpers'
import { getPosts, getPostCount } from '../../libs/apis'

interface Props {
  list: Post[]
  errorMessage?: string
  slug: string
  postCount: number
}

const Category: React.FC<Props> = (props) => <ProductListPage {...props} />

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const { slug } = context.query

    try {
      const session = await getSession(context)
      const [{ data, responseStatus }, { data: postCount }] = await Promise.all(
        [
          getPosts(
            {
              _limit: 6,
              _sort: 'created_at:DESC',
              _where: [
                {
                  'categories.id': slug
                },
                {
                  expiresAt_gt: new Date()
                }
              ]
            },
            session?.jwt
          ),
          getPostCount({
            _sort: 'created_at:DESC',
            _where: [
              {
                'categories.id': slug
              },
              {
                expiresAt_gt: new Date()
              }
            ]
          })
        ]
      )

      if (responseStatus === 'error') {
        return {
          props: {
            list: [],
            slug,
            errorMessage:
              'Page encountered an error while fetching posts. Refresh the page to try again.'
          }
        }
      }

      return {
        props: {
          list: getList(data),
          slug,
          session,
          postCount
        }
      }
    } catch (error) {
      console.log('fetching posts: ', error.message)

      return {
        props: {
          list: [],
          slug,
          session: null
        }
      }
    }
  }
)

export default Category
