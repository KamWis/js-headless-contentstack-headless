import { isEqual } from 'lodash'
import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react'

const useStateWithDeepCompare = <S>(
  prop: S,
  additionalWatcherProp?: unknown
): [S, Dispatch<SetStateAction<S>>] => {
  const [stateValue, setState] = useState(prop)

  const initialPropRef = useRef(prop)
  useEffect(() => {
    initialPropRef.current = prop
    setState(prop)
  }, [isEqual(prop, initialPropRef.current), additionalWatcherProp])

  return [stateValue, setState]
}

export default useStateWithDeepCompare
