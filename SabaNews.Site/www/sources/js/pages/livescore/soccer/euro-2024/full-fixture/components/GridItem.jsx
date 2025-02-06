import React from 'react';
import Item from './Item';
import DateTimeService from '@jsroot/common/dateTimeService';
import dayjs from 'dayjs';

const today = dayjs(DateTimeService.getCurrentClientDateTime()).format('YYYY-MM-DD');
const GridItem = ({ items }) => {
    return (
        <div className="soccer-match-grid">
            {
                items.map(group => {
                    const fixtureDate = dayjs(group.key).format('YYYY-MM-DD');
                    var currentDateClass = dayjs(fixtureDate).isSame(today) ? 'current' : '';
                    return (
                        <div key={group.key} className={`soccer-match-grid-main ${currentDateClass}`}>
                            <div className="soccer-match-grid-date">
                                {group.text}
                            </div>
                            <div className="soccer-match-grid-body">
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