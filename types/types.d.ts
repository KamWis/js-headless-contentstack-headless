interface Category {
  name: string
  id: number
  posts?: Post[]
}

type VoteType = 'vote-up' | 'vote-down' | 'no-vote'

interface Vote {
  vote: VoteType
  postId: number
  id: number
}

interface Post {
  id: number
  categories?: Category[]
  category?: string
  comments: CommentMessageResponse[]
  title: string
  description: string
  author: string
  voteCount: number
  startsAt: string
  expiresAt: string
  commentsCount: number
  vote?: VoteType
}

interface NavigationLink {
  url?: string
  slug?: string
  text: string
  id: string | number
}

interface NavigationLinkWithNesting extends NavigationLink {
  items?: NavigationLink[]
}

interface UserCognitoAttributes {
  given_name: string
  family_name: string
  email: string
  sub: string
}

interface UserStrapiAttributes {
  id: number
  name: string
  email: string
}

interface AuthState {
  isAuthorized: boolean
  accessToken: null | string
  attributes: UserCognitoAttributes
}

interface SkillsState {
  skillList: Post[]
}

interface ModalsState {
  login: boolean
}

interface CategoriesState {
  rawList: Category[]
  drawerItems: NavigationLink[]
}

interface InitialState {
  auth: AuthState
  skills: SkillsState
  modals: ModalsState
  categories: CategoriesState
}

interface CommentMessageResponse extends CommentMessage {
  created_at: string
}

interface CommentMessage {
  authorAvatar?: string
  authorName: string
  content: string
  id: number
  createdAt: number | string
  comments: CommentMessage[]
  voteCount: number
  level?: number
  threadOf?: number
}

interface OptionType {
  value: string
  label: string
}

interface GenericObject {
  [key: string]: any //eslint-disable-line @typescript-eslint/no-explicit-any
}
