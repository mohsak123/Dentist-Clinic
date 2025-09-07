"use client"

import { useAuth } from '@/context/AuthContext';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React from 'react'
import LogoutDialog from '../dialog/LogoutDialog';

const NavbarDoctor = () => {
  const router = useRouter();

  const handleLogoutSuccess = () => {
    router.push('/');
  };

  return (
    <div>
      <div className='flex items-center justify-between px-4 sm:px-10 py-3 border-b bg-white'>
        <Link href="/" className='flex items-center gap-2 text-xs'>
          <Image src="/images/logo.svg" alt='logo' width={217} height={46}
            className='w-36 md:w-40 cursor-pointer'
          />
          <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>Doctor</p>
        </Link>
        
        <LogoutDialog onLogoutSuccess={handleLogoutSuccess}>
          <button className='bg-mainColor text-white text-sm px-10 py-2 rounded-full'>
            Logout
          </button>
        </LogoutDialog>

      </div>
    </div>
  )
}

export default NavbarDoctor
