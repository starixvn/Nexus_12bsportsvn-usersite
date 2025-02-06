import React, { PureComponent } from 'react';
import { getVoteResult, getMinigameStageStartTime } from '../../common.functions';
import Site from '@jsroot/common/site';
import DateTimeService from '@jsroot/common/dateTimeService';
import dayjs from 'dayjs';
import LangHelper from '@jsroot/common/langHelper';

export default class Item extends PureComponent {
    constructor(props) {
        super(props);
    }

    getTotalScore = () => {
        const { matches, votes } = this.props;
        let totalScore = 0;
        votes.map(vote => {
            const match = matches.find(item => item.matchId === vote.matchId);
            if(match) {
                const result = getVoteResult(match, vote);
                totalScore += result !== null ? result.score : 0;
            }
        });
        return totalScore;
    };

    getStageStatus = () => {
        const { matches, stage } = this.props;
        const lastMatch = matches[matches.length - 1];
        const startTime = getMinigameStageStartTime(stage);
        const lastTime = DateTimeService.convertFromUTC(lastMatch.startTime);
        const currentTime = dayjs(DateTimeService.getCurrentClientDateTime());
        const startMinutes = startTime.diff(currentTime, 'minutes');
        const lastMinutes = lastTime.diff(currentTime, 'minutes');
        let status = '';
        let isLock = true;
        if(startMinutes > 60) {
            status = LangHelper.getResource('NotStarted');
        } else if(startMinutes <= 60 && startMinutes > 0) {
            status = LangHelper.getResource('Upcomming');
        } else if( startMinutes <= 0) {
            isLock = false;
            status = LangHelper.getResource('Inprogress');
        }
        if(lastMinutes <= 30) {
            isLock = false;
            status = LangHelper.getResource('Finish');
        } else if(lastMinutes <= 60) {
            isLock = false;
            status = LangHelper.getResource('Ending');
        }
        return {status, isLock};
    };

    handleViewDetail = event => {
        const url = Site.resolveClientUrl(`world-cup-2022/su-kien-du-doan-sung-nhan-qua-khung/chi-tiet/giai-doan/${this.props.stage}`);
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };

    render() {
        const { stage } = this.props;
        const stageStatus = this.getStageStatus();
        return (

            <div className="minigame-table-items">
                <div className="minigame-table-flex ">
                    <div className="table-row table-row-index">{ stage }</div>
                    <div className="table-row table-row-name table-user">
                        Giai đoạn { stage }
                    </div>
                    <div className="table-row table-row-score">
                        {stageStatus.status}
                    </div>
                    <div className="table-row table-row-time">
                        {this.getTotalScore()}
                        {
                            stageStatus.isLock && <i className="icon-icon_lock view-minigame-detail" />
                        }
                        {
                            !stageStatus.isLock && <i className="icon-bxh_view view-minigame-detail" onClick={this.handleViewDetail} />
                        }
                    </div>
                </div>
            </div>
        );
    }
}