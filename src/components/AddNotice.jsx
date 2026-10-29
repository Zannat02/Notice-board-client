import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { FaChevronDown, FaCheck } from 'react-icons/fa';
import { FiChevronLeft } from 'react-icons/fi';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useNavigate, useParams, useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import API_URL from '../config';

const TARGET_OPTIONS = ['All Department', 'Individual'];
const DESIGNATION_OPTIONS = ['Manager', 'Developer', 'Designer', 'HR'];
const NOTICE_TYPE_OPTIONS = [
    'Warning / Disciplinary',
    'Performance Improvement',
    'Appreciation / Recognition',
    'Attendance / Leave Issue',
    'Payroll / Compensation',
    'Contract / Role Update',
    'Advisory / Personal Reminder'
];


const REQUIRED_FIELDS = [
    'Target',
    'NoticeTitle',
    'Designation',
    'EmployeeName',
    'Position',
    'NoticeType',
    'PublishDate',
    'NoticeBody'
];

const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];

const INITIAL_FORM = {
    Target: '',
    NoticeTitle: '',
    Designation: '',
    EmployeeName: '',
    Position: '',
    NoticeType: [],
    PublishDate: '',
    NoticeBody: ''
};


const toFormState = (notice) => ({
    Target: notice.Target || '',
    NoticeTitle: notice.NoticeTitle || '',
    Designation: notice.Designation || '',
    EmployeeName: notice.EmployeeName || '',
    Position: notice.Position || '',
    NoticeType: (notice.NoticeType || notice['Notice Type'] || '')
        .split(', ')
        .map((type) => type.trim())
        .filter(Boolean)
      
        .map((type) => (type === 'Appreciation / Recognitio' ? 'Appreciation / Recognition' : type)),
    PublishDate: notice.PublishDate || '',
    NoticeBody: notice.NoticeBody || ''
});

const isEmpty = (value) =>
    Array.isArray(value) ? value.length === 0 : !String(value).trim();



const FieldLabel = ({ htmlFor, required, children }) => (
    <label htmlFor={htmlFor} className="font-medium mb-2 block text-gray-900">
        {required && <span className="text-red-500">*</span>} {children}
    </label>
);

const ErrorText = () => (
    <p className="mt-1 text-sm text-red-500">This field is required</p>
);

const inputClass = (error) =>
    `w-full bg-white border p-2 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 ${
        error ? 'border-red-500' : 'border-gray-300'
    }`;

const TextField = ({ label, required, error, ...inputProps }) => {
    const id = useId();
    return (
        <div className="flex-1 min-w-0">
            <FieldLabel htmlFor={id} required={required}>{label}</FieldLabel>
            <input id={id} className={inputClass(error)} {...inputProps} />
            {error && <ErrorText />}
        </div>
    );
};


const useClickOutside = (ref, onOutside) => {
    useEffect(() => {
        const handler = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onOutside();
            }
        };
        document.addEventListener('pointerdown', handler);
        return () => document.removeEventListener('pointerdown', handler);
    }, [ref, onOutside]);
};


