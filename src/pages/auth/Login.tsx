import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FaUser, FaKey } from "react-icons/fa";
import user from "/user.svg";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FcDepartment } from "react-icons/fc";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import {
  useGetToken,
  useHandleAxiosError,
  useSetToken,
  useSetUser,
} from "../../hooks";

interface UserDetails {
  email: string;
  department: string;
  password: string;
}

const Login = () => {
  const token = useGetToken();

  const navigate = useNavigate();
  const [active, setActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserDetails>({
    email: "",
    department: "",
    password: "",
  });

  useEffect(() => {
    if (token) {
      navigate("/lms");
    }
  }, [token, navigate]);

  const handleShowPass = (): void => {
    setActive(!active);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (token) navigate("/lms");

    const { department, email, password } = formData;

    if (!department) {
      toast.error("Department Required");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/login`,
        { department, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data?.success) {
        useSetToken(data.token);
        useSetUser(data.user);
        toast.success(data.message);
        navigate("/lms");
      }
    } catch (error: any) {
      useHandleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth">
      <div className="auth_container">
        <div className="auth_upper">
          <div>
            <img src={user} alt="user" />
          </div>
          <h1>Student Login</h1>
        </div>
        <form className="auth_form" onSubmit={handleSubmit}>
          <div className="group">
            <FcDepartment color="black" />
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option>--- Select Depart ---</option>
              <option value="bsse">BSSE</option>
              <option value="bscs">BSCS</option>
              <option value="bsit">BSIT</option>
            </select>
          </div>

          <div className="group">
            <FaUser size={15} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="group">
            <FaKey size={15} />
            <input
              type={active ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span className="eye" onClick={handleShowPass}>
              {active ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">
            {loading ? (
              <ClipLoader color="white" loading={loading} size={10} />
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="forget">
          Forgot Password ? <Link to="/forget-password">click here</Link>
        </p>
        <p className="forget">
          Don't have an account ? <Link to="/register">register here</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
