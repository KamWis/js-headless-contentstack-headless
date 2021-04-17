interface Props {
  onClick?: (event) => void
  className?: string
}

const AmplifyingGlass: React.FC<Props> = ({ onClick, className }) => (
  <svg
    onClick={onClick}
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="11.7664"
      cy="11.7666"
      r="8.98856"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.0181 18.4851L21.5421 22"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default AmplifyingGlass
