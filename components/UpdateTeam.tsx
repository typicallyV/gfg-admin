'use client'

import { useState } from 'react'
import UpdateTeamForm from './UpdateTeamForm'
import { RoleType, TeamMember } from '@/types/Domain'

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200'

const sectionHeadingClass =
  'text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400 mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700'

const UpdateTeam = () => {
  const [teamFound, setTeamFound] = useState<boolean>(false)
  const [teamId, setTeamId] = useState<string>('')
  const [roleType, setRoleType] = useState<RoleType>('member')
  const [memberData, setMemberData] = useState<(TeamMember & { domain?: string }) | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamId.trim()) return

    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch(`/api/admin/teams/${roleType}/${teamId.trim()}`, {
        method: 'GET',
      })
      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.member) {
        throw new Error(data?.error || 'Team member not found. Please verify the ID.')
      }

      setTeamFound(true)
      setMemberData(data.member)
    } catch (error: unknown) {
      setTeamFound(false)
      setMemberData(null)
      setErrorMessage(error instanceof Error ? error.message : 'Unable to find team member.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setTeamFound(false)
    setTeamId('')
    setMemberData(null)
    setErrorMessage('')
  }

  return (
    <div className='flex justify-center items-start px-4 py-6'>
      <div className='w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden'>
        {/* Header */}
        <div className='px-8 py-5 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 flex items-center justify-between'>
          <div>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100'>
              Update Team
            </h2>
            <p className='text-sm text-neutral-500 dark:text-neutral-400 mt-0.5'>
              Look up a team member by ID, then edit details.
            </p>
          </div>
          {teamFound && (
            <button
              onClick={handleReset}
              className='text-xs px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition'
            >
              Search Another
            </button>
          )}
        </div>

        {!teamFound ? (
          <form onSubmit={handleSubmit}>
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
                  <option value="leaders">Leader (President / VP)</option>
                  <option value="mentors">Mentor</option>
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
                    setErrorMessage('')
                  }}
                  required
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className='shrink-0 px-5 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 disabled:opacity-50 text-neutral-800 dark:text-neutral-100 text-sm font-medium border border-neutral-300 dark:border-neutral-600 transition-colors duration-200'
                >
                  {isLoading ? 'Finding...' : 'Find'}
                </button>
              </div>

              {errorMessage && (
                <p className='mt-3 text-sm text-rose-600 dark:text-rose-400'>
                  {errorMessage}
                </p>
              )}
            </section>
          </form>
        ) : (
          <div className='px-8 py-6'>
            <UpdateTeamForm
              roleType={roleType}
              memberData={memberData}
              onSuccess={handleReset}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default UpdateTeam
