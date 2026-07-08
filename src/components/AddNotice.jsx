import React, { useState, useRef } from 'react';
import { FaChevronDown, FaCheck } from 'react-icons/fa';
import { FiChevronLeft } from 'react-icons/fi';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const AddNotice = () => {
    const [targetOpen, setTargetOpen] = useState(false);
    const [targetValue, setTargetValue] = useState('');
    const [designationOpen, setDesignationOpen] = useState(false);
    const [designationValue, setDesignationValue] = useState('');
    const [noticeTypeOpen, setNoticeTypeOpen] = useState(false);
    const [noticeTypeValue, setNoticeTypeValue] = useState([]);
    const [publishDate, setPublishDate] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
     const navigate = useNavigate();

    const formRef = useRef(null);

    const targetOptions = ['All Department', 'Individual'];
    const designationOptions = ['Manager', 'Developer', 'Designer', 'HR'];
    const noticeTypeOptions = [
        'Warning / Disciplinary',
        'Performance Improvement',
        'Appreciation / Recognitio',
        'Attendance / Leave Issue',
        'Payroll / Compensation',
        'Contract / Role Update',
        'Advisory / Personal Reminder'
    ];

    const toggleNoticeType = (option) => {
        if (noticeTypeValue.includes(option)) {
            setNoticeTypeValue(noticeTypeValue.filter(item => item !== option));
        } else {
            setNoticeTypeValue([...noticeTypeValue, option]);
        }
    };


    const handlePublish = (e) => {
        e.preventDefault();
        const form = formRef.current;
        const formData = new FormData(form);


        formData.set('Notice Type', noticeTypeValue.join(', '));
        formData.set('Uploaded File', uploadedFile ? uploadedFile.name : '');
        formData.set('status', 'Published');


        const newNotice = Object.fromEntries(formData.entries());


        const requiredFields = ['Target', 'Designation', 'EmployeeName', 'Position', 'NoticeTitle', 'Notice Type', 'PublishDate', 'NoticeBody'];
        const emptyFields = requiredFields.filter(field => !newNotice[field] || newNotice[field].trim() === '');

        if (emptyFields.length > 0) {
            alert(`Please fill all required fields: ${emptyFields.join(', ')}`);
            return;
        }

        console.log('Form Data:', newNotice);

        // send notice data to the db

        fetch('http://localhost:3000/notices', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newNotice)
        })
            .then(res => res.json())
            .then(data => {
                if (data.insertedId) {
                    console.log('added successfully')

                    Swal.fire({
                        title: "Notice Published Successfully !",
                        html: `Your notice <strong>“${newNotice.NoticeTitle} – ${newNotice.PublishDate}”</strong> has been published and is now visible to all selected departments.`,
                        icon: "success",
                        draggable: true
                    });
                    form.reset()
                }

            })
    };

    // Save as Draft handler
    const handleSaveDraft = (e) => {
        e.preventDefault();
        const form = formRef.current;
        const formData = new FormData(form);

        formData.set('Notice Type', noticeTypeValue.join(', '));
        formData.set('Uploaded File', uploadedFile ? uploadedFile.name : '');
        formData.set('status', 'Unpublished'); 

        const newNotice = Object.fromEntries(formData.entries());

        const requiredFields = ['Target', 'Designation', 'EmployeeName', 'Position', 'NoticeTitle', 'Notice Type', 'PublishDate', 'NoticeBody'];
        const emptyFields = requiredFields.filter(field => !newNotice[field] || newNotice[field].trim() === '');

        if (emptyFields.length > 0) {
            alert(`Please fill all required fields: ${emptyFields.join(', ')}`);
            return;
        }

        fetch('http://localhost:3000/notices', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(newNotice)
        })
            .then(res => res.json())
            .then(data => {
                if (data.insertedId) {
                    Swal.fire({
                        title: "Notice Saved as Draft!",
                        icon: "info",
                        draggable: true
                    });
                    form.reset();
                }
            });
    };


    return (
        <div className="p-6">

            <div className="flex items-center space-x-3 mb-6">
                <div
                    className="p-2 border border-gray-300 rounded cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <FiChevronLeft className="text-gray-700" />
                </div>
                <h2 className="text-xl font-bold">Create a Notice</h2>
            </div>


            <form ref={formRef} className='bg-white border border-gray-300 rounded-2xl overflow-hidden'>
                <div className="bg-gray-100 p-4 rounded">
                    <p className="text-gray-700 font-medium mb-2">
                        Please fill in the details below
                    </p>
                </div>
                <hr className="border-gray-300" />


                <div className="bg-gray-100 p-4 m-6 rounded-xl relative">
                    <label className="font-medium mb-2 block">
                        <span className="text-red-500">*</span> Target Department(s) or Individual
                    </label>
                    <div className="relative">
                        <input
                            name="Target"
                            type="text"
                            readOnly
                            value={targetValue}
                            onClick={() => setTargetOpen(!targetOpen)}
                            placeholder="Select target"
                            className="w-full bg-gray-100 border border-slate-200 p-2 rounded pl-8 cursor-pointer"
                        />
                        <FaChevronDown className="absolute right-2 top-2.5 text-gray-700" />
                        {targetOpen && (
                            <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 rounded shadow z-10">
                                {targetOptions.map((opt, idx) => (
                                    <li
                                        key={idx}
                                        className="p-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => {
                                            setTargetValue(opt);
                                            setTargetOpen(false);
                                        }}
                                    >
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

              
                <div className="m-6 space-y-6">
                    <div>
                        <label className="font-medium mb-2 block">
                            <span className="text-red-500">*</span> Notice Title
                        </label>
                        <input
                            name="NoticeTitle"
                            type="text"
                            placeholder="Notice Title"
                            className="w-full border border-gray-100 p-2 rounded"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <label className="font-medium mb-2 block">
                                <span className="text-red-500">*</span> Select Employee ID
                            </label>
                            <div className="relative">
                                <input
                                    name="Designation"
                                    type="text"
                                    readOnly
                                    value={designationValue}
                                    onClick={() => setDesignationOpen(!designationOpen)}
                                    placeholder="Select employee designation"
                                    className="w-full border border-gray-100 p-2 rounded cursor-pointer"
                                />
                                <FaChevronDown className="absolute right-2 top-2.5 text-gray-700" />
                                {designationOpen && (
                                    <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 rounded shadow z-10">
                                        {designationOptions.map((opt, idx) => (
                                            <li
                                                key={idx}
                                                className="p-2 cursor-pointer hover:bg-gray-100"
                                                onClick={() => {
                                                    setDesignationValue(opt);
                                                    setDesignationOpen(false);
                                                }}
                                            >
                                                {opt}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="font-medium mb-2 block">
                                <span className="text-red-500">*</span> Employee Name
                            </label>
                            <input
                                name="EmployeeName"
                                type="text"
                                placeholder="Employee Name"
                                className="w-full border border-gray-100 p-2 rounded"
                            />
                        </div>

                        <div className="flex-1">
                            <label className="font-medium mb-2 block">
                                <span className="text-red-500">*</span> Position
                            </label>
                            <input
                                name="Position"
                                type="text"
                                placeholder="Position"
                                className="w-full border border-gray-100 p-2 rounded"
                            />
                        </div>
                    </div>

                   
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <label className="font-medium mb-2 block">
                                <span className="text-red-500">*</span> Notice Type
                            </label>
                            <div className="relative">
                                <input
                                    name="NoticeType"
                                    type="text"
                                    readOnly
                                    value={noticeTypeValue.join(', ')}
                                    onClick={() => setNoticeTypeOpen(!noticeTypeOpen)}
                                    placeholder="Select Notice Type"
                                    className="w-full border border-gray-100 p-2 rounded cursor-pointer"
                                />
                                <FaChevronDown className="absolute right-2 top-2.5 text-gray-700" />
                                {noticeTypeOpen && (
                                    <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 rounded shadow z-10 max-h-48 overflow-y-auto">
                                        {noticeTypeOptions.map((opt, idx) => (
                                            <li
                                                key={idx}
                                                className="p-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                onClick={() => toggleNoticeType(opt)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={noticeTypeValue.includes(opt)}
                                                    readOnly
                                                    className="mr-2"
                                                />
                                                {opt}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="font-medium mb-2 block">
                                <span className="text-red-500">*</span> Publish Date
                            </label>
                            <input
                                name="PublishDate"
                                type="date"
                                value={publishDate}
                                onChange={(e) => setPublishDate(e.target.value)}
                                className="w-full border border-gray-100 p-2 rounded cursor-pointer"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="font-medium mb-2 block">Notice Body</label>
                        <textarea
                            name="NoticeBody"
                            rows="5"
                            placeholder="Write the details about notice"
                            className="w-full border border-gray-100 p-3 rounded resize-none"
                        ></textarea>
                    </div>

                    
                    <div>
                        <p className="font-medium mb-2">Upload Attachments (optional)</p>
                        <label className="border-2 border-dashed border-green-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer">
                            <IoCloudUploadOutline className="text-4xl text-green-500 mb-2" />
                            <p>
                                <span className="text-green-600 font-medium">Upload</span> nominee profile image or drag and drop
                            </p>
                            <p className="text-sm text-gray-500">Accepted File Type: jpg, png</p>

                            <input
                                type="file"
                                accept=".jpg,.png"
                                className="hidden"
                                onChange={(e) => setUploadedFile(e.target.files[0])}
                            />
                        </label>

                        {uploadedFile && (
                            <div className="mt-3 inline-flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg">
                                <p className="text-sm">
                                    📎 <span className="font-medium">{uploadedFile.name}</span>
                                </p>
                                <button
                                    onClick={() => setUploadedFile(null)}
                                    className="text-gray-500 hover:text-red-500 font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 m-8">
                    <button className="px-6 py-2 rounded-2xl border border-gray-300 text-black hover:bg-gray-50">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSaveDraft}  
                        className="px-6 py-2 rounded-2xl border border-sky-500 text-sky-500 hover:bg-sky-50"
                    >
                        Save as Draft
                    </button>
                    <button
                        type="submit"
                        onClick={handlePublish}
                        className="px-6 py-2 rounded-2xl flex items-center gap-2 bg-[#F95524] text-white hover:opacity-90"
                    >
                        <FaCheck /> Publish Notice
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddNotice;

