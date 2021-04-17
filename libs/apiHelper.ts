import axios from 'axios'

export interface ApiResponse<T> {
  responseStatus: string
  message?: string
  data?: T
}

export const post = async <T extends GenericObject>(
  url: string,
  body: GenericObject,
  token: string
): Promise<ApiResponse<T>> => {
  try {
    const { data } = await axios.post(url, body, {
      headers: {
        authorization: `bearer ${token}`
      }
    })

    return { responseStatus: 'success', data }
  } catch (error) {
    console.log(error.message)
    return { responseStatus: 'error', message: error.message }
  }
}

export const get = async <T extends GenericObject | number>(
  url: string,
  token?: string
): Promise<ApiResponse<T>> => {
  try {
    const { data } = await axios.get(
      url,
      token
        ? {
            headers: {
              authorization: `bearer ${token}`
            }
          }
        : undefined
    )

    return { responseStatus: 'success', data }
  } catch (error) {
    console.log(error.message)
    return { responseStatus: 'error', message: error.message }
  }
}

export const put = async <T extends GenericObject>(
  url: string,
  body: GenericObject,
  token: string
): Promise<ApiResponse<T>> => {
  try {
    const { data } = await axios.put(url, body, {
      headers: {
        authorization: `bearer ${token}`
      }
    })

    return { responseStatus: 'success', data }
  } catch (error) {
    console.log(error.message)
    return { responseStatus: 'error', message: error.message }
  }
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL
