import React from 'react';
import Row from './Row';

const TBody = ({ teams, isMobile }) => {
    return (
        <div className="table-custom-body">
            {
                teams.map(team => <Row key={team.teamId} team={team} isMobile={isMobile} />)
            }
        </div>
    );
};

export default TBody;