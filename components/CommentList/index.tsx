import React from 'react'

import Comment from '../Comment'

interface Props {
  items: CommentMessage[]
  postId: number
  updateCommentsCount: () => void
}

const CommentList: React.FC<Props> = ({
  items,
  postId,
  updateCommentsCount
}) => {
  return (
    <>
      {items.map((item) => (
        <Comment
          key={`commentid-${item.id}`}
          postId={postId}
          updateCommentsCount={updateCommentsCount}
          {...item}
        />
      ))}
    </>
  )
}

export default CommentList
