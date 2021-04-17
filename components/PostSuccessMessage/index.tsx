import { useCallback } from 'react'
import { useRouter } from 'next/router'

import Checkmark from '../SVGIcons/Checkmark'
import Button from '../Button'

import styles from './PostSuccessMessage.module.css'

interface Props {
  postId: number
  categoryId: number
}

const PostSuccessMessage: React.FC<Props> = ({ postId, categoryId }) => {
  const router = useRouter()

  const goToPostCallback = useCallback(
    (event) => {
      event.preventDefault()

      router.push(`/skill/${categoryId}/${postId}`)
    },
    [postId, categoryId]
  )

  const goToHomeCallback = useCallback(
    (event) => {
      event.preventDefault()

      router.push('/')
    },
    [postId, categoryId]
  )
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>
        <Checkmark />
      </div>
      <h2>Skill submitted</h2>
      <p>
        Thanks for submitting your skill! Go to your post and leave your first
        comment to engage with the community.
      </p>
      <div className={styles.buttonsWrapper}>
        <Button fullWidth onClick={goToPostCallback}>
          Go to post
        </Button>
        <Button fullWidth outline onClick={goToHomeCallback}>
          Back to home
        </Button>
      </div>
    </div>
  )
}

export default PostSuccessMessage
