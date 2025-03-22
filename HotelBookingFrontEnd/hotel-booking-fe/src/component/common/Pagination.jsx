import React from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";

const Pagination = ({ roomPerPage, totalRooms, currentPage, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalRooms / roomPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <BootstrapPagination className="custom-pagination">
            {pageNumbers.map((number) => (
                <BootstrapPagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => paginate(number)}
                    className={number === currentPage ? "active-page" : "inactive-page"}
                >
                    {number}
                </BootstrapPagination.Item>
            ))}
        </BootstrapPagination>
    );
};

export default Pagination;