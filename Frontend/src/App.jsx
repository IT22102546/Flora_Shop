import { BrowserRouter , Route , Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"

import Events from "./pages/Events"
import Header from "./components/Header"
import Footer from "./components/Footer"
import PrivateRoute from "./components/PrivateRoute"
import Search from "./pages/Search"
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute"
import AddProducts from "./pages/AddProducts"
import UpdateProducts from "./pages/UpdateProduct"
import DashBoard from "./pages/Dashboard"


export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route element={<PrivateRoute/>}>
           <Route path="/dashboard" element={<DashBoard/>}/> 
        </Route>
        <Route element={<OnlyAdminPrivateRoute/>}>
           <Route path="/add-product" element={<AddProducts/>}/>
           <Route path="/update-product/:productId" element={<UpdateProducts/>}/>  
        </Route>
        <Route path="/events" element={<Events/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}
