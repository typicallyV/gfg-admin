'use client'

import { useState } from 'react'
import DeleteTeam from './DeleteTeam'
import UpdateTeam from './UpdateTeam'
import AddTeam from './AddTeam'
import { teamTabs } from '@/utils/constants'

const TeamNavbar = () => {
    const [activeTab, setActiveTab] = useState('add');

    const handleRenderComponent = () => {
        if (activeTab === 'add') return <AddTeam />;
        if (activeTab === 'update') return <UpdateTeam />;
        if (activeTab === 'delete') return <DeleteTeam />;
    }

    return (
        <div>
            <nav className='sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 shadow-sm'>
                <div className='max-w-3xl mx-auto px-6 flex items-center justify-between h-14'>
                    <span className='text-sm font-semibold tracking-wide text-neutral-800 dark:text-neutral-100 uppercase'>
                        Team
                    </span>

                    <ul className='flex items-stretch h-full gap-1'>
                        {teamTabs.map(({ key, label, icon: Icon }) => {
                            const active = activeTab === key;
                            const isDelete = key === 'delete';
                            return (
                                <li key={key} className='flex items-stretch'>
                                    <button
                                        onClick={() => setActiveTab(key)}
                                        className={`
                                            relative flex items-center gap-2 px-4 text-sm font-medium transition-colors duration-200
                                            ${active
                                                ? isDelete
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : 'text-green-600 dark:text-green-400'
                                                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                                            }
                                        `}
                                    >
                                        <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
                                        <span className='hidden sm:inline'>{label}</span>

                                        {active && (
                                            <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${isDelete ? 'bg-red-500' : 'bg-green-500'}`} />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            <div>
                {handleRenderComponent()}
            </div>
        </div>
    )
}

export default TeamNavbar