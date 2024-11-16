import Nav from '../../navbar/navbar'
import styles from './home.module.css'

function Home() {
    return (
        <>
        <Nav />
        <div className={styles.title}>
            <p>Home Page</p>
        </div>
        </>
    )
  }
  
  export default Home