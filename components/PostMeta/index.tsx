import React from 'react'
import classNames from 'classnames'

import dayjs from '../../libs/dayjs'
import Dot from '../SVGIcons/Dot'

import styles from './PostMeta.module.css'

interface Props {
  isCompact?: boolean
  author: string
  commentsCount: number
  createdAt: string | number
  boldAuthor?: boolean
  className?: string
}

const PostMeta: React.FC<Props> = (props) => (
  <div
    className={classNames([
      styles.meta,
      props.isCompact && styles.compact,
      props.className
    ])}
  >
    {dayjs(props.createdAt).fromNow()} by{' '}
    <span
      className={classNames([
        styles.metaLink,
        styles.link,
        props.boldAuthor && styles.boldLink
      ])}
    >
      {props.author}
    </span>
    <Dot className={styles.dot} />{' '}
    <span className={styles.link}>
      {props.commentsCount} {props.commentsCount === 1 ? 'comment' : 'comments'}
    </span>
  </div>
)

export default PostMeta
