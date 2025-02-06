import React, { PureComponent } from 'react';
import CommonFunctions from '@jsroot/common/common-functions';
import TeamIcon from '@jsroot/components/Icon/TeamIcon';
import { MatchResult, MatchStatus, WorldCup  } from '@jsroot/common/constants';

export default class Item extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isHighLight: false,
            isShowPopup: true
        };
    }
    getScore = (match, isHomeTeam) => {
        return (
            <>
                {
                    match.matchId && match.status === MatchStatus.Finished &&
                    <div className="result ">{CommonFunctions.getScore(match, isHomeTeam)}</div>
                }
                {
                    match.secondLeg && match.status === MatchStatus.Finished &&
                    <div className="result ">{CommonFunctions.getScore(match.secondLeg, !isHomeTeam)}</div>
                }
            </>
        );
    };

    handleClick = (event, match) => {
        const url = CommonFunctions.getMatchDetailPageUrl(match, WorldCup.MatchDetailUrl);
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };

    getTeamName = team =>  team ? CommonFunctions.getTeamName(team) : '';

    getResultClass = (matchResult, isHome) => {
        const { match } = this.props;
        let className = '';
        if(isHome && matchResult === MatchResult.Win) {
            className = 'win';
        }
        if(!isHome && matchResult === MatchResult.Lose) {
            className = 'win';
        }
        if(match.status !== MatchStatus.Finished) {
            className = '';
        }
        return className;
    };

    renderBody = match => {
        let matchResult = MatchResult.Draw;
        if(match.matchId) {
            const checkMatch = match.secondLeg ? match.secondLeg : match;
            matchResult = CommonFunctions.getMatchResult(match.homeTeam.teamId, checkMatch);
        }
        return (
            <div className={`bracket ${match.matchId ? '' : 'bracket--eventless'}`} onClick={event => this.handleClick(event, match)}
                title={match.matchId ? 'Nhấp để xem danh sách trận đấu' : ''}>
                {
                    match.homeTeam &&
                    <TeamIcon className="bracket__image bracket__image--home" src={CommonFunctions.getTeamIcon(match.homeTeam)} />
                }
                <div className={`bracket__participant bracket__participant--home ${this.getResultClass(matchResult, true)}`}>
                    <span className="bracket__name ">{this.getTeamName(match.homeTeam)}</span>
                </div>
                <div className="bracket__result bracket__result--home">
                    {this.getScore(match, true)}
                </div>
                {
                    match.awayTeam &&
                    <TeamIcon className="bracket__image bracket__image--away" src={CommonFunctions.getTeamIcon(match.awayTeam)} />
                }
                <div className={`bracket__participant bracket__participant--away ${this.getResultClass(matchResult, false)}`}>
                    <span className="bracket__name bracket__name--advancing">{this.getTeamName(match.awayTeam)}</span>
                </div>
                <div className="bracket__result bracket__result--away">
                    {this.getScore(match, false)}
                </div>
            </div>
        );
    };
    render() {
        const { match, positionClass, index} = this.props;
        return (
            <div className={`draw__bracket ${positionClass} ${match.isDraw === false ? 'no-border' : ''}`} style={{zIndex: -index}}>
                {this.renderBody(match)}
            </div>
        );
    }
}