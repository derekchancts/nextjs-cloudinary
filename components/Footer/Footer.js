import styles from './Footer.module.scss';

const Footer = ({ ...rest }) => {
  return (
    <footer className={styles.footer} {...rest}>
      Footer.inc, {new Date().getFullYear()}
    </footer>
  )
}

export default Footer;