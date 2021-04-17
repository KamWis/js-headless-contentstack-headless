import React, { useCallback } from 'react'
import { useSession } from 'next-auth/client'

import SignInToInfoBox from '../SignInToInfoBox'
import CommentTextArea from '../CommentTextArea'
import useCreateComment from '../../hooks/useCreateComment'
import CommentList from '../CommentList'

interface Props {
  items: CommentMessage[]
  postId: number
  updateCommentsCount: () => void
}

const CommentsModule: React.FC<Props> = ({
  items,
  postId,
  updateCommentsCount
}) => {
  const [session] = useSession()

  const isAuthorized = !!session?.jwt
  const firstName = session?.user?.name

  const {
    replyValue,
    onReplyChange,
    commentList,
    isSubmitting,
    submitError,
    submitComment
  } = useCreateComment(items, postId, null, 0)

  const handleSubmitComment = useCallback(
    async (event: React.MouseEvent<HTMLElement>) => {
      const responseStatus = await submitComment(event)

      if (responseStatus === 'success') {
        updateCommentsCount()
      }
    },
    [replyValue, commentList]
  )

  return (
    <>
      {!isAuthorized && <SignInToInfoBox text="leave your comment." />}
      {isAuthorized && (
        <CommentTextArea
          value={replyValue}
          id={null}
          onChange={onReplyChange}
          submitError={submitError}
          submitComment={handleSubmitComment}
          isSubmitting={isSubmitting}
          placeholder={`What's on your mind, ${firstName}? (Min 80 characters)`}
        />
      )}
      <CommentList
        items={commentList}
        postId={postId}
        updateCommentsCount={updateCommentsCount}
      />
    </>
  )
}

export default CommentsModule
