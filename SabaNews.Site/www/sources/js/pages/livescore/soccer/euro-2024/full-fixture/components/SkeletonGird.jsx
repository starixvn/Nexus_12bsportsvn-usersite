import React, { Fragment } from 'react';
import Skeleton from 'react-loading-skeleton';

const isMobile = window.innerWidth < 768;

const SkeletonGrid = () => {
    const renderNav = () => {
        return(
            !isMobile && <div className="live-score-nav nav nav-tabs">
                {
                    [1,2,3,4].map((_, index) => (
                        <Skeleton key={index} width={130} height={27} className="nav-item nav-link" style={{ marginRight : '10px' , borderRadius : '5px' }}>
                        </Skeleton>
                    ))
                }
            </div>
        )
    }

    const renderBody = () => {
        return (
            <Fragment>
                {
                    [1,2,3,4,5,6,7,8,9].map((_, index) => (
                        <div className="soccer-match-grid-main" key={index}>
                            <div className="soccer-match-grid-date">
                                <Skeleton  width={155}/>
                            </div>
                            <div className="soccer-match-grid-body">
                                {
                                    [1,2,3].map((_, index) => (
                                        <div key={index} className="soccer-match-grid-items">
                                            <div className="group-match-item">
                                                <div className="euro-match-item">
                                                    <div className="euro-match-team">
                                                        <div className="euro-match-team-home">
                                                            <Skeleton width={32} height={32} circle className="soccer-team-logo" />
                                                            <Skeleton className="soccer-team-name" width={100} />
                                                        </div>
                                                        <div className="euro-match-team-away">
                                                            <Skeleton width={32} height={32} circle className="soccer-team-logo" />
                                                            <Skeleton className="soccer-team-name" width={100} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </Fragment>
        )
    }
    return (
        <div className="container">
            <div className="livescore-soccer-main" >
                {renderNav()}
                <div className="soccer-match-grid">
                    {renderBody()}
                </div>
            </div>
        </div>
    )
};

export default SkeletonGrid;