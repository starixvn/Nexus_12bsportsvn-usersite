import React, { PureComponent, Fragment } from 'react';
import DateTimeService from '@jsroot/common/dateTimeService';
import LangHelper from '@jsroot/common/langHelper';
import MatchStage from '@jsroot/components/MatchStage';
import { MatchStatus } from '@jsroot/common/constants';
import TeamIcon from '@jsroot/components/Icon/TeamIcon';
import CommonFunctions from '@jsroot/common/common-functions';


export default class Match extends PureComponent {
    constructor(props) {
        super(props);
    }

    getMatchStage = () => {
        const { match } = this.props;
        const isLive = CommonFunctions.isLiveMatch(match.status);
        let stage = '';
        if (match.status === MatchStatus.Finished || match.status === MatchStatus.CutInHalf || isLive) {
            return this.getFinalScore(match);
        }
        switch (match.status) {
            case MatchStatus.NotStarted:
                const startTime = DateTimeService.convertFromUTC(match.startTime);
                stage = DateTimeService.toShortTimeFormat(startTime);
                break;

            case MatchStatus.Delay:
                stage = LangHelper.getResource('Delay');
                break;

            case MatchStatus.Interrupt:
                stage = LangHelper.getResource('Interrupt');
                break;

            case MatchStatus.Postpone:
                stage = LangHelper.getResource('Postponed');
                break;

            case MatchStatus.Cancel:
                stage = LangHelper.getResource('Cancel');
                break;

            case MatchStatus.TBD:
                stage = <span title={LangHelper.getResource('ToBeDecided')}>{LangHelper.getResource('ToBeDecidedForShort')}</span>;
                break;
            default:
                stage = LangHelper.getResource('Finish');
                break;
        }

        return stage;
    };

    onClick = event => {
        const url = CommonFunctions.getMatchDetailPageUrl(this.props.match);
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };

    renderTeamName = name => {
        const isShowMore = name.length > 11;
        const teamName = isShowMore ? name.substring(0, 11) + '....' : name;
        return (
            <li className="team-name" title={isShowMore ? name : ''}>{teamName}</li>
        )
    };

    renderTeamStatus = (match, isHomeTeam) => {
        const hAttr = isHomeTeam ? 'homeTeam' : 'awayTeam';
        const aAttr = isHomeTeam ? 'awayTeam' : 'homeTeam';

        if (match.status === MatchStatus.Finished) {
            if (match[`${hAttr}PenaltyScore`]
                && match[`${hAttr}PenaltyScore`] > match[`${aAttr}PenaltyScore`]) {
                return <li>PEN</li>;
            } else if (match.isSecondLeg && match[`${hAttr}AggregateScore`]
                && match[`${hAttr}AggregateScore`] > match[`${aAttr}AggregateScore`]) {
                return <li>AGG</li>;
            } else {
                return <Fragment />;
            }
        }

        return <Fragment />;
    };


    getFinalScore = match => {
        return (
            <>
                <span>{match.homeTeamExtraScore ? match.homeTeamExtraScore : match.homeTeamTotalScore}</span>
                <span className="detail-score-divider"> - </span>
                <span>{match.awayTeamExtraScore ? match.awayTeamExtraScore : match.awayTeamTotalScore}</span>
            </>
        )
    }


    render() {
        const { match } = this.props;
        const isLive = CommonFunctions.isLiveMatch(match.status);
        const isIntermission = match.status === MatchStatus.Intermission;
        const homeName = CommonFunctions.getTeamName(match.homeTeam);
        const awayName = CommonFunctions.getTeamName(match.awayTeam);
        return (
            <div className={`duel-participant ${isLive ? 'live' : ''} ${isIntermission ? 'live-intermission' : ''}`} onClick={this.onClick}>
                <div className="flex-league">
                    <div className="column column-left home-team">
                        <ul className="team">
                            {this.renderTeamName(homeName)}
                            <li className="team-logo">
                                <TeamIcon alt={homeName} src={CommonFunctions.getTeamIcon(match.homeTeam)} />
                            </li>
                        </ul>
                    </div>
                    <div className="column column-center result-league">
                        <div className={`detail-score-wrapper ${isLive ? 'live' : ''}`}>
                            {this.getMatchStage()}
                        </div>
                    </div>
                    <div className="column column-right away-team">
                        <ul className="team">
                            <li className="team-logo">
                                <TeamIcon alt={awayName} src={CommonFunctions.getTeamIcon(match.awayTeam)} />
                            </li>
                            {this.renderTeamName(awayName)}
                        </ul>
                    </div>
                </div>
                <div className="flex-league">
                    <div className="column column-left home-team"></div>
                    <div className="column column-center">
                        <div className="soccer-match-stage">
                            {isLive && <MatchStage match={match} />}
                        </div>
                    </div>
                    <div className="column column-right away-team"></div>
                </div>
            </div>
        );
    }
}