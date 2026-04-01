'use client'

import { useState } from 'react'
import TeamForm from './TeamForm'

type RoleType = 'leader' | 'member'

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200'

const sectionHeadingClass =
  'text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400 mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700'

const UpdateTeam = () => {
  const [teamFound, setTeamFound] = useState<boolean>(false)
  const [teamId, setTeamId] = useState<string>('')
  const [roleType, setRoleType] = useState<RoleType>('member')

  return (
    <div className='flex justify-center items-start px-4 py-6'>
      <div className='w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden'>

        {/* Header */}
        <div className='px-8 py-5 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60'>
          <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100'>
            Update Team
          </h2>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 mt-0.5'>
            Look up a team member by ID, then edit details.
          </p>
        </div>

        <form>
          {!teamFound && (
            <section className='px-8 py-6'>
              <h3 className={sectionHeadingClass}>Look Up Team</h3>

              {/* 🔽 Role Selection */}
              <div className='mb-4'>
                <label
                  htmlFor="roleType"
                  className='block text-sm mb-1 text-neutral-700 dark:text-neutral-300'
                >
                  Select Type
                </label>

                <select
                  id="roleType"
                  value={roleType}
                  onChange={(e) => setRoleType(e.target.value as RoleType)}
                  className={inputClass}
                >
                  <option value="member">Member</option>
                  <option value="leader">Leader (President / VP)</option>
                </select>
              </div>

              {/* 🔽 Team ID */}
              <div className='flex gap-3'>
                <input
                  className={inputClass}
                  type="text"
                  placeholder='Enter Team ID'
                  value={teamId}
                  onChange={(e) => {
                    setTeamId(e.target.value)
                    setTeamFound(false)
                  }}
                />

                <button
                  type="button"
                  onClick={() => setTeamFound(true)}
                  className='shrink-0 px-5 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 text-sm font-medium border border-neutral-300 dark:border-neutral-600 transition-colors duration-200'
                >
                  Find
                </button>
              </div>
            </section>
          )}

          {/* 🔽 Form after finding */}
          {teamFound && (
            <div className='px-8 py-6'>
              <TeamForm roleType={roleType} />
            </div>
          )}
        </form>

      </div>
    </div>
  )
}

export default UpdateTeam