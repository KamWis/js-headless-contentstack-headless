import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/client'

import { postComment } from '../libs/apis/comments'
import useStateWithDeepCompare from './useStateWithDeepCompare'

interface UseCreateCommentResult {
  replyValue: string
  onReplyChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  commentList: CommentMessage[]
  isSubmitting: boolean
  submitError: string
  submitComment: (event: React.MouseEvent<HTMLElement>) => Promise<string>
}

type UseCreateComment = (
  initialCommentList: CommentMessage[],
  postId: number,
  commentId: number,
  level: number
) => UseCreateCommentResult

const useCreateComment: UseCreateComment = (
  initialCommentList,
  postId,
  commentId,
  level
) => {
  const [replyValue, setReplyValue] = useState('')
  const [commentList, setCommentList] = useStateWithDeepCompare(
    initialCommentList
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [session] = useSession()

  const submitComment = useCallback(
    async (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()

      if (replyValue.length < 30) {
        return
      }

      setSubmitError('')

      setIsSubmitting(true)

      const { data, responseStatus, message } = await postComment(
        {
          content: replyValue,
          authorAvatar: session?.user?.image
        },
        postId,
        commentId,
        session?.jwt,
        {
          id: session?.id,
          name: session?.user?.name,
          email: session?.user?.email
        }
      )

      setIsSubmitting(false)

      if (responseStatus === 'success') {
        setCommentList([
          ...commentList,
          {
            ...data,
            comments: [],
            createdAt: data.created_at,
            level: level + 1
          }
        ])

        setReplyValue('')

        return responseStatus
      }

      if (responseStatus === 'error') {
        setSubmitError(message)
      }

      return responseStatus
    },
    [replyValue, commentList]
  )

  const onReplyChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setReplyValue(event.target.value)
    },
    [replyValue]
  )

  return {
    replyValue,
    onReplyChange,
    commentList,
    isSubmitting,
    submitError,
    submitComment
  }
}

export default useCreateComment
