import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "../App.css";


export const SideBar = ({ children }) => {
  const [sidebar, setSidebar] = useState(true);
  const [settings, setSettings] = useState(false)

  const showSidebar = () => setSidebar(!sidebar);
  const showSettings = () => setSettings(!settings);

  return (
    <aside className='side-screen'>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>

          <ul className="nav-menu-items" >
                <li  className={"nav-text"}>
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
                        <li key={item.path} className={item.cName}>
                        <Link to={item.path}>
                            <span>{item.title}</span>
                        </Link>
                        </li>
                    );
                })}
          </ul>
        </nav>

        <div className="main-content" style={{ flex: 1, padding: "1rem" }}>
         {children}
        </div>
        
    </aside>
  );
}

