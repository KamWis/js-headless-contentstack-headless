import { combineReducers } from 'redux'

const initialState = {
  isAuthorized: false,
  accessToken: null,
  attributes: {
    given_name: null,
    family_name: null
  }
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_USER':
      return { ...state, ...action.payload }
    case 'LOGOUT_USER':
      return { ...initialState }
    default:
      return { ...state }
  }
}

const initialSkillsState = {
  skillList: []
}

const skillsReducer = (state = initialSkillsState, action) => {
  switch (action.type) {
    case 'GET_SKILLS_SUCCESS':
      return { ...state, skillList: [...action.payload] }
    default:
      return { ...state }
  }
}

const initialModalState = {
  login: false
}

const modalsReducer = (state = initialModalState, action) => {
  switch (action.type) {
    case 'TOGGLE_LOGIN_MODAL':
      return { ...state, login: action.payload }
    default:
      return { ...state }
  }
}

const initialCategoriesState = {
  rawList: [],
  drawerItems: []
}

const formatCategoriesForDrawer = (categories: Category[]) =>
  categories.map((category) => ({
    url: `/category/${category.id}`,
    slug: '',
    text: category.name,
    id: category.id
  }))

const categoriesReducer = (state = initialCategoriesState, action) => {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return {
        ...state,
        rawList: action.payload,
        drawerItems: formatCategoriesForDrawer(action.payload)
      }
    default:
      return { ...state }
  }
}

const reducers = {
  auth: authReducer,
  skills: skillsReducer,
  modals: modalsReducer,
  categories: categoriesReducer
}

export default combineReducers(reducers)
