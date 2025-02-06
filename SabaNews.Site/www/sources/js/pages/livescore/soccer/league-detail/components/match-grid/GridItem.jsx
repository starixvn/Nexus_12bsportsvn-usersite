import React from 'react';
import Item from './Item';

const GridItem = ({ searchKey, league, item }) => {
    return (
        <div className="soccer-match-grid" key={item.key}>
            <div className="soccer-match-grid-item">
                <div className="soccer-match-grid-item-header">{item.text}</div>
                <div className="soccer-match-grid-item-body">
                    {
                        item.childs.map(child => <Item key={child.key} searchKey={searchKey} league={league} child={child} />)
                    }
                </div>
            </div>
        </div>
    );
};

export default GridItem;