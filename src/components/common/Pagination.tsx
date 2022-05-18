import { FC } from "react";
import usePagination, { PaginationType } from "../../hooks/usePagination";

const paginationNumberStyle =
  "block flex items-center justify-center mx-[2px] rounded-sm text-sm";

const PageNumber = ({
  active,
  disabled,
  onClick,
  value,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  value: number;
}) => (
  <span
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClick={disabled === false ? onClick : () => {}}
    className={`${paginationNumberStyle} px-2 py-1 text-white sm:mx-[4px] md:mx-[5px] lg:mx-[6px] ${
      disabled
        ? "bg-gray-500 cursor-not-allowed"
        : active
        ? "bg-red-600 cursor-pointer"
        : "bg-primary-500 cursor-pointer hover:bg-red-600"
    }`}
  >
    {value}
  </span>
);

const Arrow = ({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) => (
  <span
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClick={disabled === false ? onClick : () => {}}
    className={
      paginationNumberStyle +
      ` ${
        disabled
          ? "bg-gray-500 cursor-not-allowed text-white"
          : " border-primary-500 cursor-pointer text-primary-500 hover:bg-primary-500 hover:text-white"
      }` +
      " border sm:mx-[4px] md:mx-[5px] p-1"
    }
  >
    <i className={`fas fa-chevron-${direction} text-tiny`} />
  </span>
);

interface PaginateType extends PaginationType {
  disabled: boolean;
  onChange: (pageNo: number) => void;
}

const Pagination: FC<PaginateType> = ({
  current = 1,
  disabled = false,
  maxPages = 7,
  pageSize = 50,
  totalItems,
  onChange,
}) => {
  const { changePage, currentPage, pages, totalPages } = usePagination({
    totalItems,
    current,
    pageSize,
    maxPages,
  });

  return (
    <div className="flex font-calibri items-center justify-center">
      {!pages.includes(1) && (
        <Arrow
          disabled={disabled}
          onClick={() => {
            const value = currentPage - 1 <= 0 ? 1 : currentPage - 1;
            if (currentPage !== value && disabled == false) {
              changePage(value);
              onChange(value);
            }
          }}
          direction="left"
        />
      )}
      {pages.map((page) => (
        <PageNumber
          active={page === currentPage}
          disabled={disabled}
          key={page}
          onClick={() => {
            if (page !== currentPage && disabled === false) {
              changePage(page);
              onChange(page);
            }
          }}
          value={page}
        />
      ))}
      {!pages.includes(totalPages) && (
        <Arrow
          disabled={disabled}
          onClick={() => {
            const value =
              currentPage + 1 >= totalPages ? totalPages : currentPage + 1;
            if (currentPage !== value && disabled === false) {
              changePage(value);
              onChange(value);
            }
          }}
          direction="right"
        />
      )}
    </div>
  );
};

export default Pagination;


// import { FC, useCallback } from "react";
// import usePagination, { PaginationType } from "@/hooks/usePagination";
// import Button from "../controls/Button";

// interface PaginateType extends PaginationType {
//   disabled: boolean;
//   onChange: (pageNo: number) => void;
// }

// const ArrowIcon = ({
//   classes,
//   disabled,
//   icon,
//   onClick,
//   title,
// }: {
//   classes: string;
//   disabled: boolean;
//   icon: string;
//   onClick: () => void;
//   title: string;
// }) => (
//   <span
//     onClick={disabled ? () => {} : onClick}
//     className={`${classes} ${
//       disabled
//         ? "bg-gray-500 cursor-not-allowed text-white"
//         : "bg-white cursor-pointer text-gray-500 hover:bg-gray-50"
//     }`}
//   >
//     <span className="sr-only">{title}</span>
//     <svg
//       className="h-5 w-5"
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 20 20"
//       fill="currentColor"
//       aria-hidden="true"
//     >
//       <path fillRule="evenodd" d={icon} clipRule="evenodd" />
//     </svg>
//   </span>
// );

// const Pagination: FC<PaginateType> = ({
//   current = 1,
//   disabled = false,
//   maxPages = 10,
//   pageSize = 10,
//   totalItems,
//   onChange,
// }) => {
//   const commonClass =
//     "border font-medium inline-flex items-center relative text-sm";

//   const arrowClass = `${commonClass} border-gray-300 p-2`;

//   const buttonClass =
//     "relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md";

//   const numberClass = `${commonClass} px-4 py-2`;

//   const activeClass = `${numberClass} z-10 bg-indigo-50 border-indigo-500 text-indigo-600`;

//   const inactiveClass = `${numberClass} bg-white border-gray-300 text-gray-500 hover:bg-gray-50`;

//   const { changePage, currentPage, pages, totalPages } = usePagination({
//     totalItems,
//     current,
//     pageSize,
//     maxPages,
//   });

//   const movePage = useCallback(
//     (page: number) => {
//       onChange(page);
//       changePage(page);
//     },
//     [changePage]
//   );

//   return (
//     <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//       <div className="flex-1 flex justify-between md:hidden">
//         <div>
//           {currentPage > 1 && (
//             <Button
//               bg="bg-white hover:bg-gray-50"
//               border="border border-gray-300"
//               bold="medium"
//               caps
//               color="text-gray-700"
//               disabled={disabled === false && currentPage > 1 ? false : true}
//               onClick={() =>
//                 disabled === false && currentPage > 1
//                   ? movePage(currentPage - 1)
//                   : {}
//               }
//               rounded="rounded-md"
//               title="Previous"
//               titleSize="text-sm"
//             />
//           )}
//         </div>
//         <div>
//           {currentPage < totalPages && (
//             <Button
//               bg="bg-white hover:bg-gray-50"
//               border="border border-gray-300"
//               bold="medium"
//               caps
//               color="text-gray-700"
//               disabled={
//                 disabled === false && currentPage < totalPages ? false : true
//               }
//               onClick={() =>
//                 disabled === false && currentPage < totalPages
//                   ? movePage(currentPage + 1)
//                   : {}
//               }
//               rounded="rounded-md"
//               title="Next"
//               titleSize="text-sm"
//             />
//           )}
//         </div>
//       </div>
//       <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
//         <div>
//           <p className="text-sm text-gray-700">
//             Showing <span className="font-medium">{currentPage}</span> to{" "}
//             <span className="font-medium">{totalPages}</span> of{" "}
//             <span className="font-medium">{totalItems}</span> results
//           </p>
//         </div>
//         <div>
//           <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//             {!pages.includes(1) && (
//               <ArrowIcon
//                 classes={`${arrowClass} cursor-pointer rounded-l-md`}
//                 disabled={disabled === false && currentPage > 1 ? false : true}
//                 icon="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
//                 onClick={() =>
//                   disabled === false && currentPage > 1
//                     ? movePage(currentPage - 1)
//                     : {}
//                 }
//                 title="Previous"
//               />
//             )}
//             {pages.map((page) => (
//               <span
//                 key={page}
//                 onClick={() =>
//                   currentPage !== page ? movePage(page) : () => {}
//                 }
//                 className={`${
//                   currentPage === page ? activeClass : inactiveClass
//                 } cursor-pointer`}
//               >
//                 {page}
//               </span>
//             ))}
//             {!pages.includes(totalPages) && (
//               <ArrowIcon
//                 classes={`${arrowClass} cursor-pointer rounded-r-md`}
//                 disabled={
//                   disabled === false && currentPage < totalPages ? false : true
//                 }
//                 icon="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
//                 onClick={() =>
//                   disabled === false && currentPage < totalPages
//                     ? movePage(currentPage + 1)
//                     : {}
//                 }
//                 title="Next"
//               />
//             )}
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Pagination;
