import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation} from "react-router-dom";
import './App.css'
import { Transactions } from './components/Transactions';
import { MyAccount } from './components/MyAccount';
import { SideBar } from './components/SideBar';
import { UserManagement } from './components/UserManagement';
import { ATMManagement } from './components/ATMManagement';


function App() {
  document.body.style.backgroundColor = "#FAF9F7";
  

  return (
    <Router>
      <SideBar>
      <Routes>
      
      <Route path="/" 
        element={<Transactions></Transactions>}
        />

      <Route path="/transactions" 
        element={<Transactions></Transactions>}
        />
      
      <Route path="/userManagement"
        element={<UserManagement></UserManagement>}
        />

      <Route path="/atmManagement"
        element={<ATMManagement></ATMManagement>}
        />

      <Route path="/account"
        element={<MyAccount></MyAccount>}
        />
      </Routes>
      </SideBar>
      </Router>
  )
}

export default App
