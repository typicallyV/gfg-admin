'use client'

import { useEffect, useState } from 'react'

type EventType = 'solo' | 'team'
type EventAudience = 'rbu' | 'intercollege' | 'both'
type EventStatus = 'open' | 'closed'

type EventImage = {
  url: string
  publicId: string
}

type EventData = {
  _id?: string
  name?: string
  description?: string
  shortDescription?: string
  startDate?: string
  endDate?: string
  image?: EventImage
  gallery?: EventImage[]
  venue?: string
  type?: EventType
  theme?: string
  audience?: EventAudience
  teamSize?: {
    min?: number
    max?: number
  }
  pricing?: {
    rbu?: {
      isPaid?: boolean
      fee?: number
      qrCode?: EventImage
    }
    intercollege?: {
      isPaid?: boolean
      fee?: number
      qrCode?: EventImage
    }
  }
  registrationFee?: number
  registrationsCount?: number
  registrationStatus?: EventStatus
}

interface Props {
  eventData: EventData
  onSuccess?: () => void
}

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200'

const labelClass = 'block mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300'

const sectionHeadingClass =
  'text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400 mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700'

const UpdateEventForm = ({ eventData, onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    name: eventData?.name || '',
    description: eventData?.description || '',
    shortDescription: eventData?.shortDescription || '',
    startDate: eventData?.startDate ? String(eventData.startDate).slice(0, 10) : '',
    endDate: eventData?.endDate ? String(eventData.endDate).slice(0, 10) : '',
    venue: eventData?.venue || '',
    type: eventData?.type || '',
    theme: eventData?.theme || '',
    audience: eventData?.audience || '',
    teamSizeMin: eventData?.teamSize?.min ?? 1,
    teamSizeMax: eventData?.teamSize?.max ?? 1,
    pricingRbuFee: String(eventData?.pricing?.rbu?.fee ?? 0),
    pricingIntercollegeFee: String(eventData?.pricing?.intercollege?.fee ?? 0),
    registrationFee: String(eventData?.registrationFee ?? 0),
    registrationsCount: eventData?.registrationsCount ?? 0,
    registrationStatus: eventData?.registrationStatus || '',
    image: null as File | null,
    gallery: [] as File[],
  })

  const [existingImage, setExistingImage] = useState<EventImage | null>(eventData?.image || null)
  const [existingGallery, setExistingGallery] = useState<EventImage[]>(eventData?.gallery || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const uploadSingleFile = async (file: File) => {
    const imageFormData = new FormData()
    imageFormData.append('photo', file)

    const response = await fetch('/api/admin/create-image-url', {
      method: 'POST',
      body: imageFormData,
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || 'Image upload failed')
    }

    return (await response.json()) as EventImage
  }

  const parseDateTime = (value: string) => {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? '' : date.toISOString()
  }

  const parseMoney = (value: string) => {
    const numericValue = Number(value.replace(/[^\d]/g, ''))
    return Number.isFinite(numericValue) ? numericValue : 0
  }

  useEffect(() => {
    setFormData({
      name: eventData?.name || '',
      description: eventData?.description || '',
      shortDescription: eventData?.shortDescription || '',
      startDate: eventData?.startDate ? String(eventData.startDate).slice(0, 10) : '',
      endDate: eventData?.endDate ? String(eventData.endDate).slice(0, 10) : '',
      venue: eventData?.venue || '',
      type: eventData?.type || '',
      theme: eventData?.theme || '',
      audience: eventData?.audience || '',
      teamSizeMin: eventData?.teamSize?.min ?? 1,
      teamSizeMax: eventData?.teamSize?.max ?? 1,
      pricingRbuFee: String(eventData?.pricing?.rbu?.fee ?? 0),
      pricingIntercollegeFee: String(eventData?.pricing?.intercollege?.fee ?? 0),
      registrationFee: String(eventData?.registrationFee ?? 0),
      registrationsCount: eventData?.registrationsCount ?? 0,
      registrationStatus: eventData?.registrationStatus || '',
      image: null,
      gallery: [],
    })
    setExistingImage(eventData?.image || null)
    setExistingGallery(eventData?.gallery || [])
  }, [eventData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      if (!eventData?._id) {
        throw new Error('Event ID is missing')
      }

      if (!formData.name.trim()) throw new Error('Event name is required')
      if (!formData.description.trim()) throw new Error('Event description is required')
      if (!formData.shortDescription.trim()) throw new Error('Short description is required')
      if (!formData.startDate) throw new Error('Start date is required')
      if (!formData.endDate) throw new Error('End date is required')
      if (!formData.venue.trim()) throw new Error('Venue is required')
      if (!formData.type) throw new Error('Event type is required')
      if (!formData.theme.trim()) throw new Error('Theme is required')
      if (!formData.audience) throw new Error('Target audience is required')
      if (!formData.registrationStatus) throw new Error('Registration status is required')

      let uploadedImage = existingImage
      if (formData.image) {
        uploadedImage = await uploadSingleFile(formData.image)
      }

      const uploadedGallery = await Promise.all(formData.gallery.map((file) => uploadSingleFile(file)))

      if (!uploadedImage) {
        throw new Error('Event banner is required')
      }

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription.trim(),
        startDate: parseDateTime(formData.startDate),
        endDate: parseDateTime(formData.endDate),
        image: uploadedImage,
        gallery: [...existingGallery, ...uploadedGallery],
        venue: formData.venue.trim(),
        type: formData.type,
        theme: formData.theme.trim(),
        audience: formData.audience,
        teamSize: {
          min: Number(formData.teamSizeMin) || 1,
          max: Number(formData.teamSizeMax) || 1,
        },
        pricing: {
          rbu: {
            isPaid: parseMoney(formData.pricingRbuFee) > 0,
            fee: parseMoney(formData.pricingRbuFee),
          },
          intercollege: {
            isPaid: parseMoney(formData.pricingIntercollegeFee) > 0,
            fee: parseMoney(formData.pricingIntercollegeFee),
          },
        },
        registrationFee: parseMoney(formData.registrationFee),
        registrationsCount: Number(formData.registrationsCount) || 0,
        registrationStatus: formData.registrationStatus,
      }

      const response = await fetch(`/api/admin/events/${eventData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update event')
      }

      setSuccessMessage('Event updated successfully.')
      onSuccess?.()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update event')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex justify-center items-start px-4 py-6'>
      <form onSubmit={handleSubmit} className='px-8 py-7 space-y-8 w-full'>
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

        <section>
          <h3 className={sectionHeadingClass}>Basic Info</h3>
          <div className='space-y-5'>
            <div>
              <label className={labelClass}>Event Name</label>
              <input
                className={inputClass}
                type='text'
                placeholder='e.g. Hawkins Heist'
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Short Description</label>
              <input
                className={inputClass}
                type='text'
                placeholder='A brief one-line summary'
                value={formData.shortDescription}
                onChange={(e) => handleChange('shortDescription', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Full Description</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={4}
                placeholder='Describe the event in detail...'
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className={sectionHeadingClass}>Schedule</h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            <div>
              <label htmlFor='start-date' className={labelClass}>Start Date</label>
              <input
                className={inputClass}
                type='date'
                id='start-date'
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='end-date' className={labelClass}>End Date</label>
              <input
                className={inputClass}
                type='date'
                id='end-date'
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className={sectionHeadingClass}>Details</h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            <div>
              <label className={labelClass}>Venue</label>
              <input
                className={inputClass}
                type='text'
                placeholder='e.g. DT 702'
                value={formData.venue}
                onChange={(e) => handleChange('venue', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select
                className={inputClass}
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <option value=''>Select type</option>
                <option value='solo'>Solo</option>
                <option value='team'>Team</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Theme</label>
              <input
                className={inputClass}
                type='text'
                placeholder='e.g. Stranger Things'
                value={formData.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Target Audience</label>
              <select
                className={inputClass}
                value={formData.audience}
                onChange={(e) => handleChange('audience', e.target.value)}
              >
                <option value=''>Select audience</option>
                <option value='rbu'>RBU</option>
                <option value='intercollege'>Intercollege</option>
                <option value='both'>Both</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Min Team Size</label>
              <input
                className={inputClass}
                type='number'
                placeholder='e.g. 1'
                value={formData.teamSizeMin}
                onChange={(e) => handleChange('teamSizeMin', Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className={labelClass}>Max Team Size</label>
              <input
                className={inputClass}
                type='number'
                placeholder='e.g. 4'
                value={formData.teamSizeMax}
                onChange={(e) => handleChange('teamSizeMax', Number(e.target.value) || 0)}
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className={sectionHeadingClass}>Registration</h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            <div>
              <label className={labelClass}>RBU Pricing</label>
              <input
                className={inputClass}
                type='text'
                placeholder='e.g. 0 or 199'
                value={formData.pricingRbuFee}
                onChange={(e) => handleChange('pricingRbuFee', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Intercollege Pricing</label>
              <input
                className={inputClass}
                type='text'
                placeholder='e.g. 0 or 199'
                value={formData.pricingIntercollegeFee}
                onChange={(e) => handleChange('pricingIntercollegeFee', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Registration Fee</label>
              <input
                className={inputClass}
                type='text'
                placeholder='e.g. 0 or 150'
                value={formData.registrationFee}
                onChange={(e) => handleChange('registrationFee', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Registration Count</label>
              <input
                className={inputClass}
                type='number'
                placeholder='e.g. 200'
                value={formData.registrationsCount}
                onChange={(e) => handleChange('registrationsCount', Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className={labelClass}>Registration Status</label>
              <select
                className={inputClass}
                value={formData.registrationStatus}
                onChange={(e) => handleChange('registrationStatus', e.target.value)}
              >
                <option value=''>Select status</option>
                <option value='open'>Open</option>
                <option value='closed'>Closed</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <h3 className={sectionHeadingClass}>Media</h3>
          <div className='space-y-5'>
            <div>
              <label className={labelClass}>Event Banner / Poster</label>
              {formData.image ? (
                <div className='relative w-full h-32 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800'>
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt={formData.image.name}
                    className='w-full h-full object-cover'
                    onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                  />
                  <button
                    type='button'
                    onClick={() => handleChange('image', null)}
                    className='absolute top-2 right-2 p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors duration-150'
                    title='Remove banner'
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                  <span className='absolute bottom-0 left-0 right-0 px-2 py-1 text-[10px] text-white bg-black/50 truncate'>{formData.image.name}</span>
                </div>
              ) : existingImage ? (
                <div className='relative w-full h-32 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800'>
                  <img
                    src={existingImage.url}
                    alt='Existing event banner'
                    className='w-full h-full object-cover'
                  />
                  <button
                    type='button'
                    onClick={() => setExistingImage(null)}
                    className='absolute top-2 right-2 p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors duration-150'
                    title='Remove banner'
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className='flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 hover:border-green-500 dark:hover:border-green-500 cursor-pointer transition duration-200'>
                  <div className='flex flex-col items-center justify-center gap-1 text-neutral-500 dark:text-neutral-400'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='w-7 h-7' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5' />
                    </svg>
                    <span className='text-sm'>Click to upload an image</span>
                    <span className='text-xs'>PNG, JPG, WEBP up to 10 MB</span>
                  </div>
                  <input
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={(e) => handleChange('image', e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
            </div>

            <div>
              <label className={labelClass}>Event Gallery</label>
              <label className='flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 hover:border-green-500 dark:hover:border-green-500 cursor-pointer transition duration-200'>
                <div className='flex flex-col items-center justify-center gap-1 text-neutral-500 dark:text-neutral-400'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='w-7 h-7' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V9.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' />
                  </svg>
                  <span className='text-sm'>Click to upload gallery images</span>
                  <span className='text-xs'>PNG, JPG, WEBP up to 10 MB each — multiple allowed</span>
                </div>
                <input
                  type='file'
                  accept='image/*'
                  multiple
                  className='hidden'
                  onChange={(e) => {
                    const incoming = Array.from(e.target.files ?? [])
                    handleChange('gallery', [...formData.gallery, ...incoming])
                    e.target.value = ''
                  }}
                />
              </label>

              {(existingGallery.length > 0 || formData.gallery.length > 0) && (
                <div className='mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  {existingGallery.map((image, idx) => (
                    <div key={`${image.publicId}-${idx}`} className='relative group rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 aspect-video bg-neutral-100 dark:bg-neutral-800'>
                      <img src={image.url} alt={`Gallery ${idx + 1}`} className='w-full h-full object-cover' />
                      <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center'>
                        <button
                          type='button'
                          onClick={() => setExistingGallery((prev) => prev.filter((_, i) => i !== idx))}
                          className='p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors duration-150'
                          title='Remove image'
                        >
                          <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}

                  {formData.gallery.map((file, idx) => {
                    const url = URL.createObjectURL(file)
                    return (
                      <div key={`${file.name}-${idx}`} className='relative group rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 aspect-video bg-neutral-100 dark:bg-neutral-800'>
                        <img
                          src={url}
                          alt={file.name}
                          className='w-full h-full object-cover'
                          onLoad={() => URL.revokeObjectURL(url)}
                        />
                        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center'>
                          <button
                            type='button'
                            onClick={() => handleChange('gallery', formData.gallery.filter((_, i) => i !== idx))}
                            className='p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors duration-150'
                            title='Remove image'
                          >
                            <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                            </svg>
                          </button>
                        </div>
                        <span className='absolute bottom-0 left-0 right-0 px-2 py-1 text-[10px] text-white bg-black/50 truncate'>{file.name}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        <button
          className='w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold tracking-wide transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Event'}
        </button>
      </form>
    </div>
  )
}

export default UpdateEventForm