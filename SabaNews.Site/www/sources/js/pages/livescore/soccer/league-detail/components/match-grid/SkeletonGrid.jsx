import React from 'react';
import Skeleton from 'react-loading-skeleton';

const SkeletonGrid = () => {
    return (
        <>
            <div className="group-searchbar">
                <div className="livescore-soccer-search-bar">
                    <Skeleton className="livescore-soccer-searchbox" />
                </div>
            </div>
            <div className="soccer-match-grid">
                {
                    [1, 2, 3].map(league =>
                        <div key={league} className="soccer-match-grid-item">
                            <div className="soccer-match-grid-item-header">
                                <Skeleton />
                            </div>
                            <div className="soccer-match-grid-item-body">
                                <div className="group-match-item">
                                    <div className="soccer-match-item">
                                        <div className="soccer-match-stage"><Skeleton /></div>
                                        <div className="soccer-match-team">
                                            <div className="group-team">
                                                <div className="soccer-team home-team">
                                                    <Skeleton circle className="soccer-team-logo" />
                                                    <Skeleton className="soccer-team-name" width={100} />
                                                </div>
                                                <div className="soccer-team away-team">
                                                    <Skeleton circle className="soccer-team-logo" />
                                                    <Skeleton className="soccer-team-name" width={100} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="soccer-match-star-icon">
                                            <Skeleton />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    );
};
export default SkeletonGrid;