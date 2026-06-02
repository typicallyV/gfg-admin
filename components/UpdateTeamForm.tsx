'use client'

import { useState, useEffect } from 'react'

type RoleType = 'leaders' | 'member'

interface Props {
  roleType: RoleType
  memberData: any
}

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-green-500'

const labelClass =
  'block mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300'

const sectionHeadingClass =
  'text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400 mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700'

const UpdateTeamForm = ({ roleType, memberData }: Props) => {
  const [formData, setFormData] = useState({
    firstname: memberData?.firstname || '',
    lastname: memberData?.lastname || '',
    email: memberData?.email || '',
    domain: memberData?.domain || '',
    linkedinUrl: memberData?.linkedinUrl || '',
    githubUrl: memberData?.githubUrl || '',
    role: memberData?.role || '',
    photo: null as File | null,
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form Data:', formData)
    const imageFormData = new FormData();
    imageFormData.append('photo', formData.photo as Blob);
    const imageUrl = await fetch('/api/admin/create-image-url', {
      method: 'POST',
      body: imageFormData
    })
    formData.photo = (await imageUrl.json()).url;
    console.log('Image URL:', formData.photo)
    const response = await fetch(`/api/admin/teams/${roleType}/${memberData?._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    console.log('Response:', response)
  };

  // 🔥 Reset when role changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: '',
      domain: '',
    }))
  }, [roleType])

  return (
    <div className='flex justify-center items-start px-4 py-6'>
      <form onSubmit={(e) => handleSubmit(e)} className='px-8 py-7 space-y-8 w-full'>
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
            >
              <option value="">Select Role</option>

              {roleType === 'leaders' ? (
                <>
                  <option value="President">President</option>
                  <option value="VicePresident">Vice President</option>
                </>
              ) : (
                <>
                  <option value="Lead">Lead</option>
                  <option value="Member">Member</option>
                </>
              )}
            </select>
          </div>
        </section>

        {/* 🔹 Basic Info */}
        <section>
          <h3 className={sectionHeadingClass}>Basic Info</h3>

          <div className='space-y-5'>

            <div>
              <label htmlFor="firstname" className={labelClass}>First Name</label>
              <input
                id="firstname"
                className={inputClass}
                placeholder='First name'
                value={formData.firstname}
                onChange={(e) => handleChange('firstname', e.target.value)}
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
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>Email</label>
              <input
                id="email"
                className={inputClass}
                placeholder='Enter email'
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
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

          <div className='space-y-5'>
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

        {/* 🔹 Photo Upload (Styled Box) */}
        <section>
          <h3 className={sectionHeadingClass}>Photo</h3>

          <div>
            <label className={labelClass}>Upload Photo</label>

            <label className='flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 hover:border-green-500 dark:hover:border-green-500 cursor-pointer transition duration-200'>

              <div className='flex flex-col items-center justify-center gap-1 text-neutral-500 dark:text-neutral-400'>

                {formData.photo ? (
                  <span className='text-sm font-medium text-green-600 dark:text-green-400'>
                    {formData.photo.name}
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

                    <span className='text-sm'>Click to upload an image</span>
                    <span className='text-xs'>PNG, JPG, WEBP up to 10 MB</span>
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
          className='w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold'
        >
          Add {roleType === 'leaders' ? 'Leaders' : 'Member'}
        </button>

      </form>
    </div>
  )
}

export default UpdateTeamForm