import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import CommonFunctions from '@jsroot/common/common-functions';

export class Statistics extends Component {
    render() {
        const { generalInfo, statistic } = this.props.match;
        if (!statistic || !statistic.homeStatistic || !statistic.awayStatistic || CommonFunctions.isPreMatch(generalInfo.status)) {
            return null;
        }

        let statistices  = [];
        const { homeStatistic, awayStatistic } = statistic;
        statistices = [
            { categoryId: 1, categoryName: 'Tỉ lệ kiểm soát bóng', homeValue: homeStatistic.controlRate, awayValue: awayStatistic.controlRate, unit: '%' },
            { categoryId: 2, categoryName: 'Tình huống tấn công nguy hiểm', homeValue: homeStatistic.dangerAttack, awayValue: awayStatistic.dangerAttack, unit: '' },
            { categoryId: 3, categoryName: 'Số lần dứt điểm', homeValue: homeStatistic.shoot, awayValue: awayStatistic.shoot, unit: '' },
            { categoryId: 4, categoryName: 'Dứt điểm chính xác', homeValue: homeStatistic.onGoal, awayValue: awayStatistic.onGoal, unit: '' },
            { categoryId: 5, categoryName: 'Phạm lỗi', homeValue: homeStatistic.foul, awayValue: awayStatistic.foul, unit: '' },
            { categoryId: 6, categoryName: 'Thẻ Vàng', homeValue: homeStatistic.yellowCard, awayValue: awayStatistic.yellowCard, unit: '' },
            { categoryId: 7, categoryName: 'Thẻ Đỏ', homeValue: homeStatistic.redCard, awayValue: awayStatistic.redCard, unit: '' },
            { categoryId: 8, categoryName: 'Việt vị', homeValue: homeStatistic.offSide, awayValue: awayStatistic.offSide, unit: '' },
            { categoryId: 9, categoryName: 'Ném biên', homeValue: homeStatistic.outBall, awayValue: awayStatistic.outBall, unit: '' },
            { categoryId: 10, categoryName: 'Phạt góc', homeValue: homeStatistic.cornerKick, awayValue: awayStatistic.cornerKick, unit: '' },
            { categoryId: 11, categoryName: 'Đá phạt', homeValue: homeStatistic.freeKick, awayValue: awayStatistic.freeKick, unit: '' },
            { categoryId: 12, categoryName: 'Phạt đền', homeValue: homeStatistic.penaltyKick, awayValue: awayStatistic.penaltyKick, unit: '' }
        ];
        return (
            <div className="block-line-up" id="thong-ke">
                <div className="block-line-up-main">
                    <div className="block-line-up-title">Thống kê</div>
                    <div className="block-line-up-body">
                        <div className="statistices">
                            {
                                statistices.map(item => {
                                    const homePercentage = (item.homeValue / (item.homeValue + item.awayValue)) * 100;
                                    const awayPercentage = (item.awayValue / (item.homeValue + item.awayValue)) * 100;
                                    let homeLength = '',
                                        awayLength = '',
                                        homeWin = '',
                                        awayWin = '';
                                    if (homePercentage > awayPercentage) {
                                        homeLength = 'long';
                                        awayLength = 'short';
                                        homeWin = 'win';
                                    } else if (homePercentage < awayPercentage) {
                                        homeLength = 'short';
                                        awayLength = 'long';
                                        awayWin = 'win';
                                    } else {
                                        homeLength = 'long';
                                        awayLength = 'short';
                                    }
                                    return (
                                        <div className="statistices-items" key={item.categoryId}>
                                            <div key={item.categoryId} className="statistices-row">
                                                <div className="statistices-category">
                                                    <div className={`statistices-home-value ${homeWin}`}>{item.homeValue}{item.unit}</div>
                                                    <div className="statistices-category-name">{item.categoryName}</div>
                                                    <div className={`statistices-away-value ${awayWin}`}>{item.awayValue}{item.unit}</div>
                                                </div>
                                                <div className="statistices-bar">
                                                    <div className={`statistices-barBg statistices-home ${homeLength}`}>
                                                        <div style={{ width: `${homePercentage}%` }} />
                                                    </div>
                                                    <div className={`statistices-barBg statistices-away ${awayLength}`}>
                                                        <div style={{ width: `${awayPercentage}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { match } = state;
    return {
        match
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);