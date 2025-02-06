import React from 'react';
import TeamIcon from '@jsroot/components/Icon/TeamIcon';
import CommonFunctions from '@jsroot/common/common-functions';
import { getMatchResult } from './functions';

const Row = ({ team, isMobile }) => {
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
                    <div className="soccer-team-logo"><TeamIcon className="soccer-team-logo" src={CommonFunctions.getTeamIcon(team)} /></div>
                    <div className="soccer-team-name">{CommonFunctions.getTeamName(team)}</div>
                </div>
            </div>
            <div className="table-custom-cell cell-rank">
                <span>{team.total}</span>
            </div>
            {
                !isMobile &&
                <div className="table-custom-cell cell-rank">
                    <span>{team.won}</span>
                </div>
            }
            {
                !isMobile &&
                <div className="table-custom-cell cell-rank">
                    <span>{team.draw}</span>
                </div>
            }
            {
                !isMobile &&
                <div className="table-custom-cell cell-rank">
                    <span>{team.loss}</span>
                </div>
            }
            {
                !isMobile &&
                <div className="table-custom-cell cell-rank">
                    <span>{team.goals}</span>
                </div>
            }
            {
                !isMobile &&
                <div className="table-custom-cell cell-rank">
                    <span>{team.goalsAgainst}</span>
                </div>
            }
            <div className="table-custom-cell cell-rank">
                <span>{team.goalDiff}</span>
            </div>
            <div className="table-custom-cell cell-rank">
                <span className="table-bold">{team.points}</span>
            </div>
            {
                !isMobile &&
                <div className="table-custom-cell cell-rank cell-form">
                    <div className="wld-wrapper">
                        {
                            team.matches.slice(0, 5).map(match =>
                                <div key={match.matchId}>{getMatchResult(team.teamId, match)}</div>)
                        }
                    </div>
                </div>
            }
        </div>
    );
};

export default Row;