'use client'

import { FormEvent, useState } from 'react'
import DomainTeams from './DomainTeams'
import { Domain } from '@/types/Domain'

export default function DomainSearch() {
  const [domainName, setDomainName] = useState('')
  const [searchedDomain, setSearchedDomain] = useState('')
  const [domain, setDomain] = useState<Domain | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setLoading(true)
    let infoType = "teams"
    if(domainName.toLowerCase() === 'leader') {
      infoType = "leaders"
    }
    try {
      const response = await fetch(`/api/${infoType}?domain=${encodeURIComponent(domainName)}`, {
		method: 'GET'
	  })

      const data = await response.json()
      setDomain(data.domains[0])
      setSearchedDomain(domainName)
    } catch {
      setDomain(null)
      setSearchedDomain(domainName)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='px-4 py-6 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-5xl space-y-6'>
        <section className='overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl shadow-neutral-900/5 dark:border-neutral-700 dark:bg-neutral-900'>
          <div className='border-b border-neutral-200 bg-linear-to-r from-emerald-50 via-white to-cyan-50 px-6 py-5 dark:border-neutral-700 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-800'>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400'>
              Team Domains
            </p>

            <h2 className='mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
              Search by domain name
            </h2>

            <p className='mt-1 text-sm text-neutral-500 dark:text-neutral-400'>
              Enter a domain name to display the matching team below.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className='space-y-4 px-6 py-6'
          >
            <label className='block'>
              <span className='mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                Domain name
              </span>

              <input
                value={domainName}
                onChange={(e) =>
                  setDomainName(e.target.value)
                }
                type='text'
                placeholder='Enter domain name'
                className='w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500'
              />
            </label>

            <button
              type='submit'
              disabled={loading}
              className='inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400'
            >
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </form>
        </section>

        {domain && (
          <DomainTeams
            domain={domain}
            searchedDomain={searchedDomain}
          />
        )}
      </div>
    </div>
  )
}