import React, { useState } from 'react';
import { useNavigate, useRevalidator } from 'react-router';
import Swal from 'sweetalert2';
import API_URL from '../config';

const statusClass = (status) =>
    status === 'Published'
        ? 'bg-green-100 text-green-700'
        : 'bg-yellow-100 text-yellow-700';

const NoticeTable = ({ notices }) => {
    const navigate = useNavigate();
    const revalidator = useRevalidator();
    const [busyId, setBusyId] = useState(null);

    const handleEdit = (id) => navigate(`/notice-board/${id}`);

    // DELETE /notices/:id
    const handleDelete = async (notice) => {
        const result = await Swal.fire({
            title: 'Delete this notice?',
            text: `“${notice.NoticeTitle}” will be permanently deleted.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Yes, delete'
        });
        if (!result.isConfirmed) return;

        try {
            setBusyId(notice._id);
            const res = await fetch(`${API_URL}/notices/${notice._id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to delete notice');

            await Swal.fire({
                icon: 'success',
                title: 'Notice deleted',
                timer: 1500,
                showConfirmButton: false
            });
            revalidator.revalidate(); // reload the list from the server
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Delete failed', text: err.message });
        } finally {
            setBusyId(null);
        }
    };

    // PATCH /notices/:id with { status: 'Published' }
    const handlePublish = async (notice) => {
        try {
            setBusyId(notice._id);
            const res = await fetch(`${API_URL}/notices/${notice._id}`, {
                method: 'PATCH',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ status: 'Published' })
            });
            const data = await res.json();

            if (!res.ok) {
                // Draft is incomplete: the server tells us what is missing
                const goEdit = await Swal.fire({
                    icon: 'warning',
                    title: 'Cannot publish yet',
                    text: `${data.error || 'Failed to publish notice'}. Edit the notice to complete it.`,
                    showCancelButton: true,
                    confirmButtonText: 'Edit notice'
                });
                if (goEdit.isConfirmed) handleEdit(notice._id);
                return;
            }

            await Swal.fire({
                icon: 'success',
                title: 'Notice published',
                timer: 1500,
                showConfirmButton: false
            });
            revalidator.revalidate();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Publish failed', text: err.message });
        } finally {
            setBusyId(null);
        }
    };

    const renderActions = (notice) => {
        const busy = busyId === notice._id;
        const isDraft = notice.status !== 'Published';

        return (
            <div className="flex flex-wrap justify-end gap-2">
                {isDraft && (
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => handlePublish(notice)}
                        className="px-2 py-1 bg-green-600 text-white rounded text-sm whitespace-nowrap disabled:opacity-50"
                    >
                        Publish
                    </button>
                )}
                <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleEdit(notice._id)}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-sm whitespace-nowrap disabled:opacity-50"
                >
                    Edit
                </button>
                <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleDelete(notice)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm whitespace-nowrap disabled:opacity-50"
                >
                    Delete
                </button>
            </div>
        );
    };

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
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notices.map((notice, index) => (
                            <tr key={notice._id}>
                                <th>{index + 1}</th>
                                <td className="max-w-[200px] truncate">{notice.NoticeTitle}</td>
                                <td>{notice.NoticeType || notice['Notice Type']}</td>
                                <td>{notice.Target}</td>
                                <td>{notice.PublishDate}</td>
                                <td>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusClass(notice.status)}`}
                                    >
                                        {notice.status ? notice.status : 'Unpublished'}
                                    </span>
                                </td>
                                <td>{renderActions(notice)}</td>
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
                                className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusClass(notice.status)}`}
                            >
                                {notice.status ? notice.status : 'Unpublished'}
                            </span>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="break-words">
                                <span className="font-medium text-gray-700">Type: </span>
                                {notice.NoticeType || notice['Notice Type']}
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

                        <div className="mt-3">{renderActions(notice)}</div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default NoticeTable;