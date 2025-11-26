import React from 'react'
import { useAuth } from '../Context/Authcontext';
import { useNavigate } from 'react-router-dom';

function Viewpage() {
     const { user } = useAuth();
     const navigate=useNavigate()
      const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate('/')
  };
  return (
    <div>
        <div className="viewcontainer">
            <div className="viewinternal-container">
                <div className="header">
                    <div className="grating">
                          <h2>Well-Come</h2>
                    <p>We are Trusted Market Place....</p>
                    </div>
                    <div className="profile           avatar bg-secondary text-white d-flex justify-content-center align-items-center rounded-circle" style={{ width: "150px", height: "150px",cursor:'pointer' }}>

                        <div className="profileimage ">
                            <img src="" alt="" />
                        </div>
                    </div>
                  
                </div>


                <div className="pro-main">
                    <div className="Editprofile">
                        <div className="edit">
                            <h2>EDit </h2>
                            Name :  Dear, {user?.name}
                        </div>
                        <button onClick={logout}>Logout</button>
                    </div>
                </div>

            </div>
        </div>
      
    </div>
  )
}

export default Viewpage
