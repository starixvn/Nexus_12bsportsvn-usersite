import React, { PureComponent } from 'react';
import Item from './Item';
import { Euro } from '../../euro-constants';
import { getMatchesByStage } from '../../common.functions';
export default class Grid extends PureComponent {
    constructor(props) {
        super(props);
        this.totalScore = 0;
    }

    getVotesByStage = stage => {
        const { votes } = this.props;
        return votes.filter(item => item.stage === stage);
    };

    getStatusByStage = stage => {
        const { statusStages } = this.props;
        return statusStages.find(s => s.stage === stage);
    }

    render() {
        const { matches } = this.props;
        return (
            <div className="wrapper-scroll">
               <div className="minigame-table">
                    <div className="minigame-table-flex minigame-table-header">
                        <div className="table-row table-row-index">#</div>
                        <div className="table-row table-row-name">Giai đoạn</div>
                        <div className="table-row table-row-score">Tình trạng</div>
                        <div className="table-row table-row-time">Điểm</div>
                        <div className="table-row table-row-action"></div>
                    </div>
                    <div className="minigame-table-body">
                        <Item stage={Euro.MinigameStage.Group}
                            status={this.getStatusByStage(Euro.MinigameStage.Group)}
                            votes={this.getVotesByStage(Euro.MinigameStage.Group)}
                            matches={getMatchesByStage(matches, Euro.MinigameStage.Group)} />
                        <Item stage={Euro.MinigameStage.Knockout}
                            status={this.getStatusByStage(Euro.MinigameStage.Knockout)}
                            votes={this.getVotesByStage(Euro.MinigameStage.Knockout)}
                            matches={getMatchesByStage(matches, Euro.MinigameStage.Knockout)}/>
                    </div>
                </div>
            </div>
        );
    }
}