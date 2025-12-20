'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutButton() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            });

            if (response.ok) {
                router.push('/login');
            } else {
                console.error('Logout failed');
                setIsLoggingOut(false);
            }
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoggingOut(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-sm text-gray-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
    );
}
