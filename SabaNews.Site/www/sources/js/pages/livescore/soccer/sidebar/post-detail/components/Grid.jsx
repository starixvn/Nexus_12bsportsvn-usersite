import React, { PureComponent } from 'react';
import CommonFunctions from '@jsroot/common/common-functions';
import Match from '../../match-grid/Match';

export default class Grid extends PureComponent {
    constructor(props) {
        super(props);
    }


    handleClickLeague = (event, league) => {
        const seasonId = league.season ? league.season.seasonId : league.currentSeasonId;
        const url = CommonFunctions.getLeaguePageUrl(league, seasonId);
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };


    render() {
        const { league, matches } = this.props;
        return (
            <div className="wc-bg-overflow">
                <div className="livescore-name-team">
                    <span className="round-name" onClick={event => this.handleClickLeague(event, league)}>{CommonFunctions.getLeagueName(league)}</span>
                </div>
                <div className="league-story">
                    <div className="group-duel" >
                        {
                            matches.map((item, key) => <Match key={key} match={{ ...item, league }} />)
                        }
                    </div>
                </div>
            </div>
        )
    }
}