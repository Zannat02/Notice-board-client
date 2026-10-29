import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { HiMenu } from 'react-icons/hi';
import { format, formatDistanceToNow } from 'date-fns';
import ProfilePic from '../assets/profilePic.jpg';
import API_URL from '../config';


const CURRENT_USER = { name: 'Asif Riaj', role: 'HR' };

const LAST_SEEN_KEY = 'notice-board:last-seen';
const MAX_ITEMS = 5;

const getGreeting = (date) => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    return 'Good Evening';
};


const noticeTime = (notice) => {
    const value = notice.updatedAt || notice.createdAt || notice.PublishDate;
    const time = value ? new Date(value).getTime() : 0;
    return Number.isNaN(time) ? 0 : time;
};

const readLastSeen = () => {
    try {
        const value = Number(localStorage.getItem(LAST_SEEN_KEY));
        return value > 0 ? value : null;
    } catch {
        return null;
    }
};

const saveLastSeen = (time) => {
    try {
        localStorage.setItem(LAST_SEEN_KEY, String(time));
    } catch {
        // storage can be unavailable (private mode), the bell still works
    }
};

const Header = ({ onMenuClick }) => {
    const { pathname } = useLocation();
    const [now, setNow] = useState(() => new Date());
    const [open, setOpen] = useState(false);
    const [notices, setNotices] = useState([]);
    const [status, setStatus] = useState('loading'); // loading | ready | error
    const [lastSeen, setLastSeen] = useState(readLastSeen);
    const [newSince, setNewSince] = useState(null);
    const bellRef = useRef(null);
    const mounted = useRef(true);

    const firstName = CURRENT_USER.name.split(' ')[0];

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

  
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const loadNotices = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/notices?status=Published`);
            if (!res.ok) throw new Error('Failed to load notices');
            const data = await res.json();
            if (!mounted.current) return;
            setNotices([...data].sort((a, b) => noticeTime(b) - noticeTime(a)));
            setStatus('ready');
        } catch {
            if (mounted.current) setStatus('error');
        }
    }, []);

  
    useEffect(() => {
        setOpen(false);
        loadNotices();
    }, [pathname, loadNotices]);

  
    useEffect(() => {
        if (status === 'ready' && lastSeen === null) {
            const time = Date.now();
            saveLastSeen(time);
            setLastSeen(time);
        }
    }, [status, lastSeen]);

  
    useEffect(() => {
        if (!open) return;
        const handlePointerDown = (event) => {
            if (bellRef.current && !bellRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [open]);

    const toggleBell = () => {
        if (open) {
            setOpen(false);
            return;
        }
    
        setNewSince(lastSeen);
        const time = Date.now();
        saveLastSeen(time);
        setLastSeen(time);
        setOpen(true);
        loadNotices();
    };

    const unreadCount =
        lastSeen === null ? 0 : notices.filter((notice) => noticeTime(notice) > lastSeen).length;
    const recent = notices.slice(0, MAX_ITEMS);

    return (
        <div className="flex justify-between items-center px-4 md:px-6 bg-white h-16 shadow">

            <div className="flex items-center gap-3">
                {/* Hamburger - only visible on mobile & tablet */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-2xl text-gray-700"
                    aria-label="Open menu"
                >
                    <HiMenu />
                </button>

                <div className="flex flex-col justify-center">
                    <h2 className="text-base md:text-lg font-semibold text-gray-900">
                        {getGreeting(now)} {firstName}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500">
                        {format(now, 'dd MMMM, yyyy')}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">

                {/* Notification bell */}
                <div
                    ref={bellRef}
                    className="relative"
                    onKeyDown={(event) => event.key === 'Escape' && setOpen(false)}
                >
                    <button
                        type="button"
                        onClick={toggleBell}
                        aria-expanded={open}
                        aria-controls="recent-notices-panel"
                        aria-label={
                            unreadCount > 0 ? `Notifications, ${unreadCount} new` : 'Notifications'
                        }
                        className="relative rounded-full p-1.5 text-gray-700 hover:bg-gray-100"
                    >
                        <IoIosNotificationsOutline className="text-xl md:text-2xl" />
                        {unreadCount > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 h-[1.1rem] min-w-[1.1rem] rounded-full bg-orange-600 px-1 text-center text-[10px] font-medium leading-[1.1rem] text-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {open && (
                        <div
                            id="recent-notices-panel"
                            className="fixed inset-x-4 top-[4.5rem] z-50 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96"
                        >
                            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                                <h3 className="font-semibold text-gray-900">Recent Notices</h3>
                                {status === 'ready' && (
                                    <span className="text-xs text-gray-500">
                                        {notices.length} published
                                    </span>
                                )}
                            </div>

                            <div className="max-h-[60dvh] overflow-y-auto overscroll-contain">
                                {status === 'loading' && notices.length === 0 && (
                                    <div className="animate-pulse space-y-3 p-4 motion-reduce:animate-none">
                                        <div className="h-4 w-3/4 rounded bg-gray-200" />
                                        <div className="h-3 w-1/2 rounded bg-gray-200" />
                                        <div className="h-4 w-2/3 rounded bg-gray-200" />
                                        <div className="h-3 w-1/3 rounded bg-gray-200" />
                                    </div>
                                )}

                                {status === 'error' && notices.length === 0 && (
                                    <div className="p-4 text-center text-sm text-gray-600">
                                        <p className="mb-2">Could not load notices.</p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setStatus('loading');
                                                loadNotices();
                                            }}
                                            className="text-orange-700 underline"
                                        >
                                            Try again
                                        </button>
                                    </div>
                                )}

                                {status === 'ready' && notices.length === 0 && (
                                    <p className="p-4 text-center text-sm text-gray-500">
                                        No published notices yet.
                                    </p>
                                )}

                                {recent.length > 0 && (
                                    <ul className="divide-y divide-gray-100">
                                        {recent.map((notice) => {
                                            const time = noticeTime(notice);
                                            const isNew = newSince !== null && time > newSince;
                                            const meta = [
                                                notice.Target,
                                                time > 0
                                                    ? formatDistanceToNow(new Date(time), { addSuffix: true })
                                                    : ''
                                            ]
                                                .filter(Boolean)
                                                .join(' · ');

                                            return (
                                                <li key={notice._id} className="flex gap-3 px-4 py-3">
                                                    <span
                                                        aria-hidden="true"
                                                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                                            isNew ? 'bg-orange-500' : 'bg-transparent'
                                                        }`}
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate font-medium text-gray-900">
                                                            {notice.NoticeTitle}
                                                            {isNew && <span className="sr-only"> (new)</span>}
                                                        </p>
                                                        {meta && (
                                                            <p className="truncate text-xs text-gray-500">{meta}</p>
                                                        )}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>

                            <Link
                                to="/"
                                onClick={() => setOpen(false)}
                                className="block border-t border-gray-200 py-3 text-center text-sm font-medium text-orange-700 hover:bg-gray-50"
                            >
                                View all notices
                            </Link>
                        </div>
                    )}
                </div>

                <div className="hidden sm:block w-px h-12 bg-gray-300"></div>

                <div className="hidden sm:flex flex-col justify-center text-right">
                    <span className="font-medium">{CURRENT_USER.name}</span>
                    <span className="text-sm text-gray-500">{CURRENT_USER.role}</span>
                </div>

                <img
                    src={ProfilePic}
                    alt="Profile"
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover"
                />
            </div>

        </div>
    );
};

export default Header;