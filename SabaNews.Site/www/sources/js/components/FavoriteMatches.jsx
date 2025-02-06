import React from 'react';
import Site from '@jsroot/common/site';
import CommonFunctions from '@jsroot/common/common-functions';

export const FavoriteMatches = ({ isMobile }) => {
    const matches = CommonFunctions.getFavouriteMatches();
    const count = matches.length > 0 ? matches.length : '';

    const handleClick = event => {
        const url = Site.resolveClientUrl(`lich-thi-dau/bong-da/tran-dau-quan-tam`);
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };

    const desktopIcon = () => {
        return (
            <>
                <span className="title">Trận đấu quan tâm</span>
                <span className={`like-count ${count > 0 ? 'number-like' : ''}`}>{count}</span>
            </>
        );
    };

    const mobileIcon = () => {
        return (
            <>
                <span>Trận đấu quan tâm</span>
                <div className="count-start">
                    <i className={`mobile-count ${count > 0 ? 'count-number' : ''}`}>{count}</i>
                </div>
            </>
        );
    };

    return (
        <div className="livescore-like" onClick={handleClick}>
            {
                isMobile ? mobileIcon()  : desktopIcon()
            }
        </div>
    );
};

export default FavoriteMatches;