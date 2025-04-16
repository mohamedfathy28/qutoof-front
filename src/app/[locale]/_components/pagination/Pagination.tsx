'use client'
import React from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { FiMoreHorizontal } from 'react-icons/fi';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
}

const Pagination: React.FC<PaginationProps> = ({

    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,

}) => {

    const range = (start: number, end: number) => {
        const length = end - start + 1;
        return Array.from({ length }, (_, i) => start + i);
    };

    const createPagination = () => {
        const totalNumbers = siblingCount * 2 + 3;
        const totalBlocks = totalNumbers + 2;

        if (totalPages <= totalBlocks) {
            return range(1, totalPages);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = range(1, leftItemCount);
            return [...leftRange, -1, totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = range(totalPages - rightItemCount + 1, totalPages);
            return [1, -1, ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [1, -1, ...middleRange, -1, totalPages];
        }
    };

    const pages = createPagination();

    const renderPageButton = (pageNumber: number, index: number) => {
        if (pageNumber === -1) {
            return (
                <div key={`dots-${index}`} className="px-3 py-2">
                    <FiMoreHorizontal className="w-4 h-4 text-gray-400" />
                </div>
            );
        }

        const isActive = pageNumber === currentPage;

        return (
            <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={
                    isActive
                        ? 'h-[30px] w-[30px] lg:h-[50px] lg:w-[50px] rounded-[50%] border-2 border-[#009444] p-2 flex items-center justify-center bg-[#009444] text-white text-[14px] lg:text-[16px]'
                        : 'h-[30px] w-[30px] lg:h-[50px] lg:w-[50px] rounded-[50%] border-2 border-[#F1F1F1] p-2 flex items-center justify-center text-[#009444] text-[14px] lg:text-[16px]'
                }
            >
                {pageNumber}
            </button>
        );
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rtl:rotate-180 h-[30px] w-[30px] lg:h-[50px] lg:w-[50px] rounded-[50%] border-2 border-[#F1F1F1] p-2 flex items-center justify-center text-[#009444] "
            >
                <BiChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
                {pages?.map((page, index) => renderPageButton(page, index))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rtl:rotate-180 h-[30px] w-[30px] lg:h-[50px] lg:w-[50px] rounded-[50%] border-2 border-[#F1F1F1] p-2 flex items-center justify-center text-[#009444]"
            >
                <BiChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Pagination;