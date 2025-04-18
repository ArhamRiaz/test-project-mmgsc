import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarData } from "./helpers/SideBarData";
import { GrTransaction } from "react-icons/gr";
import { IoMdSettings } from "react-icons/io";
import "../App.css";


export const SideBar = ({ children }) => {
  const [sidebar, setSidebar] = useState(true);
  const [settings, setSettings] = useState(false)
  const location = useLocation();

    const showSettings = () => setSettings(!settings);
  
  const isActive = (path) => location.pathname === path;
  return (
    <div className="flex"> 
    <aside className='side-screen'>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>

          <ul className="nav-menu-items" >
          <li className={`nav-text ${isActive("/transactions") ? "active" : ""}`}>
                <Link to="/transactions" className="flex items-center gap-2">
                    <GrTransaction className="inline-block align-middle" />
                <span className="font-bold inline-block align-middle">Transactions</span>
                </Link>
           </li>

            <li className="nav-text" onClick={showSettings}>
                <div className="flex items-center gap-2 cursor-pointer">
                    <IoMdSettings className="inline-block align-middle" />
                <span className="font-bold inline-block align-middle">Settings</span>
                </div>
            </li>

                {settings && SidebarData.map((item) => {
                    return (
                        <li key={item.path} className={`nav-text-2 ${isActive(item.path) ? "active" : ""}`}>
                        <Link to={item.path} className="flex items-center gap-2">
                          
                            <span>{item.title}</span>
                        </Link>
                        </li>
                    );
                })}
          </ul>
        </nav>
        </aside>

        <div 
            className="main-content" 
            style={{
            marginLeft: sidebar ? '250px' : '0', 
            width: sidebar ? 'calc(100% - 250px)' : '100%',
            padding: '1rem',
            transition: 'margin-left 0.45s ease' 
            }}
        >
            {children}
        </div>
        
    
    </div>
  );
}

