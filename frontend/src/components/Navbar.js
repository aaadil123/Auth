import React, {useContext} from 'react'
import logo from '../assets/code.png'
import {Link, useNavigate} from 'react-router-dom'
import { UserContext } from '../context/userContext'

const Navbar = () => {
  const {isLoggedIn, setIsLoggedIn} = useContext(UserContext)
  const navigate = useNavigate();
  
  return (
    <div className="bg-[#191924] w-full h-20 flex justify-center items-center font-medium pt-0 text-gray-200">
      <div className='w-11/12 mx-auto max-w-[1160px] flex justify-between items-center'>
        <img className='h-16 w-16' src={logo} alt="" />
        <ul className='flex gap-x-6 items-center'>
          <li>
            <Link to='/'>Home</Link>
          </li>
          {
            isLoggedIn && 
            (
            <li className='flex gap-4'>
              <Link to='/login'>
                <button onClick={() => {
                  setIsLoggedIn(false)
                  }} className='bg-[#29303D] py-[8px] px-[12px] rounded-[8px] hover:bg-slate-700 transition-all'>Sign Out</button>
              </Link>
              <Link to='/dashboard'>
                <button onClick={() => {
                  { navigate('/dashboard') }
                  }} className='bg-[#29303D] py-[8px] px-[12px] rounded-[8px] hover:bg-slate-700 transition-all'>Dashboard</button>
              </Link>
            </li>
            )
          }
          {
            !isLoggedIn &&
            (
            <>
            <li>
            <Link to='/login'>
              <button className='bg-[#29303D] py-[8px] px-[12px] rounded-[8px] hover:bg-slate-700 transition-all'>Login</button>
            </Link>
            </li>
            <li>
              <Link to='/signup'>
                <button className='bg-[#29303D] py-[8px] px-[12px] rounded-[8px] hover:bg-slate-700 transition-all'>SignUp</button>
              </Link>
            </li>
            </>
            )
          }
        </ul>
      </div>
    </div>
  )
}

export default Navbar