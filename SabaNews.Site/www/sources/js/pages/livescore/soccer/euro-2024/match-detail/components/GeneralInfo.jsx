import React, { Fragment, PureComponent } from 'react';
import { MatchStatus, IncidentStatus, IncidentPosition } from '@jsroot/common/constants';
import IncidentIcon from '@jsroot/components/Icon/IncidentIcon';
import CommonFunctions from '@jsroot/common/common-functions';
import DateTimeService from '@jsroot/common/dateTimeService';
import MatchStage from '@jsroot/components/MatchStage';
import TeamIcon from '@jsroot/components/Icon/TeamIcon';
import Site from '@jsroot/common/site';
import LangHelper from '@jsroot/common/langHelper';
import FunctionBar from './FunctionBar';


export default class GeneralInfo extends PureComponent {
    constructor(props) {
        super(props);
    }
    getMatchScores = () => {
        const match = this.props.match.generalInfo;
        const startTime = DateTimeService.convertFromUTC(match.startTime);
        switch (match.status) {
            case MatchStatus.NotStarted:
            case MatchStatus.Delay:
            case MatchStatus.Postpone:
            case MatchStatus.Cancel:
            case MatchStatus.TBD:
                return <div className="detail-score-wrapper live before-score">
                    <span>{DateTimeService.toShortTimeFormat(startTime)}</span>
                </div>;
            default:
                return <div className="detail-score-wrapper live">
                    <span>{match.homeTeamExtraScore ? match.homeTeamExtraScore : match.homeTeamTotalScore}</span>
                    <span className="detail-score-divider"> - </span>
                    <span>{match.awayTeamExtraScore ? match.awayTeamExtraScore : match.awayTeamTotalScore}</span>
                </div>;
        }
    };

    getAggregateScore = match => {
        const homeScore = match.homeTeamAggregateScore;
        const awayScore = match.awayTeamAggregateScore;

        if (match.isSecondLeg && match.status === MatchStatus.Finished && (homeScore > 0 || awayScore > 0)) {
            return <li>AGG: {homeScore} - {awayScore}</li>;
        }

        return null;
    };

    getPenaltyScore = match => {
        const homeScore = match.homeTeamPenaltyScore;
        const awayScore = match.awayTeamPenaltyScore;
        if (match.status === MatchStatus.Finished && (homeScore > 0 || awayScore > 0)) {
            return <li>PEN: {homeScore} - {awayScore}</li>;
        }

        return null;
    };

    getSubScore = () => {
        const match = this.props.match.generalInfo;
        const isPreMatch = CommonFunctions.isPreMatch(match.status);
        return (
            <>
                {
                    !isPreMatch &&
                    <li>H1: {match.homeTeamHalfScore} - {match.awayTeamHalfScore}</li>
                }
                {this.getAggregateScore(match)}
                {this.getPenaltyScore(match)}
            </>
        );
    };

    getBallAndCardNumber = position => {
        const { statistic } = this.props.match;
        const incidents = CommonFunctions.produceIncidents(this.props.match.incidents);
        const goalsStatusSelected = [IncidentStatus.Goal, IncidentStatus.Penalty, IncidentStatus.OwnGoal].join(',');
        const goals = incidents.filter(item => goalsStatusSelected.includes(item.type.toString()) && item.position === position && !item.isPenaltyShootout);
        let numberRedCard = 0;
        let numberYellowCard = 0;
        if (position === IncidentPosition.Home && statistic.homeStatistic) {
            numberRedCard = statistic.homeStatistic.redCard;
            numberYellowCard = statistic.homeStatistic.yellowCard;
        }
        if (position === IncidentPosition.Away && statistic.awayStatistic) {
            numberRedCard = statistic.awayStatistic.redCard;
            numberYellowCard = statistic.awayStatistic.yellowCard;
        }
        return (
            <div className="participant-detail">
                {
                    goals.map((goal, gkey) => {
                        const timeShow = goal.timeShow !== '' ? goal.timeShow + "'" : '';
                        const playerName = !goal.playerName ? '' : goal.playerName;
                        let goalShow = `(${timeShow}) - ${playerName}`;
                        if(position === IncidentPosition.Home) {
                            goalShow = `${playerName} - (${timeShow})`;
                        }
                        return (
                            <ul key={gkey} className="participant-detail-group name-player-goal">
                                <li><IncidentIcon type={goal.type} />
                                    <span className="name-player">{goalShow}</span>
                                </li>
                            </ul>
                        );
                    })
                }
                {
                    numberRedCard > 0 &&
                    <span className="card-league red-card">{numberRedCard}</span>
                }
                {
                    numberYellowCard > 0 &&
                    <span className="card-league yellow-card">{numberYellowCard}</span>
                }
            </div>
        );
    };

    getTeamStatus = isHomeTeam => {
        const generalInfo = this.props.match.generalInfo;
        const homeFieldName = isHomeTeam ? 'homeTeam' : 'awayTeam';
        const awayFieldName = isHomeTeam ? 'awayTeam' : 'homeTeam';

        if (generalInfo.status === MatchStatus.Finished) {
            if (generalInfo[`${homeFieldName}PenaltyScore`]
                && generalInfo[`${homeFieldName}PenaltyScore`] > generalInfo[`${awayFieldName}PenaltyScore`]) {
                return <li>PEN</li>;
            } else {
                if (generalInfo.isSecondLeg && generalInfo[`${homeFieldName}AggregateScore`]
                    && generalInfo[`${homeFieldName}AggregateScore`] > generalInfo[`${awayFieldName}AggregateScore`]) {
                    return <li>AGG</li>;
                }
            }
        }

        return <Fragment />;
    };

    handleClick = event => {
        const url = Site.resolveClientUrl(`lich-thi-dau/bong-da`);
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };

    handleClickLeague = (event, league) => {
        const url = CommonFunctions.getLeaguePageUrl(league);
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };

    handleClickTeam = (event, team) => {
        const teamName = Site.toSlug(CommonFunctions.getTeamName(team));
        const url = Site.resolveClientUrl(`euro-2024/doi-tuyen/${teamName}/${team.teamId}`);
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };

    renderLeague = match => {
        const startTime = DateTimeService.convertFromUTC(match.startTime);
        const leagueName = this.getLeagueName(match);
        return (
            <div className="livescore-league-header-detail">
                <div className="livescore-league-header-detail-group">
                    <div className="title-section">
                        <h2>
                            {leagueName}
                            <p className="start-date">{startTime.format('DD/MM/YYYY')}</p>
                        </h2>
                    </div>
                </div>
            </div>
        );
    };
    getLeagueName = match => {
        let leagueName = '';
        const round = match.round > 0 ? `- ${LangHelper.getResource('Turn')} ${match.round}` : '';
        leagueName = `${CommonFunctions.getStageName(match.stage)} ${round}`;
        return leagueName;
    };

    getMatchScoreTitle = () => {
        const { generalInfo } = this.props.match;
        const isPreMatch = CommonFunctions.isPreMatch(generalInfo.status);
        if(isPreMatch) {
            return "vs";
        }
        const homeScore = generalInfo.homeTeamExtraScore ? generalInfo.homeTeamExtraScore : generalInfo.homeTeamTotalScore;
        const awayScore = generalInfo.awayTeamExtraScore ? generalInfo.awayTeamExtraScore : generalInfo.awayTeamTotalScore;
        const score = `${homeScore}-${awayScore}`;
        if ((generalInfo.homeTeamPenaltyScore > 0 || generalInfo.awayTeamPenaltyScore > 0)) {
            return `${score} (PEN: ${generalInfo.homeTeamPenaltyScore}-${generalInfo.awayTeamPenaltyScore})`;
        }
        if (generalInfo.isSecondLeg  && (generalInfo.homeTeamAggregateScore > 0 || generalInfo.awayTeamAggregateScore > 0)) {
            return `${score} (AGG: ${generalInfo.homeTeamAggregateScore}-${generalInfo.awayTeamAggregateScore})`;
        }
        return score;
    }

    getMatchTitle = () => {
        const { generalInfo } = this.props.match;
        const isLiveMatch = CommonFunctions.isLiveMatch(generalInfo.status);
        const isPreMatch = CommonFunctions.isPreMatch(generalInfo.status);
        let matchStatus = "";
        const startTime = DateTimeService.convertFromUTC(generalInfo.startTime);
        const homeTeamName = CommonFunctions.getTeamName(generalInfo.homeTeam);
        const awayTeamName = CommonFunctions.getTeamName(generalInfo.awayTeam);
        const leagueName = CommonFunctions.getLeagueName(generalInfo.league);
        const matchScore = this.getMatchScoreTitle()
        if(isPreMatch) {
            matchStatus = LangHelper.getResource('Fixture');
        } else if(isLiveMatch) {
            matchStatus = LangHelper.getResource('Live');
        } else {
            matchStatus = LangHelper.getResource('Result');
        }
        return `${matchStatus} ${homeTeamName} ${matchScore} ${awayTeamName} - ${leagueName} - ${startTime.format('DD/MM/YYYY')}`;
    }


    renderBody = () => {
        const { generalInfo } = this.props.match;
        const isLiveMatch = CommonFunctions.isLiveMatch(generalInfo.status);
        const isIntermission = generalInfo.status === MatchStatus.Intermission;
        const isPreMatch = CommonFunctions.isPreMatch(generalInfo.status);
        return (
            <>
                {this.renderLeague(generalInfo)}
                <div className="duel-participant">
                    {
                        <div className="flex-league first-league">
                            <div className="column column-left home-team">
                                <ul className="soccer-team-status">
                                    {this.getTeamStatus(true)}
                                </ul>
                            </div>
                            <div className={`column column-center ${isLiveMatch ? 'live' : ''} ${isIntermission ? 'live-middle' : ''}`}>
                                {
                                    generalInfo.status !== MatchStatus.NotStarted && <MatchStage match={generalInfo} />
                                }
                            </div>
                            <div className="column column-right away-team">
                                <ul className="soccer-team-status">
                                    {this.getTeamStatus(false)}
                                </ul>
                            </div>
                        </div>
                    }
                    <div className="flex-league">
                        <div className="column column-left home-team">
                            <ul className="team" onClick={event => this.handleClickTeam(event, generalInfo.homeTeam)}>
                                <li className="team-name">
                                    {CommonFunctions.getTeamName(generalInfo.homeTeam)}
                                </li>
                                <li className="team-logo">
                                    <TeamIcon src={CommonFunctions.getTeamIcon(generalInfo.homeTeam)} className="duel-participant-home-wrapper-logo" />
                                </li>
                            </ul>
                        </div>
                        <div className="column column-center result-league"> {this.getMatchScores()}</div>
                        <div className="column column-right away-team">
                            <ul className="team" onClick={event => this.handleClickTeam(event, generalInfo.awayTeam)}>
                                <li className="team-logo">
                                    <TeamIcon src={CommonFunctions.getTeamIcon(generalInfo.awayTeam)} />
                                </li>
                                <li className="team-name">{CommonFunctions.getTeamName(generalInfo.awayTeam)}</li>
                            </ul>
                        </div>
                    </div>
                    {
                        !isPreMatch &&
                        <div className="flex-league">
                            <div className="column column-left home-team sticky-position">
                                <div className="duel-participant-number">
                                    {this.getBallAndCardNumber(IncidentPosition.Home)}
                                </div>
                            </div>
                            <ul className="column column-center detail-score-status">
                                {this.getSubScore()}
                            </ul>
                            <div className="column column-right away-team sticky-position">
                                <div className="duel-participant-number">
                                    {this.getBallAndCardNumber(IncidentPosition.Away)}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </>
        );
    };

    render() {
        document.title = this.getMatchTitle();
        return (
            <Fragment>
                <div className="sticky-header">
                    {this.renderBody()}
                </div>
                <div className="detail-fixed">
                    <div className="sticky-header-scroll">
                        {this.renderBody()}
                    </div>
                    <FunctionBar />
                </div>
            </Fragment>
        );
    }
}