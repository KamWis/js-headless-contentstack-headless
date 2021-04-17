import { useState, useEffect, SetStateAction, Dispatch, RefObject } from 'react'

const useDetectOutsideClick = (
  el: RefObject<HTMLElement>,
  initialState: boolean
): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [isActive, setIsActive] = useState(initialState)

  useEffect(() => {
    const onClick = (e) => {
      if (el.current !== null && !el.current.contains(e.target)) {
        setIsActive(!isActive)
      }
    }

    if (isActive) {
      window.addEventListener('click', onClick)
    }

    return () => {
      window.removeEventListener('click', onClick)
    }
  }, [isActive, el])

  return [isActive, setIsActive]
}

export default useDetectOutsideClick
