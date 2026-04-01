import React from 'react'
import TeamNavbar from '@/components/TeamNavbar'

const page = () => {
  return (
    <div>
      <TeamNavbar />
      <div className="p-4">
        <h2 className="text-xl font-bold">Team Management</h2>
        <p>Welcome to the Team Management page!</p>
      </div>
    </div>
  )
}

export default page