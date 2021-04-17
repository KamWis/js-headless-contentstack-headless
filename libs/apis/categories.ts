import { get, ApiResponse, API_URL } from '../apiHelper'

export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  return await get(`${API_URL}/categories`)
}

export const getCategory = async (
  categoryId: number | string | string[],
  token?: string
): Promise<ApiResponse<Category>> => {
  return await get(`${API_URL}/categories/${categoryId}`, token)
}
