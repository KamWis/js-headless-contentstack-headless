import styles from './Icons.module.css'

interface Props {
  onClose: (event) => void
  className?: string
}

const Close: React.FC<Props> = ({ onClose, className }) => (
  <svg
    onClick={onClose}
    className={
      className ? `${className} ${styles.closeIcon}` : styles.closeIcon
    }
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.5 5.5L5.5 19.5"
      stroke="black"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.5 19.5L5.5 5.5"
      stroke="black"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default Close
