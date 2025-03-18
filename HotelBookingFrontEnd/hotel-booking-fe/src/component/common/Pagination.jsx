import React from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";

const Pagination = ({ roomPerPage, totalRooms, currentPage, paginate }) => {
    
    const pageNumber = [];

    for (let i = 1; i <= Math.ceil(totalRooms / roomPerPage); i++) {
        pageNumber.push(i);
    }

    return (
        <div className="pagination-nav mt-4">
            <BootstrapPagination>
                {pageNumber.map((number) => (
                    <BootstrapPagination.Item 
                        key={number} 
                        active={currentPage === number} 
                        onClick={() => paginate(number)}
                    >
                        {number}
                    </BootstrapPagination.Item>
                ))}
            </BootstrapPagination>
        </div>
    );
};

export default Pagination;
