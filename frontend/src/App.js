import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

/* components */
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Container from './components/layout/Container'
import Message from './components/layout/Message'

/* pages */
import Login from './components/pages/Auth/Login'
import Register from './components/pages/Auth/Register'
import Home from './components/pages/Home'
import Profile from'./components/pages/User/Profile'
import MyPets from './components/pages/pets/MyPets'
import AddPet from './components/pages/pets/AddPet'
import EditPet from './components/pages/pets/EditPet'
import PetDetails from './components/pages/pets/PetDetails'
import MyAdoptions from './components/pages/pets/MyAdoptions'


/* Context */
import { UserProvider } from './context/UserContext'


function App() {
  return (
   <Router>

      <UserProvider>
        <Navbar />
        <Message/>
        <Container>

          <Routes>

            <Route path="/login" element={<Login />} />
                  
            <Route path="/register" element={<Register /> } />

            <Route path="/user/profile" element={<Profile /> } />

            <Route path="/pet/mypets" element={<MyPets /> } />

            <Route path="/pet/add" element={<AddPet /> } />
            
            <Route path="/pet/edit/:id" element={<EditPet /> } />

            <Route path="/pets/myadoptions" element={<MyAdoptions /> } />

            <Route path="/pets/:id" element={<PetDetails /> } />
        
            <Route path='/' exact element={<Home />} />

          </Routes>

        </Container>
        
        <Footer />

      </UserProvider>
      
    </Router>

  );
}

export default App;
