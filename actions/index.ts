export const loginUser = (
  isAuthorized: boolean,
  accessToken: null | string,
  attributes: UserCognitoAttributes
): { type: string; payload: AuthState } => ({
  type: 'LOGIN_USER',
  payload: {
    isAuthorized: isAuthorized,
    accessToken: accessToken,
    attributes
  }
})

export const logoutUser = (): { type: string } => ({
  type: 'LOGOUT_USER'
})

export const getSkills = (
  payload: Post[]
): { type: string; payload: Post[] } => ({
  type: 'GET_SKILLS_SUCCESS',
  payload
})

export const toggleLoginModal = (
  shouldOpen: boolean
): { type: string; payload: boolean } => ({
  type: 'TOGGLE_LOGIN_MODAL',
  payload: shouldOpen
})

export const setCategories = (
  categories: Category[]
): { type: string; payload: Category[] } => ({
  type: 'SET_CATEGORIES',
  payload: categories
})
