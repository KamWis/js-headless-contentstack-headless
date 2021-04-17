import React from 'react'

import Logo from '../SVGIcons/Logo'

import styles from './Footer.module.css'

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <a href="/" target="_blank" rel="noopener noreferrer">
      Powered by <Logo />
    </a>
  </footer>
)

export default Footer
