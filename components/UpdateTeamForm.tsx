'use client'

import { useState, useEffect } from 'react'
import { RoleType, TeamMember } from '@/types/Domain'

interface Props {
  roleType: RoleType
  memberData: (TeamMember & { domain?: string }) | null
  onSuccess?: () => void
}

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-green-500'

const labelClass =
  'block mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300'

const sectionHeadingClass =
  'text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400 mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700'

const UpdateTeamForm = ({ roleType, memberData, onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    firstname: memberData?.firstname || '',
    lastname: memberData?.lastname || '',
    domain: memberData?.domain || '',
    linkedinUrl: memberData?.linkedinUrl || '',
    githubUrl: memberData?.githubUrl || '',
    role: roleType === 'mentors' ? 'Mentor' : (memberData?.role || ''),
    photo: null as File | null,
  })

  const [existingPhoto, setExistingPhoto] = useState<string>(memberData?.photo || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setFormData({
      firstname: memberData?.firstname || '',
      lastname: memberData?.lastname || '',
      domain: memberData?.domain || '',
      linkedinUrl: memberData?.linkedinUrl || '',
      githubUrl: memberData?.githubUrl || '',
      role: roleType === 'mentors' ? 'Mentor' : (memberData?.role || ''),
      photo: null,
    })
    setExistingPhoto(memberData?.photo || '')
    setSuccessMessage('')
    setErrorMessage('')
  }, [memberData, roleType])

  const handleChange = (field: string, value: string | File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      if (!memberData?._id) {
        throw new Error('Member ID is missing.')
      }

      if (!formData.firstname.trim() || !formData.lastname.trim()) {
        throw new Error('First name and last name are required.')
      }

      const role = roleType === 'mentors' ? 'Mentor' : formData.role.trim()
      if (!role) {
        throw new Error('Role is required.')
      }

      if (roleType === 'member' && !formData.domain.trim()) {
        throw new Error('Domain is required for team members.')
      }

      let photoUrl = existingPhoto

      if (formData.photo) {
        const imageFormData = new FormData()
        imageFormData.append('photo', formData.photo)

        const imageRes = await fetch('/api/admin/create-image-url', {
          method: 'POST',
          body: imageFormData,
        })

        if (!imageRes.ok) {
          const errorData = await imageRes.json().catch(() => null)
          throw new Error(errorData?.error || 'Failed to upload new photo.')
        }

        const imageData = await imageRes.json()
        photoUrl = imageData.url
      }

      const payload = {
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        role,
        photo: photoUrl,
        linkedinUrl: formData.linkedinUrl.trim() || undefined,
        githubUrl: formData.githubUrl.trim() || undefined,
        ...(roleType === 'member' ? { domain: formData.domain } : {}),
      }

      const response = await fetch(`/api/admin/teams/${roleType}/${memberData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const responseData = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(responseData?.error || 'Failed to update details.')
      }

      setSuccessMessage('Updated successfully!')
      setExistingPhoto(photoUrl)
      onSuccess?.()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex justify-center items-start'>
      <form onSubmit={handleSubmit} className='space-y-6 w-full'>
        {successMessage && (
          <div className='rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'>
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className='rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300'>
            {errorMessage}
          </div>
        )}

        {/* 🔹 Role Section */}
        <section>
          <h3 className={sectionHeadingClass}>Role</h3>

          <div>
            <label htmlFor="role" className={labelClass}>Role</label>

            <select
              id="role"
              className={inputClass}
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              required
            >
              <option value="">Select Role</option>

              {roleType === 'leaders' && (
                <>
                  <option value="President">President</option>
                  <option value="VicePresident">Vice President</option>
                </>
              )}

              {roleType === 'member' && (
                <>
                  <option value="Lead">Lead</option>
                  <option value="Member">Member</option>
                </>
              )}

              {roleType === 'mentors' && (
                <option value="Mentor">Mentor</option>
              )}
            </select>
          </div>
        </section>

        {/* 🔹 Basic Info */}
        <section>
          <h3 className={sectionHeadingClass}>Basic Info</h3>

          <div className='space-y-4'>
            <div>
              <label htmlFor="firstname" className={labelClass}>First Name</label>
              <input
                id="firstname"
                className={inputClass}
                placeholder='First name'
                value={formData.firstname}
                onChange={(e) => handleChange('firstname', e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="lastname" className={labelClass}>Last Name</label>
              <input
                id="lastname"
                className={inputClass}
                placeholder='Last name'
                value={formData.lastname}
                onChange={(e) => handleChange('lastname', e.target.value)}
                required
              />
            </div>

            {/* 🔹 Domain ONLY for member */}
            {roleType === 'member' && (
              <div>
                <label htmlFor="domain" className={labelClass}>Domain</label>

                <select
                  id="domain"
                  className={inputClass}
                  value={formData.domain}
                  onChange={(e) => handleChange('domain', e.target.value)}
                  required
                >
                  <option value="">Select Domain</option>
                  <option value="Technical">Technical</option>
                  <option value="Management">Management</option>
                  <option value="Publicity">Public Relation</option>
                  <option value="Media">Media</option>
                  <option value="Graphic">Graphics</option>
                </select>
              </div>
            )}
          </div>
        </section>

        {/* 🔹 Links */}
        <section>
          <h3 className={sectionHeadingClass}>Links</h3>

          <div className='space-y-4'>
            <div>
              <label htmlFor="linkedin" className={labelClass}>LinkedIn</label>
              <input
                id="linkedin"
                className={inputClass}
                placeholder='LinkedIn URL'
                value={formData.linkedinUrl}
                onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="github" className={labelClass}>GitHub</label>
              <input
                id="github"
                className={inputClass}
                placeholder='GitHub URL'
                value={formData.githubUrl}
                onChange={(e) => handleChange('githubUrl', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* 🔹 Photo Upload */}
        <section>
          <h3 className={sectionHeadingClass}>Photo</h3>

          <div>
            <label className={labelClass}>Photo (optional to change)</label>

            <label className='flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 hover:border-green-500 dark:hover:border-green-500 cursor-pointer transition duration-200'>
              <div className='flex flex-col items-center justify-center gap-1 text-neutral-500 dark:text-neutral-400'>
                {formData.photo ? (
                  <span className='text-sm font-medium text-green-600 dark:text-green-400'>
                    New: {formData.photo.name}
                  </span>
                ) : existingPhoto ? (
                  <span className='text-sm text-neutral-600 dark:text-neutral-400'>
                    Current photo attached (click to change)
                  </span>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className='w-7 h-7'
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    <span className='text-sm'>Click to upload a new image</span>
                  </>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                className='hidden'
                onChange={(e) =>
                  handleChange('photo', e.target.files?.[0] || null)
                }
              />
            </label>
          </div>
        </section>

        {/* 🔹 Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className='w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition'
        >
          {isSubmitting ? 'Saving changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

export default UpdateTeamForm
