import React from 'react';
import { WorldCup, MatchStatus, MatchResult } from '@jsroot/common/constants';
import CommonFunctions from '@jsroot/common/common-functions';
import dayjs from 'dayjs';

export  const getMatchByEventStage = matches => {
    let tmpMatches = [];
    const stage = parseInt(window.stage, 10);
    const groupStage = matches.filter(item => item.stage.stageId === WorldCup.GroupsStage);
    if(stage === WorldCup.MinigameStage.Stage1) {
        tmpMatches = groupStage.slice(0, 16);
    } else if (stage === WorldCup.MinigameStage.Stage2) {
        tmpMatches = groupStage.slice(16, 32);
    } else if(stage === WorldCup.MinigameStage.Stage3) {
        tmpMatches = groupStage.slice(32);
    } else if(stage === WorldCup.MinigameStage.Stage4) {
        tmpMatches = matches.filter(item => item.stage.stageId > WorldCup.GroupsStage);
    }
    return tmpMatches;
};

export  const getMatchesByStage = (matches, stage) => {
    let tmpMatches = [];
    const groupStage = matches.filter(item => item.stage.stageId === WorldCup.GroupsStage);
    if(stage === WorldCup.MinigameStage.Stage1) {
        tmpMatches = groupStage.slice(0, 16);
    } else if (stage === WorldCup.MinigameStage.Stage2) {
        tmpMatches = groupStage.slice(16, 32);
    } else if(stage === WorldCup.MinigameStage.Stage3) {
        tmpMatches = groupStage.slice(32);
    } else if(stage === WorldCup.MinigameStage.Stage4) {
        tmpMatches = matches.filter(item => item.stage.stageId > WorldCup.GroupsStage);
    }
    return tmpMatches;
};

export const groupMatchesByStage = matches => {
    const showMatches = getMatchByEventStage(matches);
    let totalItems = showMatches.length;
    const tempMatches = [];
    for (let i = 0; i < totalItems; i++) {
        const match = showMatches[i];
        const stage = match.stage;
        const key = stage ? stage.stageId : 0;
        const item = {
            key,
            stage,
            matches: [match]
        };

        if (tempMatches.length === 0) {
            tempMatches.push(item);
        } else {
            const index = tempMatches.findIndex(x => x.key === key);
            if (index === -1) {
                tempMatches.push(item);
            } else {
                tempMatches[index].matches.push(match);
            }
        }
    }
    return tempMatches;
}

const getWinScore = stageId => {
    switch(stageId) {
        case WorldCup.FinalStage:
            return WorldCup.MinigameScore.Final;
        case WorldCup.SemifinalsStage:
            return WorldCup.MinigameScore.Semifinal;
        case WorldCup.QuarterfinalsStage:
            return WorldCup.MinigameScore.Quarterfinal;
        default:
            return WorldCup.MinigameScore.Others;
    }
}

export const getVoteResult = (match, vote) => {
    if(match === null){
        return null;
    }
    if(match.status !== MatchStatus.Finished) {
        return null;
    }
    let status = false;
    let score = 0;
    const voteTeam = vote.teamId === 0 ? match.homeTeam.teamId : vote.teamId;
    const matchResult = CommonFunctions.getMatchResult(voteTeam, match);
    if(matchResult === MatchResult.Win) {
        if(vote.teamId !== 0) {
            score = getWinScore(match.stage.stageId);
            status = true;
        }
    } else if(matchResult === MatchResult.Draw) {
        if(vote.teamId === 0) {
            score = getWinScore(match.stage.stageId);
            status = true;
        }
    }
    return {status, score};
}

export const getMinigameStageStartTime = stage => {
    switch(stage) {
        case WorldCup.MinigameStage.Stage1:
            return dayjs(new Date(2022, 10, 16, 8, 0, 0));
        case WorldCup.MinigameStage.Stage2:
            return dayjs(new Date(2022, 10, 22, 8, 0, 0));
        case WorldCup.MinigameStage.Stage3:
            return dayjs(new Date(2022, 10, 26, 8, 0, 0));
        case WorldCup.MinigameStage.Stage4:
            return dayjs(new Date(2022, 10, 30, 8, 0, 0));
        default:
            return dayjs(new Date(2022, 10, 30, 8, 0, 0));
    }
}

const functions = {
    getMatchByEventStage,
    getMatchesByStage,
    groupMatchesByStage,
    getVoteResult,
    getMinigameStageStartTime
};
export default functions;
