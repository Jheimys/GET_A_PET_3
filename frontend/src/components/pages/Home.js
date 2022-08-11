import api from '../../utils/api'

import {Link} from 'react-router-dom'

import{ useState, useEffect } from 'react'

import styles from './Home.module.css'

function Home(){

    const [ pets, setPets ] = useState([])

    useEffect(() => {

        api.get('/pets').then((response) => {
            setPets(response.data.pets)
           // console.log(pets)
        })
    },[])

    return(
        <section>

            <div>
                <h1>Adote um Pet</h1>
                <p>Veja o detalhes de cada um  e conheça o tutor deles</p>
            </div>

            <div>
                {pets.length > 0 && 
                    pets.map((pet) => (
                        <div>
                            <p>Imagem do pet</p>
                            <h3>{pet.name}</h3>
                            <p>
                                <span className="bold">Peso:</span> {pet.weight}Kg
                            </p>

                            {pet.available ? (
                                <Link to={`pets/${pet._id}`}><p>Mais detalhes</p></Link>) 
                            :( <p>Adotado</p>)}
                        </div>
                    ))
                }
                {pets.length === 0 && (
                    <p> Não há pets cadastrados ou disponíveis no momento! </p>
                )}
            </div>

        </section>
    )
}

export default Home