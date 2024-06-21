import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Hamburger from "hamburger-react";
import { toast } from "react-hot-toast";
import axios from "axios";

export interface User {
  id: string;
  email: string;
  username: string;
  department: string;
  isAdmin: boolean;
  profilePicture: string;
}

const Navbar = () => {
  const navigate = useNavigate();
  const [toggleDropDown, setToggleDropDown] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleToogle = (): void => {
    setToggleDropDown((prev) => !prev);
  };

  const handleMenuToggle = (): void => {
    setToggleMenu((prev) => !prev);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("CurrentUser");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  const logout = async (): Promise<void> => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/logout`,
        {
          withCredentials: true,
        }
      );

      if (data?.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("CurrentUser");
        toast.success(data.message);
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <nav className="parent_nav">
      <nav className="pre_nav">
        <ul>
          <li>
            <i className="fa-solid fa-bullhorn"></i>
            Notices
          </li>
          <li>
            <i className="fa-regular fa-circle-dot"></i>
            Updates
          </li>
        </ul>
        <div className="profile" onClick={handleToogle}>
          <p>{currentUser?.username} </p>|
          <div className="profile_circle">
            <img src={currentUser?.profilePicture} alt="obaid" />
          </div>
          <div
            className={
              toggleDropDown ? "dropdown_menu active" : "dropdown_menu"
            }
          >
            <ul>
              <Link to={"/profile"}>
                <li>
                  <i
                    className="fa fa-user fa-sm fa-fw me-2 text-gray-400"
                    style={{
                      color: "#d1d3e2",
                    }}
                  ></i>
                  Profile
                </li>
              </Link>
              <Link to="/update-password">
                <li>
                  <i
                    className="fa fa-cogs fa-sm fa-fw me-2 text-gray-400"
                    style={{
                      color: "#d1d3e2",
                    }}
                  ></i>
                  Security
                </li>
              </Link>
              <li onClick={logout}>
                <i
                  className="fa fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400"
                  style={{
                    color: "#d1d3e2",
                  }}
                ></i>
                Logout
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <nav className="nav_bar">
        <div className="logo">
          <img src="https://lms.giccl.edu.pk/img/logo.png" alt="giccl" />
          <div className="logo_text">
            <h3>GIGCCL</h3>
            <p>Student Portal</p>
          </div>
        </div>

        <ul className={toggleMenu ? "menu_active" : ""}>
          <Link to={"/home"}>
            <li>Home</li>
          </Link>
          {currentUser?.isAdmin ? <li>Dashboard</li> : null}
          <Link to="/academics">
            <li>Academics</li>
          </Link>
          <Link to={"/"}>
            <li>Learning</li>
          </Link>
          <Link to={"/feedback"}>
            <li>Feedback</li>
          </Link>
        </ul>
        <div className="hamburger" onClick={handleMenuToggle}>
          <Hamburger color="white" size={16} />
        </div>
      </nav>
    </nav>
  );
};

export default Navbar;
