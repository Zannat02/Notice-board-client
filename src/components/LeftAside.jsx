import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import Icon from '../assets/icon.png';
import {
    FaChevronDown,
    FaTachometerAlt,
    FaUser,
    FaMoneyCheckAlt,
    FaFileInvoiceDollar,
    FaCalendarCheck,
    FaInbox,
    FaBriefcase,
    FaFolderOpen,
    FaBell,
    FaClipboardList,
    FaSignOutAlt,
    FaUserCircle
} from 'react-icons/fa';

// Every notice page (list, create, edit, drafts) belongs to the "Notice Board" menu item
const NOTICE_ROUTES = ['/notice-board', '/draft-notices'];

const isNoticePage = (pathname) =>
    pathname === '/' ||
    NOTICE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

// "to" = the item opens a real page. Items without "to" have no page yet.
const menuItems = [
    { title: 'Dashboard', icon: <FaTachometerAlt /> },
    {
        title: 'Employee',
        icon: <FaUser />,
        dropdown: ['Employee List', 'Add Employee', 'Departments', 'Roles']
    },
    { title: 'Payroll', icon: <FaMoneyCheckAlt /> },
    { title: 'Pay Slip', icon: <FaFileInvoiceDollar /> },
    { title: 'Attendance', icon: <FaCalendarCheck /> },
    { title: 'Request Center', icon: <FaInbox /> },
    {
        title: 'Career Database',
        icon: <FaBriefcase />,
        dropdown: ['Open Positions', 'Applications', 'Interviews', 'Hired']
    },
    { title: 'Document Manager', icon: <FaFolderOpen /> },
    { title: 'Notice Board', icon: <FaBell />, to: '/', isActive: isNoticePage },
    { title: 'Activity Log', icon: <FaClipboardList /> },
    { title: 'Exit Interview', icon: <FaSignOutAlt /> },
    { title: 'Profile', icon: <FaUserCircle /> }
];

const rowClass = (active) =>
    `flex w-full justify-between items-center p-2 text-left cursor-pointer rounded hover:bg-gray-100 ${
        active ? 'bg-gray-100 border-r-4 border-orange-500' : ''
    }`;

const LeftAside = ({ onNavigate }) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const { pathname } = useLocation();

    const toggleDropdown = (title) => {
        setOpenDropdown((current) => (current === title ? null : title));
    };

    const label = (item) => (
        <span className='flex items-center space-x-2'>
            <span>{item.icon}</span>
            <span>{item.title}</span>
        </span>
    );

    return (
        <div className='text-black p-4'>

            <div className='flex justify-center items-center mt-5 mb-4'>
                <img className="w-10 h-10 " src={Icon} alt="Logo" />
                <h2 className='text-3xl font-bold'>Nebs-it</h2>
            </div>

            <ul className='space-y-2'>
                {menuItems.map((item) => {
                    const active = item.to ? item.isActive(pathname) : false;

                    return (
                        <li key={item.title}>
                            {item.dropdown ? (
                                // Dropdown item: just toggle, keep the drawer open on mobile
                                <button
                                    type='button'
                                    aria-expanded={openDropdown === item.title}
                                    className={rowClass(false)}
                                    onClick={() => toggleDropdown(item.title)}
                                >
                                    {label(item)}
                                    <FaChevronDown
                                        className={`transition-transform duration-200 ${
                                            openDropdown === item.title ? 'rotate-180' : 'rotate-0'
                                        }`}
                                    />
                                </button>
                            ) : item.to ? (
                                // Real page: the highlight comes from the URL
                                <Link
                                    to={item.to}
                                    aria-current={active ? 'page' : undefined}
                                    className={rowClass(active)}
                                    onClick={() => onNavigate && onNavigate()}
                                >
                                    {label(item)}
                                </Link>
                            ) : (
                                // No page for this item yet
                                <button
                                    type='button'
                                    className={rowClass(false)}
                                    onClick={() => onNavigate && onNavigate()}
                                >
                                    {label(item)}
                                </button>
                            )}

                            {item.dropdown && openDropdown === item.title && (
                                <ul className='pl-8 mt-1 space-y-1 bg-slate-100'>
                                    {item.dropdown.map((subItem) => (
                                        <li key={subItem} className='p-1 cursor-pointer rounded'>
                                            {subItem}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default LeftAside;