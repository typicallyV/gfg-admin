import { PlusCircle, PencilLine, Trash2, Users, CalendarDays, Calendar } from 'lucide-react';

export const eventTabs = [
    { key: 'view', label: 'Event List', icon: Calendar },
    { key: 'add', label: 'Add Event', icon: PlusCircle },
    { key: 'update', label: 'Update Event', icon: PencilLine },
    { key: 'delete', label: 'Delete Event', icon: Trash2 },
]

export const teamTabs = [
    { key: 'view', label: 'Team List', icon: Users },
    { key: 'add', label: 'Add Team', icon: PlusCircle },
    { key: 'update', label: 'Update Team', icon: PencilLine },
    { key: 'delete', label: 'Delete Team', icon: Trash2 },
]

export const bottomTabs = [
    {
        key: 'Teams',
        label: 'Teams',
        href: '/dashboard/teams',
        icon: (active: boolean) => (
            <Users size={20} strokeWidth={active ? 2 : 1.5} />
        ),
    },
    {
        key: 'Events',
        label: 'Events',
        href: '/dashboard/events',
        icon: (active: boolean) => (
            <CalendarDays size={20} strokeWidth={active ? 2 : 1.5} />
        ),
    },
]