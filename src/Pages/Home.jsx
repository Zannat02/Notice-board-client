import React from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import NoticeTable from '../components/NoticeTable';

const Home = () => {
    const notices = useLoaderData();
    const navigate = useNavigate();

    const activeCount = notices.filter(notice => notice.status === 'Published').length;
    const draftCount = notices.filter(notice => notice.status === 'Unpublished').length;

    return (
        <div className='-mb-10 p-3 md:p-6'>

            <div className='flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6'>

                <div>
                    <h2 className='text-xl md:text-2xl font-bold mb-2'>Notice Management</h2>
                    <div className='flex flex-wrap gap-2 md:gap-4'>
                        <p className='text-gray-600 text-sm md:text-base'>Active Notices: {activeCount}</p>
                        <p className='text-gray-600 text-sm md:text-base'>Draft Notices: {draftCount}</p>
                    </div>
                </div>

                {/* Right Side */}
                <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
                    <button
                        onClick={() => navigate('/notice-board')}
                        className='px-4 py-2 rounded bg-orange-700 text-white hover:opacity-90 whitespace-nowrap'
                    >
                        Create Notice
                    </button>
                    <button
                        onClick={() => navigate('/draft-notices')}
                        className='px-4 py-2 rounded border border-orange-700 text-orange-700 hover:bg-orange-50 whitespace-nowrap'
                    >
                        All Draft Notice
                    </button>
                </div>
            </div>

            {/* Notice Table */}
            <div>
                <NoticeTable notices={notices} />
            </div>
        </div>
    );
};

export default Home;