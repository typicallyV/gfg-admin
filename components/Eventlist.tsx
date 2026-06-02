'use client'

import { useEffect, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Copy, Crown, MapPin, Ticket, Users } from 'lucide-react'

type EventImage = string | { url?: string; publicId?: string }

type EventGalleryItem = {
    _id?: string
    url?: string
    publicId?: string
}

type EventPricingOption = {
    isPaid?: boolean
    fee?: number
    qrCode?: {
        url?: string
        publicId?: string
    }
}

type EventRecord = {
    _id: string
    name: string
    description?: string
    shortDescription?: string
    image?: EventImage
    gallery?: EventGalleryItem[]
    teamSize?: {
        min?: number
        max?: number
    }
    pricing?: {
        rbu?: EventPricingOption
        intercollege?: EventPricingOption
    }
    registrationFee?: number
    startDate?: string
    endDate?: string
    venue?: string
    type?: string
    theme?: string
    audience?: string
    registrationsCount?: number
    registrationStatus?: string
}

type EventListResponse = {
    events: EventRecord[]
    total: number
    page: number
    limit: number
    success: boolean
    error?: string
}

const formatDateTime = (value?: string) => {
    if (!value) return 'N/A'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'

    return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date)
}

const formatMoney = (value?: number) => {
    if (!value) return 'Free'
    return `₹${value.toLocaleString('en-IN')}`
}

const getImageUrl = (image?: EventImage) => {
    if (!image) return ''
    if (typeof image === 'string') return image
    return image.url ?? ''
}

const statusStyles: Record<string, string> = {
    open: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
    closed: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20',
    upcoming: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20',
}

export default function EventList() {
    const [events, setEvents] = useState<EventRecord[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [status, setStatus] = useState('all')
    const [order, setOrder] = useState<'asc' | 'desc'>('desc')
    const [upcoming, setUpcoming] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [copiedEventId, setCopiedEventId] = useState('')

    const handleCopyId = async (id: string) => {
        try {
            await navigator.clipboard.writeText(id)
            setCopiedEventId(id)
            window.setTimeout(() => setCopiedEventId(''), 1200)
        } catch {
            setError('Unable to copy event ID')
        }
    }

    useEffect(() => {
        const controller = new AbortController()

        const loadEvents = async () => {
            setLoading(true)
            setError('')

            try {
                const params = new URLSearchParams()

                if (status !== 'all') params.set('status', status)
                params.set('order', order)
                params.set('limit', String(limit))
                params.set('page', String(page))
                if (upcoming) params.set('upcoming', 'true')

                const response = await fetch(`/api/event?${params.toString()}`, {
                    method: 'GET',
                    signal: controller.signal,
                })

                const data: EventListResponse = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Unable to load events')
                }

                setEvents(data.events || [])
                setTotal(data.total || 0)
                setPage(data.page || 1)
                setLimit(data.limit || limit)
            } catch (fetchError) {
                if ((fetchError as Error).name === 'AbortError') return
                setEvents([])
                setTotal(0)
                setError(fetchError instanceof Error ? fetchError.message : 'Unable to load events')
            } finally {
                setLoading(false)
            }
        }

        loadEvents()

        return () => controller.abort()
    }, [limit, order, page, status, upcoming])

    const totalPages = Math.max(1, Math.ceil(total / limit))
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    return (
        <section className='px-4 py-6 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-7xl space-y-6'>
                <div className='overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl shadow-neutral-900/5 dark:border-neutral-700 dark:bg-neutral-900'>
                    <div className='border-b border-neutral-200 bg-linear-to-r from-emerald-50 via-white to-cyan-50 px-6 py-5 dark:border-neutral-700 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-800'>
                        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400'>
                            Events
                        </p>

                        <div className='mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
                            <div>
                                <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                                    Events list
                                </h2>
                                <p className='mt-1 text-sm text-neutral-500 dark:text-neutral-400'>
                                    Browse the API response with filters for status, order, pagination, and upcoming events.
                                </p>
                            </div>

                            <div className='text-sm text-neutral-500 dark:text-neutral-400'>
                                Showing <span className='font-semibold text-neutral-900 dark:text-neutral-100'>{events.length}</span> of{' '}
                                <span className='font-semibold text-neutral-900 dark:text-neutral-100'>{total}</span>
                            </div>
                        </div>
                    </div>

                    <div className='grid gap-4 border-b border-neutral-200 px-6 py-5 sm:grid-cols-2 xl:grid-cols-5 dark:border-neutral-700'>
                        <label className='space-y-2'>
                            <span className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>Status</span>
                            <select
                                value={status}
                                onChange={(e) => {
                                    setPage(1)
                                    setStatus(e.target.value)
                                }}
                                className='w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100'
                            >
                                <option value='all'>All</option>
                                <option value='open'>Open</option>
                                <option value='closed'>Closed</option>
                            </select>
                        </label>

                        <label className='space-y-2'>
                            <span className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>Order</span>
                            <select
                                value={order}
                                onChange={(e) => {
                                    setPage(1)
                                    setOrder(e.target.value as 'asc' | 'desc')
                                }}
                                className='w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100'
                            >
                                <option value='desc'>Newest first</option>
                                <option value='asc'>Oldest first</option>
                            </select>
                        </label>

                        <label className='space-y-2'>
                            <span className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>Limit</span>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setPage(1)
                                    setLimit(Number(e.target.value))
                                }}
                                className='w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100'
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                        </label>

                        <label className='flex items-center gap-3 rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-700 dark:border-neutral-600 dark:text-neutral-300'>
                            <input
                                type='checkbox'
                                checked={upcoming}
                                onChange={(e) => {
                                    setPage(1)
                                    setUpcoming(e.target.checked)
                                }}
                                className='h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500'
                            />
                            Upcoming only
                        </label>

                        <div className='flex items-end justify-between gap-3 rounded-xl border border-neutral-300 px-4 py-3 dark:border-neutral-600'>
                            <div>
                                <p className='text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400'>
                                    Page
                                </p>
                                <p className='text-base font-semibold text-neutral-900 dark:text-neutral-100'>
                                    {page} / {totalPages}
                                </p>
                            </div>

                            <div className='flex gap-2'>
                                <button
                                    type='button'
                                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                                    disabled={!hasPreviousPage}
                                    className='inline-flex items-center gap-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800'
                                >
                                    <ChevronLeft size={16} />
                                    Prev
                                </button>
                                <button
                                    type='button'
                                    onClick={() => setPage((current) => current + 1)}
                                    disabled={!hasNextPage}
                                    className='inline-flex items-center gap-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800'
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading && (
                        <div className='px-6 py-10 text-center text-sm text-neutral-500 dark:text-neutral-400'>
                            Loading events...
                        </div>
                    )}

                    {!loading && error && (
                        <div className='px-6 py-10 text-center text-sm text-rose-600 dark:text-rose-400'>
                            {error}
                        </div>
                    )}

                    {!loading && !error && events.length === 0 && (
                        <div className='px-6 py-10 text-center text-sm text-neutral-500 dark:text-neutral-400'>
                            No events found for the selected filters.
                        </div>
                    )}

                    {!loading && !error && events.length > 0 && (
                        <div className='grid gap-6 px-6 py-6 md:grid-cols-2 xl:grid-cols-3'>
                            {events.map((event) => {
                                const imageUrl = getImageUrl(event.image)
                                const badgeKey = event.registrationStatus || 'upcoming'
                                const badgeClass = statusStyles[badgeKey] || statusStyles.upcoming
                                const galleryCount = event.gallery?.length || 0

                                return (
                                    <article
                                        key={event._id}
                                        className='group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-neutral-700 dark:bg-neutral-950'
                                    >
                                        <div className='relative h-52 overflow-hidden bg-neutral-100 dark:bg-neutral-800'>
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={event.name}
                                                    className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                                                />
                                            ) : (
                                                <div className='flex h-full items-center justify-center bg-linear-to-br from-emerald-100 via-white to-cyan-100 dark:from-emerald-950 dark:via-neutral-900 dark:to-cyan-950'>
                                                    <CalendarDays size={42} className='text-emerald-500' />
                                                </div>
                                            )}

                                            <div className='absolute left-4 top-4 flex flex-wrap gap-2'>
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${badgeClass}`}>
                                                    {event.registrationStatus || 'upcoming'}
                                                </span>
                                                <span className='inline-flex items-center rounded-full bg-neutral-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur'>
                                                    {event.type || 'event'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className='space-y-5 p-5'>
                                            <div className='space-y-2'>
                                                <div className='flex items-start justify-between gap-3'>
                                                    <h3 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100'>
                                                        {event.name}
                                                    </h3>
                                                    <span className='inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20'>
                                                        <Users size={13} />
                                                        {event.registrationsCount ?? 0}
                                                    </span>
                                                </div>

                                                <p className='text-sm leading-6 text-neutral-600 dark:text-neutral-400'>
                                                    {event.shortDescription || event.description || 'No description available.'}
                                                </p>
                                            </div>

                                            <div className='grid gap-3 text-sm text-neutral-600 dark:text-neutral-300 sm:grid-cols-2'>
                                                <div className='rounded-2xl bg-neutral-50 px-4 py-3 dark:bg-neutral-900/80'>
                                                    <p className='text-xs uppercase tracking-[0.18em] text-neutral-400'>
                                                        Team Size
                                                    </p>
                                                    <p className='mt-1 font-semibold text-neutral-900 dark:text-neutral-100'>
                                                        {event.teamSize?.min ?? 'N/A'} - {event.teamSize?.max ?? 'N/A'}
                                                    </p>
                                                </div>

                                                <div className='rounded-2xl bg-neutral-50 px-4 py-3 dark:bg-neutral-900/80'>
                                                    <p className='text-xs uppercase tracking-[0.18em] text-neutral-400'>
                                                        Registration Fee
                                                    </p>
                                                    <p className='mt-1 font-semibold text-neutral-900 dark:text-neutral-100'>
                                                        {formatMoney(event.registrationFee)}
                                                    </p>
                                                </div>

                                                <div className='rounded-2xl bg-neutral-50 px-4 py-3 dark:bg-neutral-900/80'>
                                                    <p className='text-xs uppercase tracking-[0.18em] text-neutral-400'>
                                                        Venue
                                                    </p>
                                                    <p className='mt-1 line-clamp-2 font-semibold text-neutral-900 dark:text-neutral-100'>
                                                        {event.venue || 'N/A'}
                                                    </p>
                                                </div>

                                                <div className='rounded-2xl bg-neutral-50 px-4 py-3 dark:bg-neutral-900/80'>
                                                    <p className='text-xs uppercase tracking-[0.18em] text-neutral-400'>
                                                        Gallery
                                                    </p>
                                                    <p className='mt-1 font-semibold text-neutral-900 dark:text-neutral-100'>
                                                        {galleryCount} image{galleryCount === 1 ? '' : 's'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900'>
                                                <div className='flex items-start gap-3'>
                                                    <CalendarDays size={16} className='mt-0.5 text-emerald-600 dark:text-emerald-400' />
                                                    <div>
                                                        <p className='text-xs uppercase tracking-[0.18em] text-neutral-400'>
                                                            Starts
                                                        </p>
                                                        <p className='text-sm font-medium text-neutral-900 dark:text-neutral-100'>
                                                            {formatDateTime(event.startDate)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className='flex items-start gap-3'>
                                                    <CalendarDays size={16} className='mt-0.5 text-emerald-600 dark:text-emerald-400' />
                                                    <div>
                                                        <p className='text-xs uppercase tracking-[0.18em] text-neutral-400'>
                                                            Ends
                                                        </p>
                                                        <p className='text-sm font-medium text-neutral-900 dark:text-neutral-100'>
                                                            {formatDateTime(event.endDate)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className='flex items-start gap-3'>
                                                    <MapPin size={16} className='mt-0.5 text-emerald-600 dark:text-emerald-400' />
                                                    <div>
                                                        <p className='text-xs uppercase tracking-[0.18em] text-neutral-400'>
                                                            Audience
                                                        </p>
                                                        <p className='text-sm font-medium text-neutral-900 dark:text-neutral-100'>
                                                            {event.audience || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='grid gap-3 sm:grid-cols-2'>
                                                <div className='rounded-2xl border border-neutral-200 px-4 py-3 dark:border-neutral-700'>
                                                    <div className='flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-neutral-400'>
                                                        <Ticket size={14} />
                                                        RBU Pricing
                                                    </div>
                                                    <p className='mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100'>
                                                        {event.pricing?.rbu?.isPaid ? formatMoney(event.pricing.rbu.fee) : 'Free'}
                                                    </p>
                                                </div>

                                                <div className='rounded-2xl border border-neutral-200 px-4 py-3 dark:border-neutral-700'>
                                                    <div className='flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-neutral-400'>
                                                        <Crown size={14} />
                                                        Intercollege
                                                    </div>
                                                    <p className='mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100'>
                                                        {event.pricing?.intercollege?.isPaid ? formatMoney(event.pricing.intercollege.fee) : 'Free'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='flex flex-wrap gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400'>
                                                <button
                                                    type='button'
                                                    onClick={() => handleCopyId(event._id)}
                                                    className='inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-left transition hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                                                    title='Click to copy event ID'
                                                >
                                                    <span>
                                                        ID: {event._id}
                                                    </span>
                                                    <Copy size={12} />
                                                    {copiedEventId === event._id && (
                                                        <span className='text-emerald-600 dark:text-emerald-400'>Copied</span>
                                                    )}
                                                </button>
                                                {event.theme && (
                                                    <span className='rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800'>
                                                        Theme: {event.theme}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}