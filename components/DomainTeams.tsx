'use client'

import { Domain } from '@/types/Domain'

type Props = {
  domain: Domain | null
  searchedDomain: string
}

export default function DomainTeams({ domain }: Props) {
  const copyToClipboard = async (value: string) => {
    await navigator.clipboard.writeText(value)
  }

  if (!domain) {
    return null
  }

  return (
    <section className='space-y-4'>
      <div className='rounded-2xl border border-neutral-200 bg-white px-6 py-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900'>
        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400'>
          Domain
        </p>

        <h3 className='mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
          {domain.name}
        </h3>

        <button
          type='button'
          title='Click to copy'
          aria-label={`Click to copy domain ID ${domain._id}`}
          onClick={() => copyToClipboard(domain._id)}
          className='mt-1 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-500 transition hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
        >
          <span className='font-medium text-neutral-700 dark:text-neutral-200'>
            Domain ID
          </span>

          <span className='font-semibold text-neutral-900 dark:text-neutral-100'>
            {domain._id}
          </span>
        </button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {domain.members.map((member) => (
          <article
            key={member._id}
            className='group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900'
          >
            <div className='flex items-center gap-4 border-b border-neutral-200 px-5 py-5 dark:border-neutral-700'>
              <div
                className='flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800'
                style={
                  member.backgroundColor
                    ? { backgroundColor: member.backgroundColor }
                    : undefined
                }
              >
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={`${member.firstname} ${member.lastname}`}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <span className='text-lg font-semibold text-neutral-600 dark:text-neutral-300'>
                    {member.firstname.charAt(0)}
                    {member.lastname.charAt(0)}
                  </span>
                )}
              </div>

              <div className='min-w-0'>
                <p className='text-base font-semibold text-neutral-900 dark:text-neutral-100'>
                  {member.firstname} {member.lastname}
                </p>

                <p className='text-sm text-neutral-500 dark:text-neutral-400'>
                  {member.role}
                </p>
              </div>
            </div>

            <div className='space-y-3 px-5 py-5'>
              <button
                type='button'
                title='Click to copy'
                aria-label={`Click to copy member ID ${member._id}`}
                onClick={() => copyToClipboard(member._id)}
                className='flex w-full cursor-pointer items-center justify-between rounded-xl bg-neutral-50 px-4 py-3 text-left text-sm text-neutral-600 transition hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              >
                <span>ID</span>

                <span className='font-medium text-neutral-900 dark:text-neutral-100'>
                  {member._id}
                </span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}