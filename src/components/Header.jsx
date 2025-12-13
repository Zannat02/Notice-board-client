import React from 'react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { format } from 'date-fns';
import ProfilePic from '../assets/profilePic.jpg'; 

const Header = () => {
    return (
        <div className="flex justify-between items-center px-6 bg-white h-16 shadow">
            
           
            <div className="flex flex-col justify-center">
                <h2 className="text-lg font-semibold">Good Afternoon Asif</h2>
                <p className="text-sm text-gray-500">
                    {format(new Date(), " dd MMMM  , yyyy")}
                </p>
            </div>

         
            <div className="flex items-center space-x-4">

               
                <IoIosNotificationsOutline className="text-2xl text-gray-700 cursor-pointer" />

                
                <div className="w-px h-12 bg-gray-300"></div>

                
                <div className="flex flex-col justify-center text-right">
                    <span className="font-medium">Asif Riaj</span>
                    <span className="text-sm text-gray-500">HR</span>
                </div>

               
                <img 
                    src={ProfilePic} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover"
                />
            </div>

        </div>
    );
};

export default Header;
