'use client'

import React, { useState } from 'react'
import DeleteEvent from './DeleteEvent'
import UpdateEvent from './UpdateEvent'
import AddEvent from './AddEvent'

const EventNavbar = () => {
    const [activeTab, setActiveTab] = useState('add');

    const handleRenderComponent = () => {
        if (activeTab === 'add') return <AddEvent />;
        if (activeTab === 'update') return <UpdateEvent />;
        if (activeTab === 'delete') return <DeleteEvent />;
    }
    return (
        <div>
            <div className='flex justify-center gap-7'>
                <ul className='flex'>
                    <li>
                        <button className={`${activeTab === 'add' ? 'bg-green-600/50' : 'bg-transparent'} p-3 rounded-2xl transition-all duration-300 ease`} onClick={() => setActiveTab('add')} >Add Event</button>
                    </li>
                    <li>
                        <button className={`${activeTab === 'update' ? 'bg-green-600/50' : 'bg-transparent'} p-3 rounded-2xl transition-all duration-300 ease`} onClick={() => setActiveTab('update')} >Update Event</button>
                    </li>
                    <li>
                        <button className={`${activeTab === 'delete' ? 'bg-green-600/50' : 'bg-transparent'} p-3 rounded-2xl transition-all duration-300 ease`} onClick={() => setActiveTab('delete')} >Delete Event</button>
                    </li>
                </ul>
            </div>
            <div className='mt-6'>
                {handleRenderComponent()}
            </div>
        </div>
    )
}

export default EventNavbar