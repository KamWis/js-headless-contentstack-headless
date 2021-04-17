import { useEffect, useState, useRef } from 'react'
import { isEqual } from 'lodash'
import { useSession } from 'next-auth/client'

import { getPostVotes } from '../libs/apis'
import useStateWithDeepCompare from './useStateWithDeepCompare'

const useFetchVotesByPostIds = (list: Post[]): Post[] => {
  const [session] = useSession()
  const [hasBeenFetched, setHasBeenFetched] = useState(false)
  const [postList, setPostList] = useStateWithDeepCompare(list)

  const listRef = useRef(postList)

  useEffect(() => {
    if (!isEqual(listRef.current, postList)) {
      setHasBeenFetched(false)
    }

    listRef.current = postList
  }, [isEqual(listRef.current, postList)])

  useEffect(() => {
    const fetchVotes = async () => {
      if (session?.jwt || hasBeenFetched) {
        return
      }

      const postIds = list.map((item) => item.id)

      const votes = await getPostVotes(postIds, session?.jwt)

      if (votes.responseStatus === 'error') {
        return
      }

      const postsWithVotes = list.map((post) => {
        const vote = votes.data.find((vote) => vote.postId === post.id)

        if (!vote) {
          return {
            ...post,
            vote: 'no-vote' as VoteType
          }
        }

        return {
          ...post,
          vote: vote.vote
        }
      })

      setPostList(postsWithVotes)
      setHasBeenFetched(true)
    }

    fetchVotes()
  }, [session?.jwt, hasBeenFetched])

  return postList
}

export default useFetchVotesByPostIds
