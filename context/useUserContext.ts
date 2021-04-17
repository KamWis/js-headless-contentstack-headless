import { createContext, useReducer } from 'react'

const initialState = {
  isAuthorized: false,
  accessToken: null
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_USER':
      return { ...state, ...action.payload }
    case 'LOGOUT_USER':
      return { ...initialState }
    default:
      return { ...state }
  }
}

export const UserContext = createContext({
  state: initialState,
  dispatch: null
})

export const useUserReducer = () => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  return [state, dispatch]
}