const Dropdown = ({ label, required, placeholder, options, value, onChange, multiple = false, error }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const id = useId();
    const close = useCallback(() => setOpen(false), []);
    useClickOutside(ref, close);

    const selected = multiple ? value : value ? [value] : [];
    const displayText = selected.join(', ');

    const handleSelect = (option) => {
        if (multiple) {
            onChange(
                value.includes(option)
                    ? value.filter((item) => item !== option)
                    : [...value, option]
            );
        } else {
            onChange(option);
            setOpen(false);
        }
    };

    return (
        <div
            ref={ref}
            className="flex-1 min-w-0 relative"
            onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        >
            <FieldLabel htmlFor={id} required={required}>{label}</FieldLabel>

            <button
                id={id}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
                className={`${inputClass(error)} flex items-center justify-between gap-2 text-left cursor-pointer`}
            >
                <span className={`truncate ${displayText ? 'text-gray-900' : 'text-gray-400'}`}>
                    {displayText || placeholder}
                </span>
                <FaChevronDown
                    className={`shrink-0 text-gray-700 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {error && <ErrorText />}

            {open && (
                <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto overscroll-contain rounded border border-gray-300 bg-white shadow-xl">
                    {options.map((option) => {
                        const isSelected = selected.includes(option);
                        return (
                            <li key={option} className="bg-white">
                                <button
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-gray-900 hover:bg-gray-100 ${
                                        isSelected ? 'bg-orange-50' : 'bg-white'
                                    }`}
                                >
                                    {multiple && (
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            readOnly
                                            tabIndex={-1}
                                            className="pointer-events-none"
                                        />
                                    )}
                                    <span className="flex-1">{option}</span>
                                    {!multiple && isSelected && (
                                        <FaCheck className="text-orange-600" />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};


const AddNotice = () => {
 
    const notice = useLoaderData();
    const { id } = useParams();
    const isEdit = Boolean(id && notice);
    const isPublishedNotice = isEdit && notice.status === 'Published';

    const [form, setForm] = useState(() => (isEdit ? toFormState(notice) : INITIAL_FORM));
    const [errors, setErrors] = useState({});
    
    const [attachmentName, setAttachmentName] = useState(
        isEdit ? notice.UploadedFile || notice['Uploaded File'] || '' : ''
    );
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

  
    useEffect(() => {
        setForm(isEdit ? toFormState(notice) : INITIAL_FORM);
        setAttachmentName(isEdit ? notice.UploadedFile || notice['Uploaded File'] || '' : '');
        setErrors({});
      
    }, [id]);

    const setField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => ({ ...prev, [key]: false }));
        }
    };

    const resetForm = () => {
        setForm(INITIAL_FORM);
        setErrors({});
        setAttachmentName('');
    };

    const handleFile = (file) => {
        if (!file) return;
        if (!ACCEPTED_TYPES.includes(file.type)) {
            Swal.fire({
                icon: 'warning',
                title: 'Unsupported file',
                text: 'Only JPG and PNG files are allowed.'
            });
            return;
        }
        setAttachmentName(file.name);
    };

    const submitNotice = async (status) => {
        if (submitting) return;

        // Publish needs every required field, a draft only needs the title
        const requiredFields = status === 'Published' ? REQUIRED_FIELDS : ['NoticeTitle'];
        const missing = requiredFields.filter((key) => isEmpty(form[key]));

        if (missing.length > 0) {
            setErrors(Object.fromEntries(missing.map((key) => [key, true])));
            Swal.fire({
                icon: 'warning',
                title: 'Missing information',
                text:
                    status === 'Published'
                        ? 'Please fill in all required fields before publishing.'
                        : 'A notice title is required to save a draft.'
            });
            return;
        }
        setErrors({});

        const payload = {
            ...form,
            NoticeType: form.NoticeType.join(', '),
            UploadedFile: attachmentName,
            status
        };

        try {
            setSubmitting(true);
            const res = await fetch(
                isEdit ? `${API_URL}/notices/${id}` : `${API_URL}/notices`,
                {
                    method: isEdit ? 'PATCH' : 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(payload)
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Something went wrong');

            if (isEdit) {
                const publishedNow = status === 'Published' && notice.status !== 'Published';
                await Swal.fire({
                    icon: 'success',
                    title: publishedNow ? 'Notice Published Successfully!' : 'Notice Updated',
                    text: publishedNow
                        ? `Your notice “${payload.NoticeTitle}” has been published.`
                        : `“${payload.NoticeTitle}” has been updated.`
                });
                navigate('/');
                return;
            }

            if (status === 'Published') {
                Swal.fire({
                    title: 'Notice Published Successfully!',
                    text: `Your notice “${payload.NoticeTitle} – ${payload.PublishDate}” has been published and is now visible to all selected departments.`,
                    icon: 'success'
                });
            } else {
                Swal.fire({ title: 'Notice Saved as Draft!', icon: 'info' });
            }
            resetForm();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: isEdit ? 'Failed to update notice' : 'Failed to save notice',
                text: err.message
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-3 md:p-6">

            <div className="flex items-center space-x-3 mb-6">
                <button
                    type="button"
                    aria-label="Go back"
                    className="p-2 border border-gray-300 rounded cursor-pointer bg-white"
                    onClick={() => navigate('/')}
                >
                    <FiChevronLeft className="text-gray-700" />
                </button>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                    {isEdit ? 'Edit Notice' : 'Create a Notice'}
                </h2>
            </div>

            <form
                noValidate
                onSubmit={(e) => e.preventDefault()}
                className="bg-white border border-gray-300 rounded-2xl"
            >
                <div className="bg-gray-100 p-4 rounded-t-2xl">
                    <p className="text-gray-700 font-medium mb-2">
                        {isEdit ? 'Update the details below' : 'Please fill in the details below'}
                    </p>
                </div>
                <hr className="border-gray-300" />

                {/* Target */}
                <div className="bg-gray-100 p-4 m-3 md:m-6 rounded-xl">
                    <Dropdown
                        label="Target Department(s) or Individual"
                        required
                        placeholder="Select target"
                        options={TARGET_OPTIONS}
                        value={form.Target}
                        onChange={(val) => setField('Target', val)}
                        error={errors.Target}
                    />
                </div>

                <div className="m-3 md:m-6 space-y-6">
                    <TextField
                        label="Notice Title"
                        required
                        type="text"
                        placeholder="Enter notice title"
                        value={form.NoticeTitle}
                        onChange={(e) => setField('NoticeTitle', e.target.value)}
                        error={errors.NoticeTitle}
                    />

              
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Dropdown
                            label="Designation"
                            required
                            placeholder="Select designation"
                            options={DESIGNATION_OPTIONS}
                            value={form.Designation}
                            onChange={(val) => setField('Designation', val)}
                            error={errors.Designation}
                        />
                        <TextField
                            label="Employee Name"
                            required
                            type="text"
                            placeholder="Enter employee name"
                            value={form.EmployeeName}
                            onChange={(e) => setField('EmployeeName', e.target.value)}
                            error={errors.EmployeeName}
                        />
                        <TextField
                            label="Position"
                            required
                            type="text"
                            placeholder="Enter position"
                            value={form.Position}
                            onChange={(e) => setField('Position', e.target.value)}
                            error={errors.Position}
                        />
                    </div>

                   
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Dropdown
                            label="Notice Type"
                            required
                            multiple
                            placeholder="Select notice type(s)"
                            options={NOTICE_TYPE_OPTIONS}
                            value={form.NoticeType}
                            onChange={(val) => setField('NoticeType', val)}
                            error={errors.NoticeType}
                        />
                        <TextField
                            label="Publish Date"
                            required
                            type="date"
                            value={form.PublishDate}
                            onChange={(e) => setField('PublishDate', e.target.value)}
                            error={errors.PublishDate}
                        />
                    </div>

                  
                    <div>
                        <FieldLabel htmlFor="notice-body" required>Notice Body</FieldLabel>
                        <textarea
                            id="notice-body"
                            rows="5"
                            placeholder="Write the notice details here"
                            value={form.NoticeBody}
                            onChange={(e) => setField('NoticeBody', e.target.value)}
                            className={`${inputClass(errors.NoticeBody)} p-3 resize-none`}
                        ></textarea>
                        {errors.NoticeBody && <ErrorText />}
                    </div>

               
                    <div>
                        <p className="font-medium mb-2 text-gray-900">Upload Attachment (optional)</p>
                        <label
                            className="border-2 border-dashed border-green-500 rounded-2xl p-5 md:p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-white"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                handleFile(e.dataTransfer.files[0]);
                            }}
                        >
                            <IoCloudUploadOutline className="text-4xl text-green-500 mb-2" />
                            <p className="text-gray-900">
                                <span className="text-green-600 font-medium">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-sm text-gray-500">Accepted file types: JPG, PNG</p>

                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => {
                                    handleFile(e.target.files[0]);
                                    e.target.value = '';
                                }}
                            />
                        </label>

                        {attachmentName && (
                            <div className="mt-3 inline-flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg">
                                <p className="text-sm truncate max-w-[200px] text-gray-900">
                                    📎 <span className="font-medium">{attachmentName}</span>
                                </p>
                                <button
                                    type="button"
                                    aria-label="Remove attachment"
                                    onClick={() => setAttachmentName('')}
                                    className="text-gray-500 hover:text-red-500 font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 m-4 md:m-8">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-6 py-2 rounded-2xl border border-gray-300 text-black hover:bg-gray-50 order-3 sm:order-1 bg-white"
                    >
                        Cancel
                    </button>

                 
                    {!isPublishedNotice && (
                        <button
                            type="button"
                            disabled={submitting}
                            onClick={() => submitNotice('Unpublished')}
                            className="px-6 py-2 rounded-2xl border border-sky-500 text-sky-500 hover:bg-sky-50 order-2 bg-white disabled:opacity-50"
                        >
                            {submitting ? 'Saving...' : isEdit ? 'Save Draft' : 'Save as Draft'}
                        </button>
                    )}

                    <button
                        type="button"
                        disabled={submitting}
                        onClick={() => submitNotice('Published')}
                        className="px-6 py-2 rounded-2xl flex items-center justify-center gap-2 bg-[#F95524] text-white hover:opacity-90 order-1 sm:order-3 disabled:opacity-50"
                    >
                        <FaCheck />{' '}
                        {submitting
                            ? 'Saving...'
                            : isPublishedNotice
                                ? 'Save Changes'
                                : 'Publish Notice'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddNotice;