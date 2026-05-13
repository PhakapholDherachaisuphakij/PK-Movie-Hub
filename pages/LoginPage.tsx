import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



const Login: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

 
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const envUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (username === envUsername && password === envPassword) {
      navigate("/blogwriter/NewBlog");
    } else {
      alert("Incorrect username or password");
    }
  };

  return (
    <>
     <Navbar />
     <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[1000]"
    >
      <div className="relative w-full max-w-[450px] bg-black bg-opacity-85 rounded-md p-[60px_68px_40px] text-white">
        <Link to="/"><button
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="white"/>
          </svg>
        </button></Link>
        
        <div className="modal-body">
          <h2 className="text-[32px] font-bold mb-7">Admin only</h2>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 bg-[#333] border-none rounded text-white text-base placeholder-[#8c8c8c] focus:bg-[#454545] focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-[#333] border-none rounded text-white text-base placeholder-[#8c8c8c] focus:bg-[#454545] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-[#e50914] text-white text-base font-medium py-4 rounded mt-6 mb-3 cursor-pointer hover:bg-[#f40612]"
            >
              Log in
            </button>
            <div className="flex justify-between items-center mt-3">
              <label className="flex items-center text-[#b3b3b3] text-[13px]">
                <input type="checkbox" defaultChecked className="mr-1" />
                Remember me
              </label>
              <a href="#" className="text-[#b3b3b3] text-[13px] no-underline hover:underline">
                Pk only
              </a>
            </div>
          </form>
         
        </div>
      </div>
    </div>
     </>
    
  );
};

export default Login;
