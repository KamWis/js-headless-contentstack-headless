import classNames from 'classnames'

import styles from './Label.module.css'

export interface Props {
  text: string
  labelType: 'inactive' | 'active' | 'warning' | 'error'
  reversedColor?: boolean
}

const getLabelType = (labelType: string) => {
  switch (labelType) {
    case 'inactive':
      return styles.inactive
    case 'active':
      return styles.active
    case 'error':
      return styles.error
    case 'warning':
      return styles.warning
    default:
      return styles.active
  }
}

const Label: React.FC<Props> = ({ text, labelType, reversedColor = false }) => (
  <span
    className={classNames({
      [styles.label]: true,
      [getLabelType(labelType)]: true,
      [styles.reversed]: reversedColor
    })}
  >
    {text}
  </span>
)

export default Label
