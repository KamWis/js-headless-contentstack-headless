import classNames from 'classnames'
import { useEffect, useState } from 'react'
import Link from 'next/link'

import dayjs from '../../libs/dayjs'
import VotesCounter from '../VotesCounter'
import Label, { Props as LabelProps } from '../Label'
import PostMeta from '../PostMeta'
import useClientSideToday from '../../hooks/useClientSideToday'
import useVoteCounter from '../../hooks/useVoteCounter'
import ArrowRightOutline from '../SVGIcons/ArrorRightOutline'

import styles from './Product.module.css'

interface Props extends Post {
  isCompact?: boolean
}

const getPlural = (number: number, word: string) => {
  if (number === 1) {
    return word
  }

  return `${word}s`
}

const getTimeStringWithVariant = (today, expiresAt): LabelProps => {
  const isExpired = today.isSameOrAfter(expiresAt)
  const timeDiffInSeconds = dayjs(expiresAt).diff(today, 'seconds')
  const timeDiffInMinutes = dayjs(expiresAt).diff(today, 'minutes')
  const timeDiffInHours = dayjs(expiresAt).diff(today, 'hours')
  const timeDiffInDays = dayjs(expiresAt).diff(today, 'days')

  if (isExpired) {
    return {
      text: 'Expired',
      labelType: 'inactive',
      reversedColor: false
    }
  }

  if (timeDiffInSeconds < 60) {
    return {
      text: `Gone in ${timeDiffInSeconds} sec`,
      labelType: 'error',
      reversedColor: false
    }
  }

  if (timeDiffInMinutes < 60) {
    return {
      text: `${timeDiffInMinutes + 1} min left`,
      labelType: 'error',
      reversedColor: true
    }
  }

  if (timeDiffInHours <= 24) {
    return {
      text: `${timeDiffInHours + 1} ${getPlural(
        timeDiffInHours + 1,
        'hour'
      )} left`,
      labelType: 'warning',
      reversedColor: false
    }
  }

  return {
    text: `${timeDiffInDays + 1} ${getPlural(timeDiffInDays + 1, 'day')} left`,
    labelType: 'active',
    reversedColor: true
  }
}

const useLabelTextAndExpired = (expiresAt) => {
  const initialToday = useClientSideToday()
  const timeDiffInMinutes = dayjs(expiresAt).diff(initialToday, 'minutes')

  const today = useClientSideToday(
    timeDiffInMinutes < 60 && timeDiffInMinutes >= 0
  )

  const isExpired = today.isSameOrAfter(expiresAt)
  const [isMounted, setIsMounted] = useState(false)
  const labelTextAndVariant = getTimeStringWithVariant(today, expiresAt)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const labelText =
    !isMounted &&
    labelTextAndVariant.labelType === 'error' &&
    !labelTextAndVariant.reversedColor
      ? 'Gone in 60 sec'
      : labelTextAndVariant.text

  return {
    isExpired,
    labelTextAndVariant: {
      ...labelTextAndVariant,
      text: labelText
    }
  }
}

const Product: React.FC<Props> = (props) => {
  const { onVoteUp, onVoteDown, vote, voteCount } = useVoteCounter(
    props.id,
    props.vote,
    props.voteCount
  )
  const { labelTextAndVariant, isExpired } = useLabelTextAndExpired(
    props.expiresAt
  )

  return (
    <Link href={`/skill/${props.categories[0].id}/${props.id}`}>
      <div
        className={classNames({
          [styles.product]: true,
          [styles.compact]: props.isCompact
        })}
      >
        <VotesCounter
          votesCount={voteCount}
          className={styles.voteCounter}
          onVoteUp={onVoteUp}
          vote={vote}
          onVoteDown={onVoteDown}
        />
        <div className={styles.details}>
          <div className={styles.categoryContainer}>
            <Label
              text={labelTextAndVariant.text}
              labelType={labelTextAndVariant.labelType}
              reversedColor={labelTextAndVariant.reversedColor}
            />
            <span className={styles.category}>{props.category}</span>
          </div>
          <div
            className={classNames({
              [styles.title]: true,
              [styles.expired]: isExpired
            })}
          >
            {props.title}
          </div>
          <PostMeta
            isCompact={props.isCompact}
            author={props.author}
            commentsCount={props.commentsCount}
            createdAt={props.startsAt}
          />
        </div>
        {!props.isCompact && (
          <div className={styles.arrow}>
            <ArrowRightOutline />
          </div>
        )}
      </div>
    </Link>
  )
}
export default Product
