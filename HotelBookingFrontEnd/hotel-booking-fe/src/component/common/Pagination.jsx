import React from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";

const Pagination = ({ roomsPerPage, totalRooms, currentPage, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalRooms / roomsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <BootstrapPagination className="custom-pagination">
            {pageNumbers.map((number) => (
                <BootstrapPagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => paginate(number)}
                    className={number === currentPage ? "active" : ""}
                >
                    {number}
                </BootstrapPagination.Item>
            ))}
        </BootstrapPagination>
    );
};

export default Pagination;
