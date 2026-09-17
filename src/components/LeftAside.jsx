import React, { useState } from 'react';
import Icon from '../assets/icon.png';
import { FaChevronDown } from 'react-icons/fa';
import { FaTachometerAlt, FaUser, FaMoneyCheckAlt, FaFileInvoiceDollar, FaCalendarCheck, FaInbox, FaBriefcase, FaFolderOpen, FaBell, FaClipboardList, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const LeftAside = ({ onNavigate }) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();

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
        { title: 'Notice Board', icon: <FaBell /> },
        { title: 'Activity Log', icon: <FaClipboardList /> },
        { title: 'Exit Interview', icon: <FaSignOutAlt /> },
        { title: 'Profile', icon: <FaUserCircle /> }
    ];

    const toggleDropdown = (title) => {
        if (openDropdown === title) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(title);
        }
    }

    return (
        <div className='text-black p-4'>

            <div className='flex justify-center items-center mt-5 mb-4'>
                <img className="w-10 h-10 " src={Icon} alt="Logo" />
                <h2 className='text-3xl font-bold'>Nebs-it</h2>
            </div>

            <ul className='space-y-2'>
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <div
                            className={`flex justify-between items-center p-2 cursor-pointer rounded 
                                hover:bg-gray-100 
                                ${selectedItem === item.title ? 'bg-gray-100 border-r-4 border-orange-500' : ''}`}
                            onClick={() => {
                                setSelectedItem(item.title);

                                if (item.dropdown) {
                                    // Dropdown item — just toggle, keep drawer open on mobile
                                    toggleDropdown(item.title);
                                    return;
                                }

                                if (item.title === 'Notice Board') {
                                    navigate('/');
                                }

                                // Only close the mobile drawer when it's an actual navigation item
                                if (onNavigate) onNavigate();
                            }}
                        >
                            <div className='flex items-center space-x-2'>
                                <span>{item.icon}</span>
                                <span>{item.title}</span>
                            </div>
                            {item.dropdown && (
                                <FaChevronDown className={`transition-transform duration-200 ${openDropdown === item.title ? 'rotate-180' : 'rotate-0'}`} />
                            )}
                        </div>

                        {item.dropdown && openDropdown === item.title && (
                            <ul className='pl-8 mt-1 space-y-1 bg-slate-100'>
                                {item.dropdown.map((subItem, subIndex) => (
                                    <li key={subIndex} className='p-1 cursor-pointer rounded'>
                                        {subItem}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LeftAside;