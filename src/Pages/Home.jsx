
import React from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import NoticeTable from '../components/NoticeTable';

const Home = () => {
    const notices = useLoaderData();
    const navigate = useNavigate();

   
    const activeCount = notices.filter(notice => notice.status === 'Published').length;
    const draftCount = notices.filter(notice => notice.status === 'Unpublished').length;

    return (
        <div className='-mb-10 p-6'>
           
            <div className='flex justify-between items-center mb-6'>
               
                <div>
                    <h2 className='text-2xl font-bold mb-2'>Notice Management</h2>
                    <div className='flex gap-2'>
                        <p className='text-gray-600'>Active Notices: {activeCount}</p>
                    <p className='text-gray-600'>Draft Notices: {draftCount}</p>
                    </div>
                </div>

                {/* Right Side */}
                <div className='flex gap-4'>
                    <button
                        onClick={() => navigate('/notice-board')}
                        className='px-4 py-2 rounded bg-orange-700 text-white hover:opacity-90'
                    >
                        Create Notice
                    </button>
                    <button className='px-4 py-2 rounded border border-orange-700 text-orange-700 hover:bg-orange-50'>
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
