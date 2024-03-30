import { BrowserRouter , Route , Routes} from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import DashBoard from "./pages/DashBoard"
import Events from "./pages/Events"
import Header from "./components/Header"
import Footer from "./components/Footer"
import PrivateRoute from "./components/PrivateRoute"
import Cart from "./pages/Cart";
import Ordersummary from "./pages/Ordersummary"
import NotFound from "./pages/NotFound";

import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Products from "./pages/Products"
import Checkout from "./pages/Checkout"
import Search from "./pages/Search"
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute"
import AddProducts from "./pages/AddProducts"
import UpdateProducts from "./pages/UpdateProduct"
import UpdateOrder from "./pages/UpdateOrder";
import RequestItems from "./pages/RequestItems"
import UpdateRequest from "./pages/UpdateRequest"


export default function App() {
  return (
    <BrowserRouter>
    <ToastContainer />
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route element={<PrivateRoute/>}/>
        <Route path="/dashboard" element={<DashBoard/>}/> 
        <Route element={<OnlyAdminPrivateRoute/>}>
           <Route path="/add-product" element={<AddProducts/>}/>
           <Route path="/update-product/:productId" element={<UpdateProducts/>}/>
           <Route path="/update-order/:orderId" element={<UpdateOrder/>}></Route>
           <Route path="/req-items-seller" element={<RequestItems/>}></Route>  
           <Route path="/update-request/:requestId" element={<UpdateRequest/>}></Route>
        </Route>
        <Route path="/events" element={<Events/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/not-found" element={<NotFound/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/ordersummary" element= {<Ordersummary/>} />
        <Route path="/checkout" element={<Checkout/>}/>
        
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}
