import React from 'react';
import Site from '@jsroot/common/site';

export const Breadscrum = ({ currentPage, currentPageUrl }) => {
    const handleClick = (event, currentPageUrl) => {
        let url = Site.resolveClientUrl('lich-thi-dau/bong-da');
        if (currentPageUrl) {
            url = currentPageUrl;
        }
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };

    return (
        <ul className="breadcrumb">
            <li onClick={event => handleClick(event)}><span>LTĐ</span></li>
            <li onClick={event => handleClick(event, currentPageUrl)}><span>{currentPage}</span></li>
        </ul>
    );
};

export default Breadscrum;