import { useCallback } from 'react'
import { useSession, signIn } from 'next-auth/client'

import { putPostVote } from '../libs/apis'
import useStateWithDeepCompare from './useStateWithDeepCompare'

interface UseVoteCounterResult {
  onVoteUp: (event: React.MouseEvent<HTMLElement>) => void
  onVoteDown: (event: React.MouseEvent<HTMLElement>) => void
  vote: 'no-vote' | 'vote-up' | 'vote-down'
  voteCount: number
}

const useVoteCounter = (
  postId: number,
  voteProp: 'no-vote' | 'vote-up' | 'vote-down' = 'no-vote',
  voteCountProp: number
): UseVoteCounterResult => {
  const [vote, setVote] = useStateWithDeepCompare(voteProp, postId)
  const [voteCount, setVoteCount] = useStateWithDeepCompare(
    voteCountProp,
    postId
  )
  const [session, loading] = useSession()

  const token = loading ? undefined : session?.jwt

  const onVoteUp = useCallback(
    async (event) => {
      event.preventDefault()

      if (!token) {
        signIn('auth0')
        return
      }

      const { data, responseStatus } = await putPostVote(
        postId,
        {
          vote: 'vote-up'
        },
        token
      )

      if (responseStatus === 'error') {
        return responseStatus
      }

      setVote(data.vote)
      setVoteCount(data.voteCount)
    },
    [token, voteCount]
  )

  const onVoteDown = useCallback(
    async (event) => {
      event.preventDefault()

      if (!token) {
        signIn('auth0')
        return
      }

      const { data, responseStatus } = await putPostVote(
        postId,
        {
          vote: 'vote-down'
        },
        token
      )

      if (responseStatus === 'error') {
        return responseStatus
      }

      setVote(data.vote)
      setVoteCount(data.voteCount)
    },
    [token, voteCount]
  )

  return {
    onVoteUp,
    onVoteDown,
    vote,
    voteCount
  }
}

export default useVoteCounter
