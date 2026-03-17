import React, { useState } from 'react'
import { data, Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Login = () => {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

const user = useSelector((state) => state.auth.user);
const loading = useSelector((state) => state.auth.loading);

const { handleLogin } = useAuth();

const navigate = useNavigate();


async function handleSubmit(e) {
  e.preventDefault();
  
  const payload = {
    email,
    password
  };
  await handleLogin(email, password);

  
    navigate("/");
  
  
}

if(!loading && user) {
  return <Navigate to="/" replace />
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px] opacity-30 top-20 left-20"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500 rounded-full blur-[150px] opacity-30 bottom-20 right-20"></div>

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">

        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back
        </h2>

        <p className="text-gray-400 text-center mb-8">
          Login to your account
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>

          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="mt-1 w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end text-sm">
            <a href="#" className="text-gray-400 hover:text-purple-400 transition">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition shadow-lg shadow-purple-700/30"
          >
            Log In
          </button>

        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <span className="text-purple-400 hover:text-purple-300 cursor-pointer">
            <Link to="/register">Sign Up</Link>
          </span>
        </p>

      </div>
    </div>

  )
}

export default Login