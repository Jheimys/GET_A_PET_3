import api from '../../../utils/api'

import { useState, useEffect } from 'react'

import styles from './Dashboard.module.css'

import RoundedImage from '../../layout/RoundedImage'

function MyAdoptions() {

    const [pets, setPets] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')

    useEffect(() => {

        api.get('/pets/myadoptions', {
            headers:{
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setPets(response.data.pets)
            
        })
    }, [token])

    return(
        <p>My adoptions</p>
    )
}

export default MyAdoptions