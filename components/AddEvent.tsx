'use client'

import React, { useState } from 'react'

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200'

const labelClass = 'block mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300'

const sectionHeadingClass =
  'text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400 mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700'

const AddEvent = () => {

  const [eventName, setEventName] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventShortDesc, setEventShortDesc] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [eventVenue, setEventVenue] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventTheme, setEventTheme] = useState('');
  const [eventAudience, setEventAudience] = useState('');
  const [eventTeamSize, setEventTeamSize] = useState(0);
  const [eventPricing, setEventPricing] = useState('');
  const [eventRegistrationFee, setEventRegistrationFee] = useState('');
  const [eventRegistrationCount, setEventRegistrationCount] = useState(0);
  const [eventRegistrationStatus, setEventRegistrationStatus] = useState('');

  return (
    <div className='flex justify-center items-start px-4 py-6'>
      <div className='w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden'>
        <div className='px-8 py-5 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60'>
          <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100'>Add New Event</h2>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 mt-0.5'>Fill in the details below to create a new event.</p>
        </div>

        <form className='px-8 py-7 space-y-8'>

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
                <label className={labelClass}>Start Date</label>
                <input
                  className={inputClass}
                  type="date"
                  value={eventStartDate}
                  onChange={(e) => setEventStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>End Date</label>
                <input
                  className={inputClass}
                  type="date"
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
                <input
                  className={inputClass}
                  type="text"
                  placeholder='e.g. Workshop, Hackathon'
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                />
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
                <input
                  className={inputClass}
                  type="text"
                  placeholder='e.g. All students'
                  value={eventAudience}
                  onChange={(e) => setEventAudience(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Team Size</label>
                <input
                  className={inputClass}
                  type="number"
                  placeholder='e.g. 4'
                  value={eventTeamSize}
                  onChange={(e) => setEventTeamSize(parseInt(e.target.value))}
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
                  placeholder='e.g. Free / ₹199'
                  value={eventPricing}
                  onChange={(e) => setEventPricing(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Registration Fee</label>
                <input
                  className={inputClass}
                  type="text"
                  placeholder='e.g. ₹0'
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
                <input
                  className={inputClass}
                  type="text"
                  placeholder='e.g. Open / Closed'
                  value={eventRegistrationStatus}
                  onChange={(e) => setEventRegistrationStatus(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className={sectionHeadingClass}>Media</h3>
            <div>
              <label className={labelClass}>Event Banner / Poster</label>
              <label className='flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 hover:border-green-500 dark:hover:border-green-500 cursor-pointer transition duration-200'>
                <div className='flex flex-col items-center justify-center gap-1 text-neutral-500 dark:text-neutral-400'>
                  {eventImage ? (
                    <span className='text-sm font-medium text-green-600 dark:text-green-400'>{eventImage.name}</span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className='w-7 h-7' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
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
                  onChange={(e) => setEventImage(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </section>

          <button
            className='w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold tracking-wide transition-colors duration-200 shadow-sm'
            type="submit"
          >
            Add Event
          </button>

        </form>
      </div>
    </div>
  )
}

export default AddEvent