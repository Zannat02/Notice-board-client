import React from 'react';

const Bar = ({ className = '' }) => <div className={`rounded bg-gray-200 ${className}`} />;

const Field = ({ labelWidth = 'w-28' }) => (
    <div className="min-w-0 flex-1 space-y-2">
        <Bar className={`h-4 ${labelWidth}`} />
        <Bar className="h-10 w-full" />
    </div>
);

const ROWS = Array.from({ length: 6 });
const CARDS = Array.from({ length: 3 });


const ListSkeleton = () => (
    <>
        <span className="sr-only">Loading notices...</span>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
                <Bar className="h-7 w-56" />
                <Bar className="h-4 w-40" />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Bar className="h-10 w-full sm:w-32" />
                <Bar className="h-10 w-full sm:w-36" />
            </div>
        </div>

        <div className="mx-5 space-y-3">
            <Bar className="h-10 w-full" />
            <div className="flex gap-2">
                <div className="h-8 w-14 rounded-full bg-gray-200" />
                <div className="h-8 w-24 rounded-full bg-gray-200" />
                <div className="h-8 w-20 rounded-full bg-gray-200" />
            </div>
        </div>

        <div className="m-5">
            {/* Table rows (lg and above) */}
            <div className="hidden rounded border border-gray-200 bg-white lg:block">
                <div className="flex items-center gap-4 border-b border-gray-200 p-3">
                    <Bar className="h-4 w-6" />
                    <Bar className="h-4 flex-1" />
                    <Bar className="h-4 w-32" />
                    <Bar className="h-4 w-28" />
                    <Bar className="h-4 w-24" />
                    <Bar className="h-4 w-20" />
                    <Bar className="h-4 w-40" />
                </div>
                {ROWS.map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 border-b border-gray-100 p-3 last:border-b-0"
                    >
                        <Bar className="h-4 w-6" />
                        <Bar className="h-4 flex-1" />
                        <Bar className="h-4 w-32" />
                        <Bar className="h-4 w-28" />
                        <Bar className="h-4 w-24" />
                        <div className="h-6 w-20 rounded-full bg-gray-200" />
                        <Bar className="h-8 w-40" />
                    </div>
                ))}
            </div>

            {/* Cards (below lg) */}
            <div className="space-y-3 lg:hidden">
                {CARDS.map((_, index) => (
                    <div
                        key={index}
                        className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <Bar className="h-5 w-2/3" />
                            <div className="h-6 w-20 rounded-full bg-gray-200" />
                        </div>
                        <Bar className="h-4 w-3/4" />
                        <Bar className="h-4 w-1/2" />
                        <Bar className="h-4 w-2/3" />
                        <div className="flex justify-end gap-2">
                            <Bar className="h-8 w-16" />
                            <Bar className="h-8 w-16" />
                            <Bar className="h-8 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
);


const FormSkeleton = () => (
    <>
        <span className="sr-only">Loading notice...</span>

        <div className="mb-6 flex items-center gap-3">
            <Bar className="h-10 w-10" />
            <Bar className="h-6 w-44" />
        </div>

        <div className="rounded-2xl border border-gray-300 bg-white">
            <div className="rounded-t-2xl bg-gray-100 p-4">
                <Bar className="h-5 w-56" />
            </div>
            <hr className="border-gray-300" />

            <div className="m-3 rounded-xl bg-gray-100 p-4 md:m-6">
                <Field labelWidth="w-64 max-w-full" />
            </div>

            <div className="m-3 space-y-6 md:m-6">
                <Field />

                <div className="flex flex-col gap-4 sm:flex-row">
                    <Field />
                    <Field />
                    <Field />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                    <Field />
                    <Field />
                </div>

                <div className="space-y-2">
                    <Bar className="h-4 w-28" />
                    <Bar className="h-28 w-full" />
                </div>

                <div className="space-y-2">
                    <Bar className="h-4 w-40" />
                    <Bar className="h-28 w-full rounded-2xl" />
                </div>
            </div>

            <div className="m-4 flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-4 md:m-8">
                <Bar className="h-10 w-full rounded-2xl sm:w-24" />
                <Bar className="h-10 w-full rounded-2xl sm:w-32" />
                <Bar className="h-10 w-full rounded-2xl sm:w-40" />
            </div>
        </div>
    </>
);


const PageSkeleton = ({ variant = 'list' }) => (
    <div
        role="status"
        aria-busy="true"
        className="animate-pulse p-3 motion-reduce:animate-none md:p-6"
    >
        {variant === 'form' ? <FormSkeleton /> : <ListSkeleton />}
    </div>
);

export default PageSkeleton;