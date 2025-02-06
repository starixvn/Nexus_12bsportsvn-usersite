import React from 'react';

const getResult = (homeScore, awayScore) => {
    const win = <div className="wld win">T</div>;
    const loss = <div className="wld loss">B</div>;
    const draw = <div className="wld draw">H</div>;
    let result;
    if (homeScore > awayScore) {
        result = win;
    } else if (homeScore < awayScore) {
        result = loss;
    } else {
        result = draw;
    }

    return result;
};

export const getMatchResult = (teamId, match) => {
    const isHomeTeam = match.homeTeamId === teamId;
    const homeFieldName = isHomeTeam ? 'homeTeam' : 'awayTeam';
    const awayFieldName = isHomeTeam ? 'awayTeam' : 'homeTeam';
    let result;

    if (match[`${homeFieldName}PenaltyScore`] > 0 || match[`${awayFieldName}PenaltyScore`] > 0) {
        result = getResult(match[`${homeFieldName}PenaltyScore`], match[`${awayFieldName}PenaltyScore`]);
    } else if (match.isSecondLeg && (match[`${homeFieldName}AggregateScore`] > 0 || match[`${awayFieldName}AggregateScore`] > 0)) {
        result = getResult(match[`${homeFieldName}AggregateScore`], match[`${awayFieldName}AggregateScore`]);
    } else if (match[`${homeFieldName}ExtraScore`] > 0 || match[`${awayFieldName}ExtraScore`] > 0) {
        result = getResult(match[`${homeFieldName}ExtraScore`], match[`${awayFieldName}ExtraScore`]);
    } else {
        result = getResult(match[`${homeFieldName}TotalScore`], match[`${awayFieldName}TotalScore`]);
    }

    return result;
};