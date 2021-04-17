import ReactDOM from 'react-dom'
import { useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
}

const PortalWrapper: React.FC<Props> = ({ children }) => {
  const modalContainerRef = useRef(null)

  useEffect(() => {
    const nextRoot = document.getElementById('__next')

    modalContainerRef.current = document.createElement('div')
    modalContainerRef.current.classList.add('modal-root')

    nextRoot.appendChild(modalContainerRef.current)

    return () => nextRoot.removeChild(modalContainerRef.current)
  }, [])

  if (!modalContainerRef.current) {
    return null
  }

  return ReactDOM.createPortal(children, modalContainerRef.current)
}

export default PortalWrapper
