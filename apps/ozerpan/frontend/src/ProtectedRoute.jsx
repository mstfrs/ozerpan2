import { useFrappeAuth } from "frappe-react-sdk"
import { Outlet } from "react-router-dom"

const ProtectedRoute = () => {
    const {currentUser}=useFrappeAuth()
    if (currentUser) {
        return (
    
            <div>
              <Outlet/>
            </div>
          )
    }else{
        return(
            <div>
                Not Logged in
                <a href="/login">Login</a>
            </div>
        )
    }
 
}

export default ProtectedRoute
