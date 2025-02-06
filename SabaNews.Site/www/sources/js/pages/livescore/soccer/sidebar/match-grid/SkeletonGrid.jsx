import React from 'react';
import Skeleton from 'react-loading-skeleton';
const SkeletonGrid = () => {
    const MatchSkeleton = () => {
        return (
            <div className={`duel-participant`}>
                <div className="flex-league">
                    <div className="column column-left home-team">
                        <ul className="team">
                            <Skeleton width={60} />
                        </ul>
                    </div>
                    <div className="column column-center result-league">
                        <div className={`detail-score-wrapper `}>
                            <Skeleton width={30} />
                        </div>
                    </div>
                    <div className="column column-right away-team">
                        <ul className="team">
                            <Skeleton width={60} />
                        </ul>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className="livescore-soccer-main home-skeleton">
            {
                [1, 2, 3].map((index, _) => {
                    return (
                        <div className="wc-bg-overflow" key={index}>
                            <div className="livescore-name-team">
                                <span className="round-name"><Skeleton width={40} /></span>
                            </div>
                            <div className="league-story">
                                <div className="group-duel" key={index}>
                                    <div className="duel-date"><Skeleton width={70} /></div>
                                    {MatchSkeleton()}
                                    {MatchSkeleton()}
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
};
export default SkeletonGrid;