import React from 'react'
import Button from '../Button'

import styles from './CommentTextArea.module.css'

interface Props {
  value: string
  id?: number
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  submitError: string
  submitComment: (event: React.MouseEvent<HTMLElement>) => void
  isSubmitting: boolean
  placeholder?: string
  disabled?: boolean
}

const CommentTextArea: React.FC<Props> = ({
  value,
  id,
  onChange,
  submitError,
  submitComment,
  isSubmitting,
  placeholder,
  disabled
}) => (
  <div className={styles.wrapper}>
    <textarea
      name={id ? `commentReply-${id}` : 'commentReply'}
      id={id ? `commentReply-${id}` : 'commentReply'}
      className={styles.replyField}
      value={value}
      placeholder={
        placeholder || 'What do you thing at this moment? (Min 80 characters)'
      }
      onChange={onChange}
    />
    {submitError && <span className="error">{submitError}</span>}
    <Button
      onClick={submitComment}
      type="button"
      disabled={value.length < 30 || isSubmitting || disabled}
      className={styles.replyButton}
    >
      Submit reply
    </Button>
  </div>
)

export default CommentTextArea
