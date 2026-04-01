'use client'

import { useState } from 'react'
import TeamForm from './TeamForm'

type RoleType = 'leader' | 'member'

const AddTeam = () => {
  const [roleType, setRoleType] = useState<RoleType>('member')

  return (
    <div className='flex justify-center items-start px-4 py-6'>
      <div className='w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden'>

        {/* Header */}
        <div className='px-8 py-5 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60'>
          <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100'>
            Add Team Member
          </h2>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 mt-0.5'>
            Select role and fill details.
          </p>
        </div>

        {/* Role Selection */}
        <div className='px-8 pt-6'>
          <label
            htmlFor="roleType"
            className='block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300'
          >
            Select Type
          </label>

          <select
            id="roleType"
            value={roleType}
            onChange={(e) => setRoleType(e.target.value as RoleType)}
            className='w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-green-500'
          >
            <option value="member">Member</option>
            <option value="leader">Leader (President / VP)</option>
          </select>
        </div>

        {/* Form */}
        <div className='px-8 py-6'>
          <TeamForm roleType={roleType} />
        </div>

      </div>
    </div>
  )
}

export default AddTeam