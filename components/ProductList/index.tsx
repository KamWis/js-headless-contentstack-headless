import Product from '../Product'

import styles from './ProductList.module.css'

interface Props {
  title?: string
  list: Post[]
  isCompact?: boolean
}

const ProductList: React.FC<Props> = ({ title, list, isCompact }) => {
  return (
    <div className="row">
      {title ? <div className={styles.title}>{title}</div> : null}
      {list.map((item) => (
        <Product key={item.id} {...item} isCompact={isCompact} />
      ))}
    </div>
  )
}

export default ProductList
