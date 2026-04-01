'use client'

import { useState } from 'react'

const DeleteTeam = () => {
  const [teamId, setTeamId] = useState<string>('')
  const [roleType, setRoleType] = useState<'leader' | 'member'>('member')
  const [status, setStatus] = useState<'idle' | 'success'>('idle')

  const handleDelete = () => {
    // later replace with API call
    if (!teamId) return
    setStatus('success')
  }

  return (
    <div className='flex justify-center items-start px-4 py-6'>
      <div className='w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden'>

        {/* Header */}
        <div className='px-8 py-5 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60'>
          <h2 className='text-xl font-semibold'>Delete Team</h2>
          <p className='text-sm text-neutral-500'>Select type and delete by ID</p>
        </div>

        {status === 'idle' && (
          <div className='px-8 py-6 flex flex-col gap-4'>

            {/* Role Type */}
            <div>
              <label htmlFor="position" className='block text-sm mb-1'>Type</label>
              <select
                id="position"
                value={roleType}
                onChange={(e) => setRoleType(e.target.value as 'leader' | 'member')}
                className='w-full px-4 py-2 border rounded-lg'
              >
                <option value="member">Member</option>
                <option value="leader">Leader</option>
              </select>
            </div>

            {/* Team ID */}
            <div>
              <label className='block text-sm mb-1'>Team ID</label>
              <input
                type="text"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                placeholder='Enter Team ID'
                className='w-full px-4 py-2 border rounded-lg'
              />
            </div>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className='px-5 py-2 bg-red-500 text-white rounded-lg'
            >
              Delete {roleType === 'leader' ? 'Leader' : 'Member'}
            </button>
          </div>
        )}

        {status === 'success' && (
          <div className='px-8 py-6'>
            <h3 className='text-green-600 font-semibold'>Deleted Successfully</h3>
            <p className='text-sm text-neutral-500'>
              {roleType} with ID "{teamId}" deleted.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default DeleteTeam