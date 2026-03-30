import { PlusCircle, PencilLine, Trash2, Users, CalendarDays } from 'lucide-react';

export const eventTabs = [
    { key: 'add', label: 'Add Event', icon: PlusCircle },
    { key: 'update', label: 'Update Event', icon: PencilLine },
    { key: 'delete', label: 'Delete Event', icon: Trash2 },
]

export const bottomTabs = [
    {
        key: 'Teams',
        label: 'Teams',
        icon: (active: boolean) => (
            <Users size={20} strokeWidth={active ? 2 : 1.5} />
        ),
    },
    {
        key: 'Events',
        label: 'Events',
        icon: (active: boolean) => (
            <CalendarDays size={20} strokeWidth={active ? 2 : 1.5} />
        ),
    },
]