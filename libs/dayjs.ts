import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import duration from 'dayjs/plugin/duration'

dayjs.extend(relativeTime)
dayjs.extend(isSameOrAfter)
dayjs.extend(duration)

export default dayjs
