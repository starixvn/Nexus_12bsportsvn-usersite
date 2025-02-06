import Item from './Item';
import { getVoteResult } from '../../common.functions';
import { WorldCup, MobileMaxWidth } from '@jsroot/common/constants';
import dayjs from 'dayjs';
import DateTimeService from '@jsroot/common/dateTimeService';
import React, { PureComponent } from 'react';

export default class Standing extends PureComponent {
    constructor(props) {
        super(props);
        this.elementRef = React.createRef();
        this.state = {
            isMobile: window.innerWidth <= MobileMaxWidth ? true : false
        };
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        const { isMobile } = this.state;
        const numberStroll = parseInt((window.rank - 1) / 10, 10) * (isMobile? 470 : 530);
        this.elementRef.current && this.elementRef.current.scrollTo({
            top: numberStroll > 0 ? numberStroll : 0,
            behavior: 'smooth'
        });
        const tab = window.location.hash;
        if (tab === '#minigame-standing') {
            window.scrollTo({
                top: 1400,
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

    handleResize = () => {
        const isMobile = this.state.isMobile;
        if (!isMobile && window.innerWidth <= MobileMaxWidth) {
            this.setState({ isMobile: true });
        } else {
            if (isMobile && window.innerWidth > MobileMaxWidth) {
                this.setState({ isMobile: false });
            }
        }
    };

    componentDidUpdate(){
        const { isMobile } = this.state;
        const numberStroll = parseInt((window.rank - 1) / 10, 10) * (isMobile? 470 : 530);
        this.elementRef.current && this.elementRef.current.scrollTo({
            top: numberStroll > 0 ? numberStroll : 0,
            behavior: 'smooth'
        });
    }

    getMatch = (vote, matches) =>{
        const matchVote = matches.filter(match => match.matchId === vote.matchId)[0];
        return !matchVote ? null : matchVote;
    };

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

    handleStandings = (users, votes, points, detail) =>{
        let standing = [];
        users.map((user,indexUser) =>{
            let {createdDate, updatedDate} = user;
            let pointNumber = 0;
            votes.map( (vote, index) => {
                if(user.userId === vote.userId){
                    pointNumber += points[index];
                    if(updatedDate < vote.updatedDate){
                        updatedDate = vote.updatedDate;
                    }
                    if(createdDate < vote.createdDate){
                        createdDate = vote.createdDate;
                    }
                }
            });
            standing.push({
                userId: user.userId,
                matchId : user.matchId,
                teamId : user.teamId,
                stage : user.stage,
                userName : user.userName,
                icon : user.icon,
                point : pointNumber,
                detail: detail[indexUser],
                createdDate : DateTimeService.convertFromUTC(createdDate),
                updatedDate : DateTimeService.convertFromUTC(updatedDate)
            });
        });
        standing = this.sortStandingPoint(standing);
        return standing;
    };

    calculatorPointerDetail = (points, votes, matches, userId) => {
        let pointWinner = 0;
        votes.map((vote, index) => {
            matches.map(match => {
                if(userId === vote.userId && match.matchId === vote.matchId){
                    pointWinner += points[index];
                }
            });
        });
        return pointWinner;
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

    getDetail = (matches, users, points, votes) => {
        const matchesEightTeamStage = this.getMatchesByStageId(matches,WorldCup.EightTeamStage),
        matchesThirdPlace = this.getMatchesByStageId(matches,WorldCup.ThirdPlace),
        matchesQuarterfinalsStage = this.getMatchesByStageId(matches,WorldCup.QuarterfinalsStage),
        matchesFinalStage = this.getMatchesByStageId(matches,WorldCup.FinalStage),
        matchesSemifinalsStage = this.getMatchesByStageId(matches,WorldCup.SemifinalsStage),
        detail = [];
        users.map(user => {
            detail.push({
                pointThirdPlace: this.calculatorPointerDetail(points, votes, matchesThirdPlace, user.userId),
                pointEightTeamStage: this.calculatorPointerDetail(points, votes, matchesEightTeamStage, user.userId),
                pointSemifinalsStage: this.calculatorPointerDetail(points, votes, matchesSemifinalsStage, user.userId),
                pointQuarterfinalsStage: this.calculatorPointerDetail(points, votes, matchesQuarterfinalsStage, user.userId),
                pointFinalStage: this.calculatorPointerDetail(points, votes, matchesFinalStage, user.userId)
            });
        });
        return detail;
    };

    calculatorPointer = (matches, votes) => {
        let detail = [];
        const points = [];
        let users = [];
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
        const standing = this.handleStandings(users, votes, points, detail);
        return standing;
    };

    sortStandingPoint = standing =>{
        const sortPoint = [];
        let sortPointZero = [];
        standing.map((item, index) =>{
            let max = item.point;
            let indexMax = index;
            standing.map((standing, indexSort) => {
                if(indexSort > index && max < standing.point){
                        max = standing.point;
                        indexMax = indexSort;
                }
            });
            const swap = standing[index];
            standing[index] = standing[indexMax];
            standing[indexMax] = swap;
        });

        standing.map( (item, index) => {
            if(sortPointZero.length ===0){
                 sortPointZero.push(item);
            }else{
                 const count = sortPointZero.filter(x=>x.point === item.point).length;
                 if(count > 0){
                    sortPointZero.push(item);
                 }
                 if(count === 0 || index === standing.length - 1){
                    sortPointZero.sort((item1, item2) => dayjs(item1.updatedDate).diff(dayjs(item2.updatedDate)));
                    sortPoint.push(...sortPointZero);
                    sortPointZero = [item];
                 }
            }
        });
        return sortPoint;
    };

    checkRank = (standings, userId ) =>{
        let rank = 0;
        if(userId === undefined){
            rank = 0;
        }else{
            standings.map((item, index) => {
                if(item.userId === parseInt(userId, 10)){
                    rank = index + 1;
                }
            });
        }
        return rank;
    };

    render() {
        const { matches, votes, stagesSelected } = this.props;
        const standings = this.calculatorPointer(matches, votes);
        const userId = window.User;
        const rank = this.checkRank(standings, userId);
        window.rank = rank;
        return (
            <>
                {
                    rank > 0 && <p className="standing-me">Thứ hạng của bạn: {rank}</p>
                }
                <div className="wrapper-scroll">
                    <div className="minigame-table">
                        <div className="minigame-table-flex minigame-table-header">
                            <div className="table-row table-row-index">#</div>
                            <div className="table-row table-row-name">Tên</div>
                            <div className="table-row table-row-score">Điểm</div>
                            <div className="table-row table-row-time">Thời gian </div>
                        </div>
                        <div ref={this.elementRef} className= {`minigame-table-body ${standings.length === 0 ? 'no-data' : ''}`}>
                            {
                                standings.map((item, index) => <Item rank={rank} key={index} number={index} standing={item}
                                                                    standingLength={standings.length} stagesSelected={stagesSelected} />)
                            }
                            {
                                standings.length === 0 && <p className="text-no-data">Dữ Liệu Đang Được Cập Nhật</p>
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
