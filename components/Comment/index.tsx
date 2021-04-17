import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSession } from 'next-auth/client'

import CommentList from '../CommentList'
import CommentTextArea from '../CommentTextArea'
import useClientSideToday from '../../hooks/useClientSideToday'
import useCreateComment from '../../hooks/useCreateComment'
import { toggleLoginModal } from '../../actions'
import dayjs from '../../libs/dayjs'

import styles from './Comment.module.css'

interface Props extends CommentMessage {
  postId: number
  updateCommentsCount: () => void
}

const Comment: React.FC<Props> = ({
  authorAvatar,
  authorName,
  content,
  id,
  createdAt,
  comments,
  level,
  threadOf,
  postId,
  updateCommentsCount
}) => {
  const [showReplyField, setShowReplyField] = useState(false)
  const today = useClientSideToday()
  const {
    replyValue,
    onReplyChange,
    commentList,
    isSubmitting,
    submitError,
    submitComment
  } = useCreateComment(comments, postId, id, level)
  const [session, isLoadingSession] = useSession()
  const isAuthorized = !!session?.jwt

  const dispatch = useDispatch()
  const hasReplies = !!commentList.length

  const handleReply = useCallback(
    (event) => {
      event.preventDefault()

      if (!isAuthorized) {
        dispatch(toggleLoginModal(true))

        return
      }

      setShowReplyField(!showReplyField)
    },
    [isAuthorized, showReplyField]
  )

  const handleSubmitComment = useCallback(
    async (event: React.MouseEvent<HTMLElement>) => {
      const responseStatus = await submitComment(event)

      if (responseStatus === 'success') {
        setShowReplyField(false)
        updateCommentsCount()
      }
    },
    [replyValue, commentList]
  )

  return (
    <div className={styles.container}>
      <div className={styles.avatarContainer}>
        <div className={styles.avatar}>
          <svg role="img">
            <image xlinkHref={authorAvatar || '/dummy-avatar.jpg'} />
          </svg>
        </div>
        {hasReplies || threadOf ? (
          <div className={styles.levelBorder}></div>
        ) : null}
      </div>
      <div className={styles.contentContainer}>
        <div className="textM strong">{authorName}</div>
        <p className="textM">{content}</p>
        <div className={styles.actionRow}>
          {level < 3 && (
            <button
              className="textM strong textButton noPadding"
              onClick={handleReply}
            >
              Reply
            </button>
          )}
          <span>{dayjs(createdAt).from(today)}</span>
        </div>
        {isAuthorized && showReplyField && (
          <CommentTextArea
            value={replyValue}
            id={id}
            onChange={onReplyChange}
            submitError={submitError}
            submitComment={handleSubmitComment}
            isSubmitting={isSubmitting}
            placeholder={`What's your reply? (Min 80 characters)`}
            disabled={isLoadingSession}
          />
        )}
        {hasReplies && (
          <div className={styles.responses}>
            <CommentList
              items={commentList}
              postId={postId}
              updateCommentsCount={updateCommentsCount}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Comment
