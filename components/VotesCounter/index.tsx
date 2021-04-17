import React from 'react'
import classNames from 'classnames'

import ArrowUp from '../SVGIcons/ArrowUp'
import ArrowDown from '../SVGIcons/ArrowDown'
import styles from './VotesCounter.module.css'

interface Props {
  votesCount: number
  onVoteUp: (event: React.MouseEvent<HTMLElement>) => void
  onVoteDown: (event: React.MouseEvent<HTMLElement>) => void
  className?: string
  vote?: 'vote-up' | 'vote-down' | 'no-vote'
}

const VotesCounter: React.FC<Props> = ({
  votesCount,
  className,
  onVoteUp,
  onVoteDown,
  vote
}) => (
  <div
    className={classNames({
      [styles.container]: true,
      [className]: !!className,
      [styles.activeUp]: vote === 'vote-up',
      [styles.activeDown]: vote === 'vote-down'
    })}
  >
    <button
      className={classNames({
        [styles.button]: true,
        [styles.up]: true,
        [styles.active]: vote === 'vote-up'
      })}
      onClick={onVoteUp}
    >
      <ArrowUp />
    </button>
    <div>{votesCount}</div>
    <button
      className={classNames({
        [styles.button]: true,
        [styles.down]: true,
        [styles.active]: vote === 'vote-down'
      })}
      onClick={onVoteDown}
    >
      <ArrowDown />
    </button>
  </div>
)

export default VotesCounter
