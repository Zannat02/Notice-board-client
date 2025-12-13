import React from 'react';

const NoticeTable = ({ notices }) => {
    return (
        <div className="overflow-x-auto border border-gray-200 m-5 rounded bg-white">
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
                            <td>{notice.NoticeTitle}</td>
                            <td>{notice['Notice Type']}</td>
                            <td>{notice.Target}</td>
                            <td>{notice.PublishDate}</td>
                            <td>
                                {notice.status ? notice.status : 'Unpublished'}
                            </td>
                            <td>
                                {/* Optional: future buttons like edit/delete */}
                                <button className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NoticeTable;
