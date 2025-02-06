import React, { PureComponent } from 'react';
import { getVoteResult } from '../../common.functions';
import Item from './Item';
import { WorldCup } from '@jsroot/common/constants';
import DateTimeService from '@jsroot/common/dateTimeService';
import dayjs from 'dayjs';

export default class Winner extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const tab = window.location.hash;
        if (tab === '#minigame-winners') {
            window.scrollTo({
                top: $(tab).offset().top,
                behavior: 'smooth'
            });
        }
        if (tab === '#stage-minigame') {
            window.scrollTo({
                top: 600,
                behavior: 'smooth'
            });
        }
    }

    getUsersVote = (users, vote) =>{
        if(users.length === 0){
            users.push(vote);
        }else{
            const count = users.filter(x=>x.userId === vote.userId).length;
            if(count === 0){
                users.push(vote);
            }
        }
        return users;
    };

    getMatchesByStageId = (matches, stageId) => {
        const matchesByStageId = [];
        matches.map(match => {
            if(match.stage.stageId === stageId){
                matchesByStageId.push(match);
            }
        });
        return matchesByStageId;
    };

    getMatch = (vote, matches) =>{
        const matchVote = matches.filter(match => match.matchId === vote.matchId)[0];
        return !matchVote ? null : matchVote;
    };

    handleWinners = (users, votes, points, detail) =>{
        let Winner = [];
        users.map((user,indexUser) =>{
            let pointNumber = 0;
            let {createdDate, updatedDate} = user;
            votes.map( (vote, index) => {
                if(user.userId === vote.userId){
                    pointNumber += points[index];
                    if(createdDate < vote.createdDate){
                        createdDate = vote.createdDate;
                    }
                    if(updatedDate < vote.updatedDate){
                        updatedDate = vote.updatedDate;
                    }
                }
            });
            if(pointNumber > 0){
                Winner.push({
                    userId: user.userId,
                    matchId : user.matchId,
                    teamId : user.teamId,
                    stage : user.stage,
                    createdDate : DateTimeService.convertFromUTC(createdDate),
                    updatedDate : DateTimeService.convertFromUTC(updatedDate),
                    userName : user.userName,
                    icon : user.icon,
                    point : pointNumber,
                    detail: detail[indexUser]
                });
            }
        }) ;
        Winner = this.sortWinnerPoint(Winner);
        return Winner;
    };

    calculatorPointerDetail = (points, votes, matches, userId) => {
        let point = 0;
        votes.map((vote, index) => {
            matches.map(match => {
                if(userId === vote.userId && match.matchId === vote.matchId){
                    point += points[index];
                }
            });
        });
        return point;
    };

    getDetail = (matches, users, points, votes) => {
        const matchesEightTeamStage = this.getMatchesByStageId(matches,WorldCup.EightTeamStage),
        matchesQuarterfinalsStage = this.getMatchesByStageId(matches,WorldCup.QuarterfinalsStage),
        matchesSemifinalsStage = this.getMatchesByStageId(matches,WorldCup.SemifinalsStage),
        matchesThirdPlace = this.getMatchesByStageId(matches,WorldCup.ThirdPlace),
        matchesFinalStage = this.getMatchesByStageId(matches,WorldCup.FinalStage),
        detail = [];
        users.map(user => {
            detail.push({
                pointEightTeamStage: this.calculatorPointerDetail(points, votes, matchesEightTeamStage, user.userId),
                pointQuarterfinalsStage: this.calculatorPointerDetail(points, votes, matchesQuarterfinalsStage, user.userId),
                pointSemifinalsStage: this.calculatorPointerDetail(points, votes, matchesSemifinalsStage, user.userId),
                pointThirdPlace: this.calculatorPointerDetail(points, votes, matchesThirdPlace, user.userId),
                pointFinalStage: this.calculatorPointerDetail(points, votes, matchesFinalStage, user.userId)
            });
        });
        return detail;
    };

    calculatorPointer = (matches, votes) => {
        const points = [];
        let users = [];
        let detail = [];
        votes.map(vote => {
            const matchVote = this.getMatch(vote, matches);
            const result = getVoteResult(matchVote, vote);
            if(result != null && result.status){
                points.push(result.score);
            }else{
                points.push(0);
            }
            users = this.getUsersVote(users, vote);
        });
        detail = this.getDetail(matches, users, points, votes);
        const winner = this.handleWinners(users, votes, points, detail);
        return winner;
    };

    sortWinnerPoint = Winner =>{
        const sortPoint = [];
        let sortPointZero = [];
        Winner.map((item, index) =>{
            let max = item.point;
            let indexMax = index;
            Winner.map((Winner, indexSort) => {
                if(indexSort > index && max < Winner.point){
                        max = Winner.point;
                        indexMax = indexSort;
                }
            });
            const swap = Winner[index];
            Winner[index] = Winner[indexMax];
            Winner[indexMax] = swap;
        });

        Winner.map( (item, index) => {
            if(sortPointZero.length ===0){
                 sortPointZero.push(item);
            }else{
                 const count = sortPointZero.filter(x=>x.point === item.point).length;
                 if(count > 0){
                    sortPointZero.push(item);
                 }
                 if(count === 0 || index === Winner.length - 1){
                    sortPointZero.sort((item1, item2) => dayjs(item1.updatedDate).diff(dayjs(item2.updatedDate)));
                    sortPoint.push(...sortPointZero);
                    sortPointZero = [item];
                 }
            }
        });
        return sortPoint;
    };

    render() {
        const { matches, votes, selectedStage} = this.props;
        const winners = this.calculatorPointer(matches, votes);
        return (
            <div className="wrapper-scroll wrapper-scroll-winner">
                <div className="minigame-table table-winner">
                    <div className="minigame-table-flex minigame-table-header">
                        <div className="table-row table-row-index">#</div>
                        <div className="table-row table-row-name">Tên</div>
                        <div className="table-row table-row-score">Điểm</div>
                        <div className="table-row table-row-time">Thời gian</div>
                    </div>
                    <div className="minigame-table-body">
                        {
                            winners.map((item, index) => <Item key={index} number={index} Winner={item} winnnerLength={winners.length} selectedStage={selectedStage} />)
                        }
                    </div>
                </div>
            </div>
        );
    }
}
