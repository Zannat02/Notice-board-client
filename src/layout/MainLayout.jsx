import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { FiX } from 'react-icons/fi';
import Header from '../components/Header';
import LeftAside from '../components/LeftAside';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="grid grid-cols-12 min-h-screen relative">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block lg:col-span-2 bg-white text-black self-start min-h-screen">
                <LeftAside />
            </aside>

            {/* Mobile / Tablet Sidebar - overlay drawer */}
            {sidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>

                    <aside className="fixed top-0 left-0 h-full w-72 max-w-[80%] bg-white z-50 shadow-lg overflow-y-auto lg:hidden">
                        <div className="flex justify-end p-3">
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-2xl text-gray-600"
                                aria-label="Close menu"
                            >
                                <FiX />
                            </button>
                        </div>
                        <LeftAside onNavigate={() => setSidebarOpen(false)} />
                    </aside>
                </>
            )}

            <section className="col-span-12 lg:col-span-10 flex flex-col min-h-screen">

                <div className="h-16 bg-white shadow shrink-0">
                    <Header onMenuClick={() => setSidebarOpen(true)} />
                </div>

                <div className="flex-1 p-4 md:p-6 bg-gray-100">
                    <Outlet />
                </div>

            </section>

        </div>
    );
};

export default MainLayout;