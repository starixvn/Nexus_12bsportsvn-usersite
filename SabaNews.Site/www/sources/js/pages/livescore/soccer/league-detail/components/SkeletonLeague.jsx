import React from 'react';
import Skeleton from 'react-loading-skeleton';

const SkeletonLeague = () => {
    return (
        <div className="livescore-league-header-detail">
            <div className="livescore-league-header-detail-group">
                <Skeleton circle className="livescore-league-header-detail-logo" />
                <div className="livescore-league-header-detail-name">
                    <Skeleton width={250} height={18} />
                </div>
            </div>
        </div>
    );
};
export default SkeletonLeague;