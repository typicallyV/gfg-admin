'use client'

import { useState } from 'react'
import UpdateEventForm from './UpdateEventForm'

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200'

const sectionHeadingClass =
  'text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400 mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700'

const UpdateEvent = () => {
  const [eventFound, setEventFound] = useState(false)
  const [eventId, setEventId] = useState('')
  const [eventData, setEventData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch(`/api/event/${eventId}`, {
        method: 'GET',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Event not found')
      }

      setEventFound(true)
      setEventData(data.event)
    } catch (error) {
      setEventFound(false)
      setEventData(null)
      setErrorMessage(error instanceof Error ? error.message : 'Unable to find event')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setEventFound(false)
    setEventId('')
    setEventData(null)
    setErrorMessage('')
  }

  return (
    <div className='flex justify-center items-start px-4 py-6'>
      <div className='w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden'>

        <div className='px-8 py-5 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60'>
          <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100'>Update Event</h2>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 mt-0.5'>Look up an event by ID, then edit its details.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {!eventFound && <section className='px-8 py-6'>
            <h3 className={sectionHeadingClass}>Look Up Event</h3>
            <div className='flex gap-3'>
              <input
                className={inputClass}
                type="text"
                placeholder='Enter Event ID'
                value={eventId}
                onChange={(e) => {
                  setEventId(e.target.value)
                  setEventFound(false)
                  setErrorMessage('')
                }}
              />
              <button
                type="submit"
                disabled={isLoading}
                className='shrink-0 px-5 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 text-sm font-medium border border-neutral-300 dark:border-neutral-600 transition-colors duration-200'
              >
                {isLoading ? 'Finding...' : 'Find'}
              </button>
            </div>
            {errorMessage && (
              <p className='mt-3 text-sm text-rose-600 dark:text-rose-400'>
                {errorMessage}
              </p>
            )}
          </section>}
        </form>

        {eventFound && (
          <div className='px-8 pb-6'>
            <div className='rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-700 dark:bg-neutral-800/60'>
              <p className='text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400'>
                Selected Event
              </p>
              <p className='mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100'>
                {eventData?.name || 'Event found'}
              </p>
              <p className='mt-1 text-sm text-neutral-500 dark:text-neutral-400'>
                Update the event details below. Existing image and gallery items are kept unless replaced.
              </p>
            </div>

            <UpdateEventForm
              eventData={eventData}
              onSuccess={handleReset}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default UpdateEvent