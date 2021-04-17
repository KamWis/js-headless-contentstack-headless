import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { toggleLoginModal } from '../../actions'
import CommentBubble from '../SVGIcons/CommentBubble'

import styles from './SignInToInfoBox.module.css'

interface Props {
  text: string
}

const SignInToInfoBox: React.FC<Props> = ({ text }) => {
  const dispatch = useDispatch()

  const toogleModalCallback = useCallback(() => {
    dispatch(toggleLoginModal(true))
  }, [])
  return (
    <div className={styles.container}>
      <CommentBubble className={styles.commentIcon} />
      <button
        className="textM strong textButton active"
        onClick={toogleModalCallback}
      >
        Sign in
      </button>
      <span> to {text}</span>
    </div>
  )
}

export default SignInToInfoBox
