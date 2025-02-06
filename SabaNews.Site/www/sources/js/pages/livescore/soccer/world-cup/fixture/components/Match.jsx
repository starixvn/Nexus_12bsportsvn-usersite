import React, { PureComponent, Fragment } from 'react';
import MatchStage from '@jsroot/components/MatchStage';
import TeamScore from '../../../index/components/match-grid/TeamScore';
import TeamIcon from '@jsroot/components/Icon/TeamIcon';
import { MatchStatus, MatchResult, WorldCup } from '@jsroot/common/constants';
import CommonFunctions from '@jsroot/common/common-functions';
import DateTimeService from '@jsroot/common/dateTimeService';

export default class Match extends PureComponent {
    constructor(props) {
        super(props);
    }

    getTeamStatus = (match, isHomeTeam) => {
        const hField = isHomeTeam ? 'homeTeam' : 'awayTeam';
        const aField = isHomeTeam ? 'awayTeam' : 'homeTeam';

        if (match.status === MatchStatus.Finished) {
            if (match[`${hField}PenaltyScore`]
                && match[`${hField}PenaltyScore`] > match[`${aField}PenaltyScore`]) {
                return <li>PEN</li>;
            } else if (match.isSecondLeg && match[`${hField}AggregateScore`]
                && match[`${hField}AggregateScore`] > match[`${aField}AggregateScore`]) {
                return <li>AGG</li>;
            } else {
                return <Fragment />;
            }
        }

        return <Fragment />;
    };

    onClick = event => {
        const url = CommonFunctions.getMatchDetailPageUrl(this.props.match, WorldCup.MatchDetailUrl);
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };

    getTeamName = name =>  name.length > 11 ? name.substring(0, 11) + '....' : name;

    render() {
        const { match } = this.props;
        const isLiveMatch = CommonFunctions.isLiveMatch(match.status);
        const isIntermission = match.status === MatchStatus.Intermission;
        const startTime = DateTimeService.convertFromUTC(match.startTime);
        const teamResult = CommonFunctions.getMatchResult(match.homeTeam.teamId, match);
        return (
            <>
                <div className="group-match-item" onClick={this.onClick}>
                    <div className={`soccer-match-item ${isLiveMatch ? 'live' : ''} ${isIntermission ? 'live-intermission' : ''}`}
                    >
                        <div className="soccer-match-date-result">
                            <div className="group-live-icon">
                                <i className="icon-livescore icon-wc-live" />
                                <MatchStage match={match} />
                            </div>
                            <span className="wc-date">{startTime.format('DD/MM')}</span>
                        </div>
                        <div className="soccer-match-team">
                            <div className="group-team">
                                <div className="soccer-team home-team">
                                    <TeamIcon className="soccer-team-logo" src={CommonFunctions.getTeamIcon(match.homeTeam)} />
                                    <div className={`soccer-team-name ${teamResult === MatchResult.Win ? 'win': ''}`}>
                                        {this.getTeamName(CommonFunctions.getTeamName(match.homeTeam))}
                                    </div>
                                    <TeamScore match={match}  isHomeTeam   />
                                    <ul className="soccer-team-status">
                                        {this.getTeamStatus(match, true)}
                                    </ul>
                                </div>
                                <div className="soccer-team away-team">
                                    <TeamIcon className="soccer-team-logo" src={CommonFunctions.getTeamIcon(match.awayTeam)} />
                                    <div className={`soccer-team-name ${teamResult === MatchResult.Lose ? 'win': ''}`}>
                                        {this.getTeamName(CommonFunctions.getTeamName(match.awayTeam))}
                                    </div>
                                    <ul className="soccer-team-status">
                                        {this.getTeamStatus(match, false)}
                                    </ul>
                                    <TeamScore match={match} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}