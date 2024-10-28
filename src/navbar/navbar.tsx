import styles from './navbar.module.css'
import logo from 'mlogo.png'
import { FaLocationDot } from 'react-icons/fa6'
import { IoIosChatbubbles } from 'react-icons/io'
import { IoPerson } from 'react-icons/io5'
import { FaGear } from 'react-icons/fa6'

export function Nav() {
    return(
    <div className={styles.nav_container}>
        <img className={styles.nav_logo} src={logo}></img>
        <FaLocationDot></FaLocationDot>
        <IoIosChatbubbles></IoIosChatbubbles>
        <IoPerson></IoPerson>
        <FaGear></FaGear>
    </div>
    )
}

export default Nav