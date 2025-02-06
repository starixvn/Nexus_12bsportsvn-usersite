import React from 'react';
import Row from './Row';

const Body = ({ teams }) => {
    return (
        <div className="table-custom-body">
            {
                teams.map(team => <Row key={team.teamId} team={team} />)
            }
        </div>
    );
};

export default Body;