'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Users, LogOut } from 'lucide-react'

const BottomTabNav = () => {
    const pathname = usePathname()
    const router = useRouter()
    const [openList, setOpenList] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const toggleList = () => {
        setOpenList(!openList)
    }

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await fetch('/api/admin/logout', { method: 'POST' })
            router.push('/login')
        } catch (error) {
            console.error('Logout error:', error)
            router.push('/login')
        }
    }

    return (
        <>
            {openList && (
                <div
                    className='fixed inset-0 z-40'
                    onClick={() => setOpenList(false)}
                />
            )}

            <div
                className={`fixed z-50 right-10 bottom-24 bg-neutral-900 border border-neutral-700 rounded-xl p-3 w-44 shadow-xl transition-all duration-200 origin-bottom-right ${
                    openList
                        ? 'opacity-100 scale-100 pointer-events-auto'
                        : 'opacity-0 scale-90 pointer-events-none'
                }`}
            >
                <ul className='flex flex-col gap-1'>
                    <li>
                        <Link
                            href='/dashboard/teams'
                            onClick={() => setOpenList(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 ${
                                pathname?.startsWith('/dashboard/teams')
                                    ? 'bg-green-600/20 text-green-400'
                                    : 'text-neutral-200 hover:bg-neutral-800'
                            }`}
                        >
                            <Users size={18} />
                            <span className='text-sm font-medium'>Teams</span>
                        </Link>
                    </li>
                    <hr className='border-neutral-700 my-1' />
                    <li>
                        <Link
                            href='/dashboard/events'
                            onClick={() => setOpenList(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 ${
                                pathname?.startsWith('/dashboard/events')
                                    ? 'bg-green-600/20 text-green-400'
                                    : 'text-neutral-200 hover:bg-neutral-800'
                            }`}
                        >
                            <Calendar size={18} />
                            <span className='text-sm font-medium'>Events</span>
                        </Link>
                    </li>
                    <hr className='border-neutral-700 my-1' />
                    <li>
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className='w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors duration-150 text-left'
                        >
                            <LogOut size={18} />
                            <span className='text-sm font-medium'>
                                {isLoggingOut ? 'Logging out...' : 'Log Out'}
                            </span>
                        </button>
                    </li>
                </ul>
            </div>

            <button
                className='fixed bottom-6 right-10 w-14 h-14 rounded-full bg-green-600 hover:bg-green-500 active:scale-95 shadow-lg shadow-green-600/30 cursor-pointer z-50 transition-all duration-200 ease-out flex items-center justify-center'
                onClick={toggleList}
                aria-label='Toggle navigation menu'
            >
                {pathname?.startsWith('/dashboard/teams')
                    ? <Users size={22} className='text-white' />
                    : <Calendar size={22} className='text-white' />
                }
            </button>
        </>
    )
}

export default BottomTabNav
