import { MdAccountCircle } from "react-icons/md";
import { BsBank } from "react-icons/bs";
import { MdOutlineManageSearch } from "react-icons/md";

export const SidebarData = [

  {
    title: "User Management",
    path: "/userManagement",
    cName: "nav-text-2",
    icon: <MdAccountCircle/>
  },
  {
    title: "ATM Management",
    path: "/atmManagement",
    cName: "nav-text-2",
    icon: <BsBank/>
  },
  {
    title: "My Account",
    path: "/account",
    cName: "nav-text-2",
    icon: <MdOutlineManageSearch/>
  },
  
];