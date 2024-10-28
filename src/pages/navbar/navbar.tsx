import styles from './navbar.module.css'
import { FaLocationDot } from 'react-icons/fa6'
import { IoIosChatbubbles } from 'react-icons/io'
import { IoPerson } from 'react-icons/io5'
import { FaGear } from 'react-icons/fa6'

export function Nav() {
    return(
    <div className={styles.nav_container}>
        <FaLocationDot className={styles.nav_icon}></FaLocationDot>
        <IoIosChatbubbles className={styles.nav_icon}></IoIosChatbubbles>
        <IoPerson className={styles.nav_icon}></IoPerson>
        <FaGear className={styles.nav_icon}></FaGear>
    </div>
    )
}

export default Nav