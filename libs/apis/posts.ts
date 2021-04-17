import qs from 'qs'

import { post, get, put, ApiResponse, API_URL } from '../apiHelper'

export const postCreatePost = async (
  token: string,
  author: string,
  authorId: string,
  title: string,
  description: string,
  category: number,
  expiresAt: number,
  startsAt: number,
  link: string
): Promise<ApiResponse<Post>> => {
  return await post(
    `${API_URL}/posts`,
    {
      title,
      description,
      categories: [category],
      expiresAt: new Date(expiresAt),
      startsAt: new Date(startsAt),
      author,
      authorId,
      voteCount: 0,
      link
    },
    token
  )
}

export const getPost = async (
  postId: number | string | string[],
  token?: string
): Promise<ApiResponse<Post>> => {
  return await get(`${API_URL}/posts/${postId}`, token)
}

export const getPosts = async (
  queryObject: GenericObject,
  token?: string
): Promise<ApiResponse<Post[]>> => {
  const query = qs.stringify(queryObject)
  return await get(`${API_URL}/posts?${query}`, token)
}

export const getPostCount = async (
  queryObject: GenericObject,
  token?: string
): Promise<ApiResponse<number>> => {
  const query = qs.stringify(queryObject)
  return await get<number>(`${API_URL}/posts/count?${query}`, token)
}

export const getPostVotes = async (
  postIds: number[],
  token?: string
): Promise<ApiResponse<Vote[]>> => {
  return await get(`${API_URL}/profiles/votes/[${postIds}]`, token)
}

export const putPostVote = async (
  postId: number | string | string[],
  body: GenericObject,
  token: string
): Promise<ApiResponse<Post>> => {
  return await put(`${API_URL}/posts/vote/${postId}`, body, token)
}
