import React from 'react';

const NoticeTable = ({ notices }) => {
    return (
        <div className="m-5">

            {/* Desktop Table View (lg and above only) */}
            <div className="hidden lg:block overflow-x-auto border border-gray-200 rounded bg-white">
                <table className="table table-xs w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Notice Type</th>
                            <th>Departments / Individual</th>
                            <th>Published On</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notices.map((notice, index) => (
                            <tr key={notice._id}>
                                <th>{index + 1}</th>
                                <td className="max-w-[200px] truncate">{notice.NoticeTitle}</td>
                                <td>{notice['Notice Type']}</td>
                                <td>{notice.Target}</td>
                                <td>{notice.PublishDate}</td>
                                <td>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                            notice.status === 'Published'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                    >
                                        {notice.status ? notice.status : 'Unpublished'}
                                    </span>
                                </td>
                                <td>
                                    <button className="px-2 py-1 bg-blue-500 text-white rounded whitespace-nowrap">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Card View - Mobile & Tablet (below lg) */}
            <div className="lg:hidden space-y-3">
                {notices.map((notice, index) => (
                    <div
                        key={notice._id}
                        className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm"
                    >
                        <div className="flex justify-between items-start gap-2 mb-2">
                            <h3 className="font-semibold text-gray-800 min-w-0 break-words">
                                {index + 1}. {notice.NoticeTitle}
                            </h3>
                            <span
                                className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                    notice.status === 'Published'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}
                            >
                                {notice.status ? notice.status : 'Unpublished'}
                            </span>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="break-words">
                                <span className="font-medium text-gray-700">Type: </span>
                                {notice['Notice Type']}
                            </p>
                            <p className="break-words">
                                <span className="font-medium text-gray-700">Target: </span>
                                {notice.Target}
                            </p>
                            <p>
                                <span className="font-medium text-gray-700">Published On: </span>
                                {notice.PublishDate}
                            </p>
                        </div>

                        <div className="mt-3 flex justify-end">
                            <button className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm">
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default NoticeTable;