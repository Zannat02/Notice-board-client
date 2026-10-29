import React, { useMemo, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { FiSearch, FiX } from 'react-icons/fi';
import NoticeTable from '../components/NoticeTable';

const STATUS_TABS = [
    { label: 'All', value: 'All' },
    { label: 'Published', value: 'Published' },
    { label: 'Draft', value: 'Unpublished' }
];

// Older notices may use "Notice Type" and may have no status
const splitTypes = (notice) =>
    (notice.NoticeType || notice['Notice Type'] || '')
        .split(',')
        .map((type) => type.trim())
        .filter(Boolean);

const getStatus = (notice) => notice.status || 'Unpublished';

const selectClass =
    'w-full rounded border border-gray-300 bg-white p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300';

const Home = () => {
    const notices = useLoaderData();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('All');
    const [type, setType] = useState('All');
    const [target, setTarget] = useState('All');

    const activeCount = notices.filter((notice) => getStatus(notice) === 'Published').length;
    const draftCount = notices.filter((notice) => getStatus(notice) === 'Unpublished').length;

    // Filter options come from the notices that exist
    const typeOptions = useMemo(() => {
        const types = new Set();
        notices.forEach((notice) => splitTypes(notice).forEach((t) => types.add(t)));
        return [...types].sort();
    }, [notices]);

    const targetOptions = useMemo(
        () => [...new Set(notices.map((notice) => notice.Target).filter(Boolean))].sort(),
        [notices]
    );

    // If the selected option disappears (for example after deleting the last notice of
    // that type), fall back to "All" instead of showing an empty list
    const activeType = typeOptions.includes(type) ? type : 'All';
    const activeTarget = targetOptions.includes(target) ? target : 'All';

    const filteredNotices = useMemo(() => {
        const query = search.trim().toLowerCase();

        return notices.filter((notice) => {
            if (query) {
                const text = `${notice.NoticeTitle || ''} ${notice.EmployeeName || ''}`.toLowerCase();
                if (!text.includes(query)) return false;
            }
            if (status !== 'All' && getStatus(notice) !== status) return false;
            if (activeType !== 'All' && !splitTypes(notice).includes(activeType)) return false;
            if (activeTarget !== 'All' && notice.Target !== activeTarget) return false;
            return true;
        });
    }, [notices, search, status, activeType, activeTarget]);

    const hasFilters =
        search.trim() !== '' || status !== 'All' || activeType !== 'All' || activeTarget !== 'All';

    const clearFilters = () => {
        setSearch('');
        setStatus('All');
        setType('All');
        setTarget('All');
    };

    return (
        <div className='-mb-10 p-3 md:p-6'>

            <div className='flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6'>

                <div>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-900'>Notice Management</h2>
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

            {/* Search and filters */}
            <div className='mx-5 space-y-3'>
                <div className='relative'>
                    <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                    <input
                        type='text'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='Search by title or employee name'
                        aria-label='Search notices'
                        className='w-full rounded border border-gray-300 bg-white py-2 pl-9 pr-9 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300'
                    />
                    {search && (
                        <button
                            type='button'
                            aria-label='Clear search'
                            onClick={() => setSearch('')}
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800'
                        >
                            <FiX />
                        </button>
                    )}
                </div>

                <div className='flex flex-wrap gap-2'>
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab.value}
                            type='button'
                            aria-pressed={status === tab.value}
                            onClick={() => setStatus(tab.value)}
                            className={`px-4 py-1.5 rounded-full border text-sm font-medium ${
                                status === tab.value
                                    ? 'bg-orange-700 border-orange-700 text-white'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    <select
                        value={activeType}
                        onChange={(e) => setType(e.target.value)}
                        aria-label='Filter by notice type'
                        className={selectClass}
                    >
                        <option value='All'>All notice types</option>
                        {typeOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                    <select
                        value={activeTarget}
                        onChange={(e) => setTarget(e.target.value)}
                        aria-label='Filter by target'
                        className={selectClass}
                    >
                        <option value='All'>All targets</option>
                        {targetOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className='flex items-center justify-between text-sm text-gray-600'>
                    <p>
                        Showing {filteredNotices.length} of {notices.length} notices
                    </p>
                    {hasFilters && (
                        <button
                            type='button'
                            onClick={clearFilters}
                            className='text-orange-700 underline hover:opacity-80'
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {/* Notice Table */}
            {filteredNotices.length > 0 ? (
                <NoticeTable notices={filteredNotices} />
            ) : (
                <div className='m-5 bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500'>
                    {notices.length === 0
                        ? 'No notices yet. Click “Create Notice” to add the first one.'
                        : 'No notices match your search or filters.'}
                </div>
            )}
        </div>
    );
};

export default Home;