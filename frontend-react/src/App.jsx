import {BrowserRouter, Routes, Route} from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navabar.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/menu.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import TestBackend from "./pages/Testbackend.jsx";
import Profile from "./pages/Profile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import OrderTracking from "./pages/OrderTracking.jsx";



function App()
 {
  const [search,setSearch] = useState("");

  return (
    <BrowserRouter>
    <Navbar setSearch={setSearch} />
    <Routes>
      <Route path ="/" element ={<Home search={search} />}/>
      <Route path ="/menu" element ={<Menu search={search} setSearch={setSearch} />}/>
      <Route path ="/cart" element ={<Cart />}/>
      <Route path ="/login" element ={<Login />}/>
      <Route path ="/signup" element ={<Signup />}/>
      <Route path ="/test" element ={<TestBackend />}/>
      <Route path ="/profile" element ={<Profile />}/>
      <Route path ="/admin" element ={<AdminDashboard />}/>
      <Route path ="/order-tracking/:orderId" element ={<OrderTracking />}/>
      


    </Routes>



    </BrowserRouter>
  )
}
export default App;
