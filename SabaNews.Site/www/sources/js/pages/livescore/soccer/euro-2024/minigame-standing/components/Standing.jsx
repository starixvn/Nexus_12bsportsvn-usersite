import Item from './Item';
import { getVoteResult } from '../../common.functions';
import { MobileMaxWidth } from '@jsroot/common/constants';
import { Euro } from '../../euro-constants';
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

    isKnockoutMatch = match => {
        return match.stage.stageId !== Euro.GroupsStage;
    };

    calculatorPointer = (matches, votes) => {
        const points = [];
        let users = [];
        votes.map(vote => {
            const updatedDate = DateTimeService.convertFromUTC(vote.updatedDate)
            const matchVote = matches.find(match => match.matchId === vote.matchId);

            if (!matchVote) return;

            const result = getVoteResult(matchVote, vote);
            const point = result != null && result.status ? result.score : 0;
            points.push(point);

            const userIndex =  users.findIndex(x => x.id === vote.userId);
            var knockout = { stage: matchVote.stage.stageId, point: point };
            var detail = this.isKnockoutMatch(matchVote) ? knockout : null;
            if (userIndex === -1) {
                const details = detail != null ? [detail] : [];
                users.push({
                    id: vote.userId,
                    icon: vote.icon,
                    userName: vote.userName,
                    point: point,
                    updatedDate: updatedDate,
                    details
                });
            } else {
                const user = users[userIndex];
                user.point += point;
                if (user.updatedDate < updatedDate) {
                    user.updatedDate = updatedDate;
                }
                if(detail !== null) {
                    user.details.push(knockout);
                }
            }
        });
        const standing = this.sortStandingPoint([...users]);
        return standing;
    };

    sortStandingPoint = standing =>{
        return standing.sort((a, b) => (b.point - a.point) || dayjs(a.updatedDate).diff(dayjs(b.updatedDate)))
    };

    checkRank = (standings, userId ) =>{
        const userIndex = standings.findIndex(s => s.id == userId);
        const rank = userIndex >= 0 ? userIndex + 1 : 0
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
