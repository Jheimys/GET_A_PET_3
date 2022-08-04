import { Link } from 'react-router-dom'
import { useContext } from 'react'

import styles from './Navbar.module.css'

import Logo from '../../assets/img/logo.png'

/* Context */
import {Context} from '../../context/UserContext'


function Navbar(){

    const res = useContext(Context)
    const { authenticadet, logout } = useContext(Context)
    console.log(res, authenticadet)

    return(

        <nav className={styles.navbar}>

            <div className={styles.navbar_logo}>
                <img src={Logo} alt="Get A Pet"  />
                <h2>Get A Pet</h2>
            </div>

            <ul>
                <li>
                    <Link to="/">Adotar</Link>
                </li>
                
                {authenticadet ? (  
                    <> 
                        <li onClick={logout}> Sair </li>
                    </> 
                ):(
                    <>
                        <li>
                            <Link to="/login">Entar</Link>
                        </li>

                        <li>
                            <Link to="/register">Cadastrar</Link>
                        </li> 
                    </>
                )}       
            </ul>
        </nav>
    )
}

export default Navbar