import { MatchStatus, MatchResult } from '@jsroot/common/constants';
import { Euro } from './euro-constants';
import CommonFunctions from '@jsroot/common/common-functions';


export  const getMatchByEventStage = matches => {
    let tmpMatches = [];
    const stage = parseInt(window.stage, 10);
    if(stage === Euro.MinigameStage.Group) {
        tmpMatches = matches.filter(item => item.stage.stageId === Euro.GroupsStage);
    } else if (stage === Euro.MinigameStage.Knockout) {
        tmpMatches = matches.filter(item => item.stage.stageId !== Euro.GroupsStage);
    }
    return tmpMatches;
};

export  const getMatchesByStage = (matches, stage) => {
    let tmpMatches = [];
    if(stage === Euro.MinigameStage.Group) {
        tmpMatches = matches.filter(item => item.stage.stageId === Euro.GroupsStage);
    } else if (stage === Euro.MinigameStage.Knockout) {
        tmpMatches = matches.filter(item => item.stage.stageId !== Euro.GroupsStage);
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
        case Euro.FinalStage:
            return Euro.MinigameScore.Final;
        case Euro.SemifinalsStage:
            return Euro.MinigameScore.Semifinal;
        case Euro.QuarterfinalsStage:
            return Euro.MinigameScore.Quarterfinal;
        default:
            return Euro.MinigameScore.Others;
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
        if(vote.teamId !== 0 && (vote.teamId === match.homeTeam.teamId || vote.teamId === match.awayTeam.teamId )) {
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


const functions = {
    getMatchByEventStage,
    getMatchesByStage,
    groupMatchesByStage,
    getVoteResult
};
export default functions;
