'use client'
import FormComponent from './FormComponent'

const AddEvent = () => {

  return (
    <>
      <div className='flex justify-center items-start px-4 py-6'>
        <div className='w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden'>

          <div className='px-8 py-5 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60'>
            <h2 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100'>Add Event</h2>
            <p className='text-sm text-neutral-500 dark:text-neutral-400 mt-0.5'>Fill in the details below to add the event.</p>
          </div>
          <FormComponent type="Add" />
        </div>
      </div>
    </>
  )
}

export default AddEvent