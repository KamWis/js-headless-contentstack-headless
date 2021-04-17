interface Props {
  className?: string
}

const Dot: React.FC<Props> = ({ className }) => (
  <svg
    className={className}
    width="3"
    height="4"
    viewBox="0 0 3 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="1.5" cy="2" r="1.5" fill="#909090" />
  </svg>
)

export default Dot