import React from 'react';
import { Outlet } from 'react-router';
import Header from '../components/Header';
import LeftAside from '../components/LeftAside';

const MainLayout = () => {
    return (
        <div className=" grid grid-cols-12  -mb-10">


            <aside className="col-span-2 bg-white text-black self-start">
                <LeftAside />
            </aside>


            <section className="col-span-10 flex flex-col">


                <div className="h-16 bg-white shadow">
                    <Header />
                </div>


                <div className="flex-1 p-6 -mb-10 bg-gray-100">
                    <Outlet />
                </div>

            </section>

        </div>


    )

};

export default MainLayout;


