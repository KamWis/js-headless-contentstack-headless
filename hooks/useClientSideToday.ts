import { useState, useEffect } from 'react'

import dayjs from '../libs/dayjs'

const useClientSideToday = (withInterval?: boolean): dayjs.Dayjs => {
  const [today, setToday] = useState(dayjs())

  useEffect(() => {
    setToday(dayjs())

    if (!withInterval) {
      return
    }

    setToday(dayjs())

    const interval = setInterval(() => setToday(dayjs()), 1000)

    return () => clearInterval(interval)
  }, [])

  return today
}

export default useClientSideToday
