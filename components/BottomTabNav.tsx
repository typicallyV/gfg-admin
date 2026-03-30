'use client'

import React, { useState } from 'react'
import Teams from '../app/dashboard/teams/page'
import Events from '../app/dashboard/events/page'
import { bottomTabs } from '@/utils/constants'



const BottomTabNav = () => {
    const [activeTab, setActiveTab] = useState('Teams');

    const handleRenderComponent = () => {
        if (activeTab === 'Teams') return <Teams />
        if (activeTab === 'Events') return <Events />
    }

    return (
        <div className='min-h-screen flex flex-col'>
            <main className='flex-1 overflow-y-auto pb-20'>
                {handleRenderComponent()}
            </main>
            <nav className='fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md'>
                <ul className='flex justify-around items-center h-16 max-w-lg mx-auto px-4'>
                    {bottomTabs.map(({ key, label, icon }) => {
                        const active = activeTab === key;
                        return (
                            <li key={key} className='flex-1 relative'>
                                <button
                                    onClick={() => setActiveTab(key)}
                                    className={`w-full flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all duration-200 ${active
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                                        }`}
                                >
                                    <span className={`transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
                                        {icon(active)}
                                    </span>
                                    <span className={`text-[11px] font-medium tracking-wide ${active ? 'font-semibold' : ''}`}>
                                        {label}
                                    </span>
                                    {active && (
                                        <span className='absolute bottom-2 w-1 h-1 rounded-full bg-green-500' />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    )
}

export default BottomTabNav