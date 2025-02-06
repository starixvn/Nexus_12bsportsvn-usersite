import React from 'react';
import ChangeHighlight from 'react-change-highlight';
import { MatchStatus } from '@jsroot/common/constants';

const TeamScore = ({ match, isHomeTeam }) => {
    const fieldName = isHomeTeam ? 'homeTeam' : 'awayTeam';
    const totalScore = match[`${fieldName}ExtraScore`] ? match[`${fieldName}ExtraScore`] : match[`${fieldName}TotalScore`];
    const halfScore = match[`${fieldName}HalfScore`];

    switch (match.status) {
        case MatchStatus.NotStarted:
        case MatchStatus.Delay:
        case MatchStatus.Postpone:
        case MatchStatus.Cancel:
        case MatchStatus.TBD:
            return <div className="soccer-team-result"><span>&nbsp; - &nbsp;</span></div>;

        case MatchStatus.Finished:
            return <div className="soccer-team-result">
                <span className="total-score">{totalScore}</span>
                <span className="half-score">({halfScore})</span>
            </div>;

        default:
            return <div className="soccer-team-result">
                <ChangeHighlight showAfter={100} hideAfter={1000}>
                    <span ref={React.createRef()} className="total-score">{totalScore}</span>
                </ChangeHighlight>
                <span className="half-score">({halfScore})</span>
            </div>;
    }
};

export default TeamScore;