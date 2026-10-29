import React, { useEffect, useRef } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { FiX } from 'react-icons/fi';

const formatDate = (value) => {
    if (!value) return '';
    const date = parseISO(value);
    return isValid(date) ? format(date, 'dd MMMM yyyy') : value;
};

const formatDateTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    return isNaN(date) ? '' : format(date, 'dd MMM yyyy, hh:mm a');
};

const statusClass = (status) =>
    status === 'Published'
        ? 'bg-green-100 text-green-700'
        : 'bg-yellow-100 text-yellow-700';

const Detail = ({ label, full = false, children }) => (
    <div className={full ? 'sm:col-span-2' : ''}>
        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
        <dd className="mt-1 break-words text-gray-900">{children || '—'}</dd>
    </div>
);

const NoticeDetailsModal = ({ notice, onClose, onEdit }) => {
    const closeButtonRef = useRef(null);
    const onCloseRef = useRef(onClose);
    const isOpen = Boolean(notice);

    // Always call the latest onClose without re-running the effect below
    useEffect(() => {
        onCloseRef.current = onClose;
    });

    useEffect(() => {
        if (!isOpen) return;

        const handleKey = (event) => {
            if (event.key === 'Escape') onCloseRef.current();
        };
        document.addEventListener('keydown', handleKey);

        // Stop the page behind the modal from scrolling
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeButtonRef.current?.focus();

        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    if (!notice) return null;

    // Older notices may use the "Notice Type" / "Uploaded File" keys
    const status = notice.status || 'Unpublished';
    const types = (notice.NoticeType || notice['Notice Type'] || '')
        .split(',')
        .map((type) => type.trim())
        .filter(Boolean);
    const attachment = notice.UploadedFile || notice['Uploaded File'];
    const created = formatDateTime(notice.createdAt);
    const updated = formatDateTime(notice.updatedAt);

    return (
        <div
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            {/* Bottom sheet on phones, centered dialog on tablet and desktop */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="notice-details-title"
                className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:max-h-[85dvh] sm:max-w-2xl sm:rounded-2xl"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-gray-200 p-4 sm:p-6">
                    <div className="min-w-0">
                        <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${statusClass(status)}`}
                        >
                            {status}
                        </span>
                        <h3
                            id="notice-details-title"
                            className="mt-2 break-words text-lg font-bold text-gray-900 sm:text-xl"
                        >
                            {notice.NoticeTitle}
                        </h3>
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="shrink-0 rounded border border-gray-300 bg-white p-2 text-gray-600 hover:bg-gray-50"
                    >
                        <FiX />
                    </button>
                </div>

                {/* Body (scrolls when the notice is long) */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Detail label="Target">{notice.Target}</Detail>
                        <Detail label="Publish Date">{formatDate(notice.PublishDate)}</Detail>

                        <Detail label="Notice Type" full>
                            {types.length > 0 && (
                                <span className="flex flex-wrap gap-2">
                                    {types.map((type) => (
                                        <span
                                            key={type}
                                            className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                                        >
                                            {type}
                                        </span>
                                    ))}
                                </span>
                            )}
                        </Detail>

                        <Detail label="Employee Name">{notice.EmployeeName}</Detail>
                        <Detail label="Designation">{notice.Designation}</Detail>
                        <Detail label="Position">{notice.Position}</Detail>
                        <Detail label="Attachment">
                            {attachment ? `📎 ${attachment}` : 'No attachment'}
                        </Detail>

                        <Detail label="Notice Body" full>
                            {notice.NoticeBody && (
                                <span className="whitespace-pre-wrap">{notice.NoticeBody}</span>
                            )}
                        </Detail>
                    </dl>

                    {(created || updated) && (
                        <div className="mt-6 flex flex-col gap-1 border-t border-gray-200 pt-4 text-xs text-gray-500 sm:flex-row sm:gap-6">
                            {created && <p>Created: {created}</p>}
                            {updated && <p>Last updated: {updated}</p>}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse gap-2 border-t border-gray-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end sm:p-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50"
                    >
                        Close
                    </button>
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(notice)}
                            className="rounded bg-blue-500 px-4 py-2 text-white hover:opacity-90"
                        >
                            Edit Notice
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoticeDetailsModal;