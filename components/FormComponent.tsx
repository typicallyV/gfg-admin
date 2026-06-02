'use client'

import { FormEvent, useState } from 'react'

const inputClass =
    'w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200'

const labelClass = 'block mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300'

const sectionHeadingClass =
    'text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400 mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700'


const FormComponent = ({ type, onSuccess }: { type: string; onSuccess?: () => void }) => {
    const [eventName, setEventName] = useState('')
    const [eventDesc, setEventDesc] = useState('')
    const [eventShortDesc, setEventShortDesc] = useState('')
    const [eventStartDate, setEventStartDate] = useState('')
    const [eventEndDate, setEventEndDate] = useState('')
    const [eventImage, setEventImage] = useState<File | null>(null)
    const [eventGallery, setEventGallery] = useState<File[]>([])
    const [eventVenue, setEventVenue] = useState('')
    const [eventType, setEventType] = useState<'solo' | 'team' | ''>('')
    const [eventTheme, setEventTheme] = useState('')
    const [eventAudience, setEventAudience] = useState<'rbu' | 'intercollege' | 'both' | ''>('')
    const [eventTeamSize, setEventTeamSize] = useState(1)
    const [eventPricing, setEventPricing] = useState('')
    const [eventRegistrationFee, setEventRegistrationFee] = useState('')
    const [eventRegistrationCount, setEventRegistrationCount] = useState(0)
    const [eventRegistrationStatus, setEventRegistrationStatus] = useState<'open' | 'closed' | ''>('')

    const [isUploading, setIsUploading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const parseMoney = (value: string) => {
        const numericValue = Number(value.replace(/[^\d]/g, ''))
        return Number.isFinite(numericValue) ? numericValue : 0
    }

    const parseDateTime = (value: string) => {
        const date = new Date(value)
        return Number.isNaN(date.getTime()) ? '' : date.toISOString()
    }

    const uploadSingleFile = async (file: File) => {
        const formData = new FormData()
        formData.append('photo', file)

        const res = await fetch('/api/admin/create-image-url', {
            method: 'POST',
            body: formData,
        })

        if (!res.ok) {
            const text = await res.text()
            throw new Error(text || 'Upload failed')
        }

        const data = await res.json()
        return data as { url: string; publicId: string }
    }

    const removeBanner = async () => {
        setEventImage(null)
    }

    const removeGalleryImage = async (idx: number) => {
        setEventGallery((prev) => prev.filter((_, i) => i !== idx))
    }

    const resetForm = () => {
        setEventName('')
        setEventDesc('')
        setEventShortDesc('')
        setEventStartDate('')
        setEventEndDate('')
        setEventImage(null)
        setEventGallery([])
        setEventVenue('')
        setEventType('')
        setEventTheme('')
        setEventAudience('')
        setEventTeamSize(1)
        setEventPricing('')
        setEventRegistrationFee('')
        setEventRegistrationCount(0)
        setEventRegistrationStatus('')
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsUploading(true)
        setErrorMessage('')
        setSuccessMessage('')

        try {
            if (!eventImage) {
                throw new Error('Event banner is required')
            }

            if (!eventType) throw new Error('Event type is required')
            if (!eventAudience) throw new Error('Target audience is required')
            if (!eventRegistrationStatus) throw new Error('Registration status is required')

            const bannerResult = await uploadSingleFile(eventImage)
            const galleryResults = await Promise.all(
                eventGallery.map((file) => uploadSingleFile(file))
            )

            const pricingFee = parseMoney(eventPricing)
            const registrationFee = parseMoney(eventRegistrationFee)

            const payload = {
                name: eventName.trim(),
                description: eventDesc.trim(),
                shortDescription: eventShortDesc.trim(),
                image: {
                    url: bannerResult.url,
                    publicId: bannerResult.publicId,
                },
                gallery: galleryResults.map((item) => ({
                    url: item.url,
                    publicId: item.publicId,
                })),
                startDate: parseDateTime(eventStartDate),
                endDate: parseDateTime(eventEndDate),
                venue: eventVenue.trim(),
                type: eventType,
                theme: eventTheme.trim(),
                audience: eventAudience || undefined,
                teamSize: {
                    min: eventTeamSize,
                    max: eventTeamSize,
                },
                pricing: {
                    rbu: {
                        isPaid: pricingFee > 0,
                        fee: pricingFee,
                    },
                    intercollege: {
                        isPaid: pricingFee > 0,
                        fee: pricingFee,
                    },
                },
                registrationFee,
                registrationsCount: eventRegistrationCount,
                registrationStatus: eventRegistrationStatus,
            }

            const response = await fetch('/api/admin/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const responseData = await response.json()

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to create event')
            }

            resetForm()
            setSuccessMessage(responseData?.success ? 'Event created successfully.' : 'Event submitted.')
            onSuccess?.()
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : 'Failed to submit event')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className='flex justify-center items-start px-4 py-6'>
            <form className='px-8 py-7 space-y-8' onSubmit={handleSubmit}>
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
                                type="text"
                                placeholder='e.g. Hawkins Heist'
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Short Description</label>
                            <input
                                className={inputClass}
                                type="text"
                                placeholder='A brief one-line summary'
                                value={eventShortDesc}
                                onChange={(e) => setEventShortDesc(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Full Description</label>
                            <textarea
                                className={`${inputClass} resize-none`}
                                rows={4}
                                placeholder='Describe the event in detail...'
                                value={eventDesc}
                                onChange={(e) => setEventDesc(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className={sectionHeadingClass}>Schedule</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                        <div>
                            <label htmlFor="start-date" className={labelClass}>Start Date</label>
                            <input
                                className={inputClass}
                                type="date"
                                id="start-date"
                                value={eventStartDate}
                                onChange={(e) => setEventStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="end-date" className={labelClass}>End Date</label>
                            <input
                                className={inputClass}
                                type="date"
                                id="end-date"
                                value={eventEndDate}
                                onChange={(e) => setEventEndDate(e.target.value)}
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
                                type="text"
                                placeholder='e.g. DT 702'
                                value={eventVenue}
                                onChange={(e) => setEventVenue(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Type</label>
                            <select
                                className={inputClass}
                                value={eventType}
                                onChange={(e) => setEventType(e.target.value as 'solo' | 'team' | '')}
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
                                type="text"
                                placeholder='e.g. Stranger Things'
                                value={eventTheme}
                                onChange={(e) => setEventTheme(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Target Audience</label>
                            <select
                                className={inputClass}
                                value={eventAudience}
                                onChange={(e) => setEventAudience(e.target.value as 'rbu' | 'intercollege' | 'both' | '')}
                            >
                                <option value=''>Select audience</option>
                                <option value='rbu'>RBU</option>
                                <option value='intercollege'>Intercollege</option>
                                <option value='both'>Both</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Team Size</label>
                            <input
                                className={inputClass}
                                type="number"
                                placeholder='e.g. 4'
                                value={eventTeamSize}
                                onChange={(e) => setEventTeamSize(Number(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className={sectionHeadingClass}>Registration</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                        <div>
                            <label className={labelClass}>Pricing</label>
                            <input
                                className={inputClass}
                                type="text"
                                placeholder='e.g. Free or 199'
                                value={eventPricing}
                                onChange={(e) => setEventPricing(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Registration Fee</label>
                            <input
                                className={inputClass}
                                type="text"
                                placeholder='e.g. 0 or 150'
                                value={eventRegistrationFee}
                                onChange={(e) => setEventRegistrationFee(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Registration Count</label>
                            <input
                                className={inputClass}
                                type="number"
                                placeholder='e.g. 200'
                                value={eventRegistrationCount}
                                onChange={(e) => setEventRegistrationCount(parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Registration Status</label>
                            <select
                                className={inputClass}
                                value={eventRegistrationStatus}
                                onChange={(e) => setEventRegistrationStatus(e.target.value as 'open' | 'closed' | '')}
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
                            {eventImage ? (
                                <div className='relative w-full h-32 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800'>
                                    <img
                                        src={URL.createObjectURL(eventImage)}
                                        alt={eventImage.name}
                                        className='w-full h-full object-cover'
                                        onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                    />
                                    <button
                                        type='button'
                                        onClick={removeBanner}
                                        className='absolute top-2 right-2 p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors duration-150'
                                        title='Remove banner'
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className='w-4 h-4' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <span className='absolute bottom-0 left-0 right-0 px-2 py-1 text-[10px] text-white bg-black/50 truncate'>{eventImage.name}</span>
                                </div>
                            ) : (
                                <label className='flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 hover:border-green-500 dark:hover:border-green-500 cursor-pointer transition duration-200'>
                                    <div className='flex flex-col items-center justify-center gap-1 text-neutral-500 dark:text-neutral-400'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className='w-7 h-7' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                        <span className='text-sm'>Click to upload an image</span>
                                        <span className='text-xs'>PNG, JPG, WEBP up to 10 MB</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className='hidden'
                                        onChange={(e) => setEventImage(e.target.files?.[0] ?? null)}
                                    />
                                </label>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Event Gallery</label>
                            <label className='flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 hover:border-green-500 dark:hover:border-green-500 cursor-pointer transition duration-200'>
                                <div className='flex flex-col items-center justify-center gap-1 text-neutral-500 dark:text-neutral-400'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='w-7 h-7' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V9.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                    <span className='text-sm'>Click to upload gallery images</span>
                                    <span className='text-xs'>PNG, JPG, WEBP up to 10 MB each — multiple allowed</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className='hidden'
                                    onChange={(e) => {
                                        const incoming = Array.from(e.target.files ?? []);
                                        setEventGallery((prev) => {
                                            const existingNames = new Set(prev.map((f) => f.name));
                                            const unique = incoming.filter((f) => !existingNames.has(f.name));
                                            return [...prev, ...unique];
                                        });
                                        e.target.value = '';
                                    }}
                                />
                            </label>

                            {eventGallery.length > 0 && (
                                <div className='mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3'>
                                    {eventGallery.map((file, idx) => {
                                        const url = URL.createObjectURL(file);
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
                                                        onClick={() => removeGalleryImage(idx)}
                                                        className='p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors duration-150'
                                                        title='Remove image'
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className='w-4 h-4' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <span className='absolute bottom-0 left-0 right-0 px-2 py-1 text-[10px] text-white bg-black/50 truncate'>{file.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <button
                    className='w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold tracking-wide transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
                    type="submit"
                    disabled={isUploading}
                >
                    {isUploading ? 'Uploading...' : `${type} Event`}
                </button>

            </form>
        </div>
    )
}

export default FormComponent