import React, {PureComponent } from 'react';
import Item from './Item';
import { getVoteResult } from '../../common.functions';
export default class Grid extends PureComponent {
    constructor(props) {
        super(props);
    }

    checkMatchResult = (match, vote) => {
        if(!vote) {
            return null;
        }
        const result = getVoteResult(match, vote);
        return result;
    };

    render() {
        const { matches, votes, startNum } = this.props;
        let number = startNum;
        let totalScore = 0;
        return (
            <>
                <div className="minigame-table">
                    <div className="minigame-table-flex minigame-table-header">
                        <div className="table-row table-row-index"></div>
                        <div className="table-row table-row-name_team">Dự đoán</div>
                        <div className="table-row">Kết quả</div>
                        <div className="table-row">Điểm</div>
                    </div>
                    <div className="minigame-table-body">
                        {
                            matches.map((item, index) => {
                                const vote = votes.find(value => value.matchId === item.matchId && value.stage === parseInt(window.stage, 10));
                                const result = this.checkMatchResult(item, vote);
                                totalScore +=  result !== null ? result.score : 0;
                                number++;
                                return (
                                    <Item key={index} match={item} vote={vote} result={result} number={number} />
                                );
                            })
                        }
                    </div>
                </div>
                <div className="total-score">
                    <span>Tổng điểm: </span>
                    <span>{totalScore}</span>
                </div>
            </>
        );
    }
}
