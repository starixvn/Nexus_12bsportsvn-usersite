import React, { Fragment, PureComponent } from 'react';
import TeamIcon from '@jsroot/components/Icon/TeamIcon';
import MatchStage from '@jsroot/components/MatchStage';
import { MatchStatus, IncidentStatus, IncidentPosition } from '@jsroot/common/constants';
import CommonFunctions from '@jsroot/common/common-functions';
import DateTimeService from '@jsroot/common/dateTimeService';
import IncidentIcon from '@jsroot/components/Icon/IncidentIcon';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
    weekdays: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
    weekdaysShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
});

export default class MatchInfo extends PureComponent {
    constructor(props) {
        super(props);
    }

    getMainScore = () => {
        const match = this.props.match;
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

    getTeamStatus = isHome => {
        const match = this.props.match;
        const homeFieldName = isHome ? 'homeTeam' : 'awayTeam';
        const awayFieldName = isHome ? 'awayTeam' : 'homeTeam';

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


    getPenScore = match => {
        const homeScore = match.homeTeamPenaltyScore;
        const awayScore = match.awayTeamPenaltyScore;
        if (match.status === MatchStatus.Finished && (homeScore > 0 || awayScore > 0)) {
            return <li>PEN: {homeScore} - {awayScore}</li>;
        }

        return null;
    };

    getSubScore = () => {
        const match = this.props.match;
        const isPreMatch = CommonFunctions.isPreMatch(match.status);
        return (
            <ul className="column column-center detail-score-status">
                {
                    !isPreMatch &&
                    <li>H1: {match.homeTeamHalfScore} - {match.awayTeamHalfScore}</li>
                }
                {this.getAggregateScore(match)}
                {this.getPenScore(match)}
            </ul>
        );
    };

    getBallAndCardNumber = isHome => {
        const { match } = this.props;
        const position = isHome ? IncidentPosition.Home : IncidentPosition.Away;
        const incidents = CommonFunctions.produceIncidents(this.props.incidents);
        const goalsStatusSelected = [IncidentStatus.Goal, IncidentStatus.Penalty, IncidentStatus.OwnGoal].join(',');
        const goals = incidents.filter(item => goalsStatusSelected.includes(item.type.toString()) && item.position === position && !item.isPenaltyShootout);
        let numberRedCard = 0;
        let numberYellowCard = 0;
        if (isHome) {
            numberRedCard = match.homeTeam.redCard;
            numberYellowCard = match.homeTeam.yellowCard;
        }
        if (!isHome) {
            numberRedCard = match.awayTeam.redCard;
            numberYellowCard = match.awayTeam.yellowCard;
        }
        return (
            <div className="participant-detail">
                {
                    goals.map((goal, gkey) => {
                        const timeShow = goal.timeShow !== '' ? goal.timeShow + "'" : '';
                        const playerName = !goal.playerName ? '' : goal.playerName;
                        let goalShow = `(${timeShow}) - ${playerName}`;
                        if(isHome) {
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

    handleClickLeague = (event, league) => {
        const url = CommonFunctions.getLeaguePageUrl(league);
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };

    handleClickDetail = (event, match) => {
        const url = CommonFunctions.getMatchDetailPageUrl(match);
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };



    render() {
        const { match } = this.props;
        const leagueName = CommonFunctions.getLeagueName(match.league);
        const homeTeamName = CommonFunctions.getTeamName(match.homeTeam);
        const awayTeamName = CommonFunctions.getTeamName(match.awayTeam);
        const isLiveMatch = CommonFunctions.isLiveMatch(match.status);
        const isIntermission = match.status === MatchStatus.Intermission;
        var startDate =  DateTimeService.convertFromUTC(match.startTime);
        return (
            <div className="duel-participant post-detail">
                <div className="league-and-time">
                    <ul className="league" onClick={event => this.handleClickLeague(event, match.league)}>
                        <li className="league-logo">
                            <TeamIcon className="duel-participant-home-wrapper-logo" alt={leagueName} src={CommonFunctions.getLeagueIcon(match.league)} />
                        </li>
                        <li className="league-name">{leagueName}</li>
                    </ul>
                    <p className="time">
                        <span className="days">{DateTimeService.formatDateTime(startDate, 'dddd, DD/MM/YYYY, HH:mm')}</span>
                    </p>
                </div>
               <div className="flex-league first-league">
                    <div className="column column-left home-team">
                        <ul className="soccer-team-status">
                            {this.getTeamStatus(true)}
                        </ul>
                    </div>
                    <div className={`column column-center ${isLiveMatch ? 'live' : ''} ${isIntermission ? 'live-middle' : ''}`}>
                        {
                            match.status !== MatchStatus.NotStarted && <MatchStage match={match} />
                        }
                    </div>
                    <div className="column column-right away-team">
                        <ul className="soccer-team-status">
                            {this.getTeamStatus(false)}
                        </ul>
                    </div>
                </div>

                <div className="flex-league center-league">
                    <div className="column column-left home-team">
                        <ul className="team">
                            <li className="team-name">{homeTeamName}</li>
                            <li className="team-logo">
                                <TeamIcon className="duel-participant-home-wrapper-logo" alt={homeTeamName} src={CommonFunctions.getTeamIcon(match.homeTeam)} />
                            </li>
                        </ul>
                    </div>
                    <div className="column column-center result-league">
                        {this.getMainScore()}
                    </div>
                    <div className="column column-right away-team">
                        <ul className="team">
                            <li className="team-logo">
                                <TeamIcon className="duel-participant-home-wrapper-logo" alt={awayTeamName} src={CommonFunctions.getTeamIcon(match.awayTeam)} />
                            </li>
                            <li className="team-name">{awayTeamName}</li>
                        </ul>
                    </div>
                </div>


                <div className="flex-league">
                    <div className="column column-left home-team sticky-position">
                        <div className="duel-participant-number">
                            {this.getBallAndCardNumber(true)}
                        </div>
                    </div>
                    {this.getSubScore()}
                    <div className="column column-right away-team sticky-position">
                        <div className="duel-participant-number">
                            {this.getBallAndCardNumber(false)}
                        </div>
                    </div>
                </div>

                <div className="view-detail" onClick={event => this.handleClickDetail(event, match)}>
                    <span>
                        Chi tiết trận đấu
                        <i className="icon-chevron-right"/>
                    </span>
                </div>
            </div>
        );
    }

}

