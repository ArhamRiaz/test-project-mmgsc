import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "../App.css";


export const SideBar = ({ children }) => {
  const [sidebar, setSidebar] = useState(true);
  const [settings, setSettings] = useState(false)
  const location = useLocation();

  const showSidebar = () => setSidebar(!sidebar);
  const showSettings = () => setSettings(!settings);
  
  const isActive = (path) => location.pathname === path;
  return (
    <div className="flex"> 
    <aside className='side-screen'>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>

          <ul className="nav-menu-items" >
                <li  className={`nav-text ${isActive("/transactions") ? "active" : ""}`} >
                  <Link to="/transactions">
                    <p>{"Transactions"}</p>
                  </Link>
                </li>

                <li className={"nav-text"} onClick={showSettings}>
                    <div>
                        <p>{"Settings"}</p>
                    </div>
                </li>

                {settings && SidebarData.map((item) => {
                    return (
                        <li key={item.path} className={`nav-text-2 ${isActive(item.path) ? "active" : ""}`}>
                        <Link to={item.path}>
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
            marginLeft: sidebar ? '250px' : '0', // Match sidebar width
            width: sidebar ? 'calc(100% - 250px)' : '100%',
            padding: '1rem',
            transition: 'margin-left 0.45s ease' // Match sidebar transition
            }}
        >
            {children}
        </div>
        
    
    </div>
  );
}

