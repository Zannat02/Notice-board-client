import React from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { FiChevronLeft } from 'react-icons/fi';
import NoticeTable from '../components/NoticeTable';

const DraftNotices = () => {
    const notices = useLoaderData();
    const navigate = useNavigate();

    const draftNotices = notices.filter(notice => notice.status === 'Unpublished');

    return (
        <div className='-mb-10 p-3 md:p-6'>

            <div className='flex items-center gap-3 mb-6'>
                <div
                    className="p-2 border border-gray-300 rounded cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <FiChevronLeft className="text-gray-700" />
                </div>
                <div>
                    <h2 className='text-xl md:text-2xl font-bold'>All Draft Notices</h2>
                    <p className='text-gray-600 text-sm md:text-base'>
                        Total Drafts: {draftNotices.length}
                    </p>
                </div>
            </div>

            {draftNotices.length > 0 ? (
                <NoticeTable notices={draftNotices} />
            ) : (
                <div className="m-5 bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
                    No draft notices found.
                </div>
            )}
        </div>
    );
};

export default DraftNotices;