import React, { PureComponent } from 'react';
import CommonFunctions from '@jsroot/common/common-functions';
import StandingGrid from '../../standing-grid/Index';
import PCGrid from './PCGrid';

export default class Grid extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedLeagueId: this.initSelectedLeagueId()
        };
    }

    initSelectedLeagueId = () => {
        const { standings } = this.props;
        let selectedId = 0;
        for (let i = 0; i < standings.length; i++) {
            const item = standings[i];
            if (item.standing.length > 0) {
                selectedId = item.league.leagueId;
                break;
            }
        }
        return selectedId;
    };

    onChange = event => {
        this.setState({ selectedLeagueId: parseInt(event.target.value) });
    };

    handleSelectLeague = leagueId => {
        this.setState({ selectedLeagueId: parseInt(leagueId) });
    };

    getLeagueStanding = () => {
        const { selectedLeagueId } = this.state;
        const { standings } = this.props;
        const currentStanding = standings.find(item => item.league.leagueId === selectedLeagueId);
        return currentStanding;
    };

    handleClickStanding = (event, league) => {
        const url = CommonFunctions.getLeaguePageUrl(league, 'bang-xep-hang');
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };


    render() {
        const { standings } = this.props;
        const { selectedLeagueId } = this.state;
        const currentLeagueStanding = this.getLeagueStanding();
        if (!currentLeagueStanding) {
            return null;
        }
        return (
            <><div className="block__title" onClick={event => this.handleClickStanding(event, currentLeagueStanding.league)}> <h2><a>Bảng xếp hạng</a></h2> </div>
                <div className="livescore-soccer-main">
                    <div className="season-standings">
                        <div className="control-standing " >
                            <div className="parent-dropdown">
                                <PCGrid
                                    standings={standings} 
                                    currentLeagueStanding={currentLeagueStanding}
                                    handleClickStanding={this.handleClickStanding}
                                    handleSelectLeague={this.handleSelectLeague} />
                                <span className="mobile-match">
                                    {CommonFunctions.getLeagueName(currentLeagueStanding.league)}
                                    <i className="icon-chevron-down" />
                                </span>
                                <select onChange={this.onChange} value={selectedLeagueId}>
                                    {
                                        standings.map((standing, index) =>
                                            standing.standing.length > 0 &&
                                            <option value={standing.league.leagueId} key={index} >{CommonFunctions.getLeagueName(standing.league)}</option>)
                                    }
                                </select>
                            </div>
                        </div>
                        <StandingGrid leagueStanding={currentLeagueStanding} />
                    </div>
                </div>
                <div className="view-more-block" onClick={event => this.handleClickStanding(event, currentLeagueStanding.league)}>
                    <a>Xem Thêm</a>
                </div>
            </>
        );
    }
}