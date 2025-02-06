import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import { Tabs, Tab } from 'react-bootstrap';
import DateTimeService from '@jsroot/common/dateTimeService';
import CommonFunctions from '@jsroot/common/common-functions';
import { MatchStatus } from '@jsroot/common/constants';
import TeamIcon from '@jsroot/components/Icon/TeamIcon';

export class HeadToHead extends Component {
    getTeamStatus = (isHomeTeam, match) => {
        const homeFieldName = isHomeTeam ? 'homeTeam' : 'awayTeam';
        const awayFieldName = isHomeTeam ? 'awayTeam' : 'homeTeam';

        if (match.status === MatchStatus.Finished) {
            if (match[`${homeFieldName}PenaltyScore`]
                && match[`${homeFieldName}PenaltyScore`] > match[`${awayFieldName}PenaltyScore`]) {
                return <li>PEN</li>;
            } else {
                if (match.isSecondLeg && match[`${homeFieldName}AggregateScore`]
                    && match[`${homeFieldName}AggregateScore`] > match[`${awayFieldName}AggregateScore`]) {
                    return <li>AGG</li>;
                }
            }
        }

        return <Fragment />;
    };

    handleClickLeague = (event, league) => {
        const url = CommonFunctions.getLeaguePageUrl(league);
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };

    handleClick = (event, match) => {
        const url = CommonFunctions.getMatchDetailPageUrl(match);
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };

    getMatchStatus = (teamId, match) => {
        const generalInfo = this.props.match.generalInfo;
        let homeWinclass = '';
        let awayWinClass = '';
        const teamCheck = teamId ? teamId : generalInfo.homeTeam.teamId;
        let result = this.getTeamResult(teamCheck, match);
        if (result === 1) {
            if (teamCheck === match.homeTeam.teamId) {
                homeWinclass = 'win';
            } else if (teamCheck === match.awayTeam.teamId) {
                awayWinClass = 'win';
            }
        }
        if (result === 2) {
            if (teamCheck === match.homeTeam.teamId) {
                awayWinClass = 'win';
            } else if (teamCheck === match.awayTeam.teamId) {
                homeWinclass = 'win';
            }
        }
        if (!teamId) {
            result = -1;
        }
        return {result: result, homeWinclass: homeWinclass, awayWinClass: awayWinClass};
    };

    renderBody = (matchs, teamId) => {
        if (matchs.length === 0) {
            return null;
        }
        return (
            <div className="hth-section">
                {
                    !teamId &&
                    this.renderStatistic(matchs)
                }
                {
                    matchs.map((match, key) => {
                        const homeTeamScore = match.homeTeamExtraScore ? match.homeTeamExtraScore : match.homeTeamTotalScore;
                        const awayTeamScore = match.awayTeamExtraScore ? match.awayTeamExtraScore : match.awayTeamTotalScore;
                        const matchStatus = this.getMatchStatus(teamId, match);
                        const time = DateTimeService.convertFromUTC(match.startTime);
                        return (
                            <div className="f-row" key={key}>
                                <div className="name-league" onClick={event => this.handleClickLeague(event, match.league)}>
                                    <div className="name-league-img"><TeamIcon src={CommonFunctions.getLeagueIcon(match.league)} /></div>

                                    <div className="txt">{CommonFunctions.getLeagueNameWithStage(match.league)}</div>
                                </div>
                                <div className="group-match-item" onClick={event => this.handleClick(event, match)}>
                                    <div className="soccer-match-item">
                                        <div className="soccer-match-stage">
                                            <div className="soccer-match-star-icon soccer-match-star-hidden-pc">
                                                {
                                                    matchStatus.result === 0 &&
                                                    <span className="bg-color  bgyelow" title="Hòa">H</span>
                                                }
                                                {
                                                    matchStatus.result === 1 &&
                                                    <span className="bg-color bggreen" title="Thắng">T</span>
                                                }
                                                {
                                                    matchStatus.result === 2 &&
                                                    <span className="bg-color bgred" title="Bại">B</span>
                                                }
                                                <i className="icon-livescore icon-live-right" />
                                            </div>
                                            <span>{time.format('DD/MM/YYYY')}</span>
                                        </div>
                                        <div className="soccer-match-team">
                                            <div className="group-team">
                                                <div className="soccer-team home-team">
                                                    <TeamIcon src={CommonFunctions.getTeamIcon(match.homeTeam)} className="soccer-team-logo" />
                                                    <div className={`soccer-team-name ${matchStatus.homeWinclass}`}>{CommonFunctions.getTeamName(match.homeTeam)}</div>
                                                    <ul className="soccer-team-status">
                                                        {this.getTeamStatus(true, match)}
                                                    </ul>
                                                    <div className="soccer-team-result">
                                                        {homeTeamScore}
                                                    </div>

                                                </div>
                                                <div className="soccer-team away-team">
                                                    <TeamIcon src={CommonFunctions.getTeamIcon(match.awayTeam)} className="soccer-team-logo" />
                                                    <div className={`soccer-team-name ${matchStatus.awayWinClass}`}>{CommonFunctions.getTeamName(match.awayTeam)}</div>
                                                    <ul className="soccer-team-status">
                                                        {this.getTeamStatus(false, match)}
                                                    </ul>
                                                    <div className="soccer-team-result">
                                                        {awayTeamScore}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="soccer-match-star-icon">
                                            {
                                                matchStatus.result === 0 &&
                                                <span className="bg-color  bgyelow" title="Hòa">H</span>
                                            }
                                            {
                                                matchStatus.result === 1 &&
                                                <span className="bg-color bggreen" title="Thắng">T</span>
                                            }
                                            {
                                                matchStatus.result === 2 &&
                                                <span className="bg-color bgred" title="Bại">B</span>
                                            }
                                            <i className="icon-livescore icon-live-right" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    };

    getTeamResult = (teamId, match) => {
        const isHomeTeam = match.homeTeam.teamId === teamId;
        const homeFieldName = isHomeTeam ? 'homeTeam' : 'awayTeam';
        const awayFieldName = isHomeTeam ? 'awayTeam' : 'homeTeam';
        let result = 0;
        const homeTeamScore = match[`${homeFieldName}ExtraScore`] ? match[`${homeFieldName}ExtraScore`] : match[`${homeFieldName}TotalScore`];
        const awayTeamScore = match[`${awayFieldName}ExtraScore`] ? match[`${awayFieldName}ExtraScore`] : match[`${awayFieldName}TotalScore`];
        if (homeTeamScore > awayTeamScore) {
            result = 1;
        } else if (homeTeamScore < awayTeamScore) {
            result = 2;
        }
        const subResult = this.getSubScoreResult(match, homeFieldName, awayFieldName);
        result = subResult === 0 ? result : subResult;
        return result;
    };

    getSubScoreResult = (match, homeFieldName, awayFieldName) => {
        let result = 0;
        if (match[`${homeFieldName}PenaltyScore`]) {
            if (match[`${homeFieldName}PenaltyScore`] > match[`${awayFieldName}PenaltyScore`]) {
                result = 1;
            } else if (match[`${homeFieldName}PenaltyScore`] < match[`${awayFieldName}PenaltyScore`]) {
                result = 2;
            }
        } else if (match.isSecondLeg && match[`${homeFieldName}AggregateScore`]) {
            if (match[`${homeFieldName}AggregateScore`] > match[`${awayFieldName}AggregateScore`]) {
                result = 1;
            } else if (match[`${homeFieldName}AggregateScore`] < match[`${awayFieldName}AggregateScore`]) {
                result = 2;
            }
        }
        return result;
    };

    renderStatistic = matchs => {
        const generalInfo = this.props.match.generalInfo;
        let homeWins = 0;
        let draws = 0;
        let awayWins = 0;
        matchs.map(match => {
            const result = this.getTeamResult(generalInfo.homeTeam.teamId, match);
            switch (result) {
                case 0:
                    draws++;
                    break;
                case 1:
                    homeWins++;
                    break;
                case 2:
                    awayWins++;
                    break;
            }
        });

        return (
            <div className="h2h-statistic">
                <ul>
                    <li>
                        <p className="h2h-score">{homeWins}</p>
                        <p>Thắng</p>
                    </li>
                    <li>
                        <p className="h2h-score">{draws}</p>
                        <p>Hòa</p>
                    </li>
                    <li>
                        <p className="h2h-score">{awayWins}</p>
                        <p>Thắng</p>
                    </li>
                </ul>
            </div>
        );
    };


    render() {
        const headToHead = this.props.match.headToHead;
        if(!headToHead || headToHead.common.length === 0) {
            return null;
        }
        const { home, away, common } = headToHead;
        const generalInfo = this.props.match.generalInfo;
        return (
            <div className="block-line-up" id="doi-dau">
                <div className="block-line-up-main">
                    <div className="block-line-up-title">Đối đầu</div>
                    <div className="block-line-up-body">
                        <div className="head-to-head">
                            <Tabs id="head-to-head-tabs" className="head-to-head-nav" defaultActiveKey="Common">
                                <Tab eventKey="Home" title={CommonFunctions.getTeamName(generalInfo.homeTeam)} >
                                    {this.renderBody(home, generalInfo.homeTeam.teamId)}
                                </Tab>
                                <Tab eventKey="Common" title="Chung">
                                    {this.renderBody(common)}
                                </Tab>
                                <Tab eventKey="Away" title={CommonFunctions.getTeamName(generalInfo.awayTeam)}>
                                    {this.renderBody(away, generalInfo.awayTeam.teamId)}
                                </Tab>
                            </Tabs>
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

export default connect(mapStateToProps, mapDispatchToProps)(HeadToHead);