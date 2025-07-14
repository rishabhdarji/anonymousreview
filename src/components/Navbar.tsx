"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut} from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@react-email/components'

function Navbar() {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className="p-4 md:p-6 bg-gray-800 text-white flex justify-between items-center">
    <div className='container mx-auto flex items-center justify-between flex-col md:flex-row'>
      <a href="#">Crypt Leap</a>
      {
        session ? (
          <>
          <span className="mr-4">
            Welcome, {user?.username || user?.email}!
          </span>
          <Button className='w-full md:w-auto'
            onClick={() => signOut()}
            style={{ marginLeft: '10px' }}
          >
            Sign Out
          </Button>
          </>
        ) : (
          <Link href="/sign-in">
          <Button className='w-full md:w-auto'>
            Login
          </Button>
          </Link>
        )
      }
    </div>
    </nav>
  )
}

export default Navbar