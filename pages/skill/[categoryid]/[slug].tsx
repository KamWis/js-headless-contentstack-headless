import { useCallback } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { getSession } from 'next-auth/client'

import { wrapper } from '../../../store'

import Section from '../../../components/Section'
import VotesCounter from '../../../components/VotesCounter'
import ProductList from '../../../components/ProductList'
import PostMeta from '../../../components/PostMeta'
import CommentsModule from '../../../components/CommentsModule'
import Layout from '../../../components/Layout'
import { getItem, getList, getNestedComments } from '../../../libs/postHelpers'
import { getPost, getPosts } from '../../../libs/apis'
import useStateWithDeepCompare from '../../../hooks/useStateWithDeepCompare'
import useVoteCounter from '../../../hooks/useVoteCounter'
import BackIcon from '../../../components/SVGIcons/BackIcon'

import styles from '../../../styles/Skill.module.css'

interface Props {
  post: Post
  relatedPosts: Post[]
}

const Post: React.FC<Props> = ({ post, relatedPosts }) => {
  const [commentsCount, setCommentsCount] = useStateWithDeepCompare(
    post.commentsCount
  )
  const comments = getNestedComments(post.comments ? post.comments : [])
  const { onVoteUp, onVoteDown, vote, voteCount } = useVoteCounter(
    post.id,
    post.vote,
    post.voteCount
  )

  const increaseCommentsCount = useCallback(() => {
    setCommentsCount(commentsCount + 1)
  }, [commentsCount])

  return (
    <Layout title={`Futuretrap portal - ${post.title}`}>
      <Section>
        <Link href="/">
          <span className={styles.backLink}>
            <BackIcon /> Back to list
          </span>
        </Link>
      </Section>
      <Section className={styles.flexColumns}>
        <div
          className={classNames([
            'column66',
            'paddedRight',
            styles.flexColumns
          ])}
        >
          <div className={styles.voteCounterContainer}>
            <VotesCounter
              votesCount={voteCount}
              className={styles.votesCounter}
              onVoteUp={onVoteUp}
              onVoteDown={onVoteDown}
              vote={vote}
            />
          </div>
          <div className={styles.postContent}>
            <div className={classNames(styles.category)}>{post.category}</div>
            <h2 className="strong">{post.title}</h2>
            <p className={styles.description}>{post.description}</p>
            <div className={styles.meta}>
              Posted{' '}
              <PostMeta
                createdAt={post.startsAt}
                author={post.author}
                commentsCount={commentsCount}
                boldAuthor
              />
            </div>
            <CommentsModule
              items={comments}
              postId={post.id}
              updateCommentsCount={increaseCommentsCount}
            />
          </div>
        </div>
        <div className="column34">
          <h3>Related {post.category} Skills</h3>
          {relatedPosts.length ? (
            <ProductList list={relatedPosts} isCompact />
          ) : (
            'No related posts found.'
          )}
        </div>
      </Section>
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const { slug, categoryid } = context.query

    try {
      const session = await getSession(context)
      const [
        { data, responseStatus },
        { data: relatedPosts, responseStatus: getCategoryResponseStatus }
      ] = await Promise.all([
        getPost(slug, session?.jwt),
        getPosts(
          {
            _limit: 6,
            _sort: 'created_at:DESC',
            _where: [
              {
                'categories.id': categoryid
              },
              {
                expiresAt_gt: new Date()
              }
            ]
          },
          session?.jwt
        )
      ])

      if (responseStatus === 'error') {
        return {
          notFound: true
        }
      }

      const post = getItem(data)

      if (getCategoryResponseStatus === 'error') {
        return { props: { post, relatedPosts: [], session } }
      }

      const relatedPostsFiltered = getList(relatedPosts).filter(
        (item) => item.id !== post.id
      )

      return { props: { post, relatedPosts: relatedPostsFiltered, session } }
    } catch (error) {
      console.log(error.message)
      return {
        notFound: true
      }
    }
  }
)

export default Post
