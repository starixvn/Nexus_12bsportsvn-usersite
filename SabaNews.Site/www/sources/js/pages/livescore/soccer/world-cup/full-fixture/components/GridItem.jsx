import React from 'react';
import Item from './Item';
const GridItem = ({ items }) => {
    return (
        <div className="soccer-match-grid-item">
            {
                items.map(group => {
                    return (
                        <div key={group.key} className="wc-soccer-items">
                            <div className="soccer-match-grid-item-header">
                                {group.text}
                            </div>
                            <div className="soccer-match-grid-item-body">
                                {
                                    group.childs.map(match =>
                                        <Item key={match.matchId} match={match} />)
                                }
                            </div>
                        </div>
                    );
                })

            }
        </div>
    );
};


export default GridItem;