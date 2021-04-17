import { post, ApiResponse, API_URL } from '../apiHelper'

interface CommentMessageChunk {
  content: string
  authorAvatar: string | null
}

export const postComment = async (
  commentData: CommentMessageChunk,
  postId: number,
  threadOf: number | null,
  idToken: string,
  userAttributes: UserStrapiAttributes
): Promise<ApiResponse<CommentMessageResponse>> => {
  return await post<CommentMessageResponse>(
    `${API_URL}/comments/post:${postId}`,
    {
      authorId: userAttributes.id,
      authorName: userAttributes.name,
      authorEmail: userAttributes.email,
      content: commentData.content,
      related: [
        {
          refId: postId,
          ref: 'post',
          field: 'comments'
        }
      ],
      voteCount: 0,
      authorAvatar: commentData.authorAvatar,
      threadOf: threadOf,
      blockedThread: false,
      blockReason: '',
      blocked: false,
      authorType: 'external'
    },
    idToken
  )
}
