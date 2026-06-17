import { Outlet } from "react-router-dom"
import Navbar from "./Navbar.jsx"

const MianLayout = () => {
  return (
    <div>
        <Navbar/>
        <div className="pt-6">
            <Outlet/>
        </div>
    </div>
  )
}

export default MianLayout