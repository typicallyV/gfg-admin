'use client'

import { useState } from 'react'
import FormComponent from './FormComponent'

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200'

const sectionHeadingClass =
  'text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400 mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-700'

const UpdateEvent = () => {
  const [eventFound, setEventFound] = useState(false);
  const [eventId, setEventId] = useState('');
  return (
    <div className='flex justify-center items-start px-4 py-6'>
      <div className='w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden'>

        <div className='px-8 py-5 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60'>
          <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100'>Update Event</h2>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 mt-0.5'>Look up an event by ID, then edit its details.</p>
        </div>

        <div>
          {!eventFound && <section className='px-8 py-6'>
            <h3 className={sectionHeadingClass}>Look Up Event</h3>
            <div className='flex gap-3'>
              <input
                className={inputClass}
                type="text"
                placeholder='Enter Event ID'
                value={eventId}
                onChange={(e) => { setEventId(e.target.value); setEventFound(false); }}
              />
              <button
                type="button"
                onClick={() => setEventFound(true)}
                className='shrink-0 px-5 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 text-sm font-medium border border-neutral-300 dark:border-neutral-600 transition-colors duration-200'
              >
                Find
              </button>
            </div>
          </section>}

          {eventFound && <FormComponent type='Update' onSuccess={() => { setEventFound(false); setEventId(''); }} />}
        </div>
      </div>
    </div>
  )
}

export default UpdateEvent