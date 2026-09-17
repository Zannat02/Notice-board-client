import React from 'react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { HiMenu } from 'react-icons/hi';
import { format } from 'date-fns';
import ProfilePic from '../assets/profilePic.jpg';

const Header = ({ onMenuClick }) => {
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
                    <h2 className="text-base md:text-lg font-semibold">Good Afternoon Asif</h2>
                    <p className="text-xs md:text-sm text-gray-500">
                        {format(new Date(), " dd MMMM  , yyyy")}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
                <IoIosNotificationsOutline className="text-xl md:text-2xl text-gray-700 cursor-pointer" />

                <div className="hidden sm:block w-px h-12 bg-gray-300"></div>

                <div className="hidden sm:flex flex-col justify-center text-right">
                    <span className="font-medium">Asif Riaj</span>
                    <span className="text-sm text-gray-500">HR</span>
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