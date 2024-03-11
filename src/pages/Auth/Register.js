import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    const handleUsername = (event) => {
        setUsername(event.target.value);
    }

    const handlePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleEmail = (event) => {
        setEmail(event.target.value);
    }

    const handleRegister = async (event) => {

        event.preventDefault();

        const data = {
            "username": username,
            "password": password,
            "email": email,
        }

        const response = await axios.post("http://localhost:8081/auth/register",data);

        if(response.status === 200) {
            navigate("/login");
        } else {
            console.log("error");
        }

    }

    return (
        <div className="login-box">
            <div className="text-center mb-5">
                <h1>User Register</h1>
            </div>
            <form onSubmit={handleRegister}>
                <div className="form-group mb-3">
                    <input type="text" className="form-control" onChange={handleUsername} placeholder="Username" required />
                </div>

                <div className="form-group mb-3">
                    <input type="password" className="form-control" onChange={handlePassword} placeholder="Password" required />
                </div>

                <div className="form-group mb-3">
                    <input type="email" className="form-control" onChange={handleEmail} placeholder="Email Address" required />
                </div>

                <button type="submit" className="btn btn-primary">Register</button>
            </form>

            <div class="p-3 mb-2 bg-warning text-dark">

        </div>
        </div>
        
    )

}

export default Register;