import React from 'react';
import Match from '../../../index/components/match-grid/Match';

const Item = ({ searchKey, league, child }) => {
    if (child.key) {
        return (
            <div className="group-match-item">
                <div className="group-match-item-slogan">{child.text}</div>
                {
                    child.childs.map(match =>
                        <Match key={match.matchId} searchKey={searchKey} match={{ ...match, league }} />)
                }
            </div>
        );
    } else {
        return <Match key={child.matchId} searchKey={searchKey} match={{ ...child, league }} />;
    }
};

export default Item;