import React from 'react';
import CommonFunctions from '@jsroot/common/common-functions';

const Row = ({ team }) => {
    return (
        <div className="table-custom-row" key={team.teamId}>
            <div className="table-custom-cell cell-rank">
                <div className={`position ${team.promotion ? 'postition-color' : ''}`}
                    style={{ backgroundColor: team.promotion ? team.promotion.Color : '' }}
                >
                    {team.position}
                </div>
            </div>
            <div className="table-custom-cell cell-participant">
                <div className="soccer-team">
                    <div className="soccer-team-name">{CommonFunctions.getTeamName(team)}</div>
                </div>
            </div>
            <div className="table-custom-cell cell-rank">
                <span>{team.total}</span>
            </div>
            <div className="table-custom-cell cell-rank">
                <span>{team.goalDiff}</span>
            </div>
            <div className="table-custom-cell cell-rank">
                <span className="table-bold">{team.points}</span>
            </div>
        </div>
    );
};

export default Row;