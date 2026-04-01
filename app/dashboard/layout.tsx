'use client'
import BottomTabNav from "@/components/BottomTabNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='min-h-screen flex flex-col'>
            <main className='flex-1 overflow-y-auto pb-20'>
                {children}
            </main>
            <BottomTabNav />
        </div>
    );
}
