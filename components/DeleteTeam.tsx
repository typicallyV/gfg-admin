'use client'

import { useState } from 'react'
import { RoleType } from '@/types/Domain'

const DeleteTeam = () => {
  const [teamId, setTeamId] = useState<string>('')
  const [roleType, setRoleType] = useState<RoleType>('member')
  const [status, setStatus] = useState<'idle' | 'success'>('idle')
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleDelete = async () => {
    if (!teamId.trim()) return

    const roleLabel = roleType === 'leaders' ? 'Leader' : roleType === 'mentors' ? 'Mentor' : 'Member'
    if (!window.confirm(`Are you sure you want to delete this ${roleLabel}?`)) {
      return
    }

    setIsDeleting(true)
    setErrorMessage('')

    try {
      const response = await fetch(`/api/admin/teams/${roleType}/${teamId.trim()}`, {
        method: 'DELETE',
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to delete. Please check the ID and try again.')
      }

      setStatus('success')
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to delete.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setTeamId('')
    setErrorMessage('')
  }

  const roleLabel = roleType === 'leaders' ? 'Leader' : roleType === 'mentors' ? 'Mentor' : 'Member'

  return (
    <div className='flex justify-center items-start px-4 py-6'>
      <div className='w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden'>
        {/* Header */}
        <div className='px-8 py-5 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60'>
          <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100'>Delete Team</h2>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 mt-0.5'>Select type and delete by ID</p>
        </div>

        {status === 'idle' && (
          <div className='px-8 py-6 flex flex-col gap-4'>
            {errorMessage && (
              <div className='rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300'>
                {errorMessage}
              </div>
            )}

            {/* Role Type */}
            <div>
              <label htmlFor="position" className='block text-sm mb-1 text-neutral-700 dark:text-neutral-300'>Type</label>
              <select
                id="position"
                value={roleType}
                onChange={(e) => setRoleType(e.target.value as RoleType)}
                className='w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-green-500'
              >
                <option value="member">Member</option>
                <option value="leaders">Leader (President / VP)</option>
                <option value="mentors">Mentor</option>
              </select>
            </div>

            {/* Team ID */}
            <div>
              <label className='block text-sm mb-1 text-neutral-700 dark:text-neutral-300'>Team / Member ID</label>
              <input
                type="text"
                value={teamId}
                onChange={(e) => {
                  setTeamId(e.target.value)
                  setErrorMessage('')
                }}
                placeholder='Enter ID'
                className='w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={isDeleting || !teamId.trim()}
              className='px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg font-medium transition'
            >
              {isDeleting ? 'Deleting...' : `Delete ${roleLabel}`}
            </button>
          </div>
        )}

        {status === 'success' && (
          <div className='px-8 py-6 space-y-4'>
            <h3 className='text-green-600 font-semibold'>Deleted Successfully</h3>
            <p className='text-sm text-neutral-500 dark:text-neutral-400'>
              {roleLabel} with ID &quot;{teamId}&quot; has been deleted.
            </p>
            <button
              onClick={handleReset}
              className='px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition'
            >
              Delete Another
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeleteTeam
