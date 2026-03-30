import Link from 'next/link'
import React from 'react'

const LoginPage = () => {
  return (
    <div>
      <Link href="/dashboard/teams">
        Go to Dashboard
      </Link>
    </div>
  )
}

export default LoginPage