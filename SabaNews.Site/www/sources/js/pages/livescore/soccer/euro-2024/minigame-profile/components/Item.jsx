import React, { PureComponent } from 'react';
import { getVoteResult } from '../../common.functions';
import Site from '@jsroot/common/site';
import LangHelper from '@jsroot/common/langHelper';
import { Euro } from '../../euro-constants';

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
        const { status } = this.props;
        let isActive = status.isActive;
        if(status.status === 'Đã kết thúc') {
            isActive = true;
        }
        return {status: status.status, isActive};
    };

    handleViewDetail = event => {
        const url = Site.resolveClientUrl(`${Euro.MinigameProfileStageUrl}/${this.props.stage}`);
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
                    </div>
                    <div className="table-row table-row-action">
                        {
                            !stageStatus.isActive && <i className="icon-icon_lock view-minigame-detail" />
                        }
                        {
                            stageStatus.isActive && <i className="icon-bxh_view view-minigame-detail" onClick={this.handleViewDetail} />
                        }
                    </div>
                </div>
            </div>
        );
    }
}