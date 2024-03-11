import logo from './logo.svg';
import './App.scss';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/View Admin';
import Product from './pages/Item';
import SingleProduct from './pages/SingleItemAdmin';
import Category from './pages/Category';
import Checkout from './pages/Checkout';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import ProtectedRoutes from './utils/ProtectedRoutes';
import Item from './pages/ManageItem';
import Categories from './pages/AddCategory';
import ManageCategory from './pages/ManageCategory';

import AdminLogin from './pages/Auth/AdminLogin';
import View from './pages/View Home';
import Category1 from './pages/displayCat';

import OrderDetails from './pages/Order';

import ViewUser from './pages/View user';
import Category2 from './pages/displayCatAdmin';
import Checkout1 from './pages/CheckoutAdmin';

import Category3 from './pages/displayCatGuest';
import CategoryGuest from './pages/CategoryGuest';
import CategoryUser from './pages/CategoryUser';


import SingleItemAdmin from './pages/SingleItemAdmin';
import SingleItemGuest from './pages/SingleItemGuest';
import SingleItemUser from './pages/SingleItemUser';
import Orders from './pages/Order';


const App = () => { //Main Component
  return (
    <BrowserRouter>
      <Routes>
        
        <Route element={<ProtectedRoutes />}>

          <Route index element={<View />} />
          <Route path="/home" element={<Home />} />
          <Route path="/items" element={<Product />} />

          <Route path="/item/:id" element={<SingleItemUser />} />
          <Route path="/item2/:id" element={<SingleItemGuest />} />
          <Route path="/items/:id" element={<SingleProduct />} />
          <Route path="/items/:id" element={<SingleItemAdmin />} />
          <Route path="/manageItem" element={<Item />} />
          <Route path="/categories/:id" element={<Category />} />
          <Route path="/categories1/:id" element={<CategoryGuest />} />
          <Route path="/categories2/:id" element={<CategoryUser />} />
          
          <Route path="/categories" element={<Categories />} />
          <Route path="/category1" element={<Category1 />}/>
          <Route path="/category2" element={<Category2 />}/>
          <Route path="/category3" element={<Category3 />}/>
          <Route path="/manageCategory" element={<ManageCategory />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout1" element={<Checkout1 />} />
          <Route path="/orders" element={<Orders />} />

          <Route path="/view" element={<View />} />
          <Route path="/viewUser" element={<ViewUser />} />
          
        </Route>


        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
