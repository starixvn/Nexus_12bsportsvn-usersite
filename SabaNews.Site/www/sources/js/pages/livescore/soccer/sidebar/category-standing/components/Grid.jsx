import React, { PureComponent } from 'react';
import CommonFunctions from '@jsroot/common/common-functions';
import StandingGrid from '../../standing-grid/Index';


export default class Grid extends PureComponent {
    constructor(props) {
        super(props);
    }


    handleClickStanding = (event, league) => {
        const url = CommonFunctions.getLeaguePageUrl(league, 'bang-xep-hang');
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };


    render() {
        const { standing, league } = this.props;
        return (
            <div>
                <div className="block__title" onClick={event => this.handleClickStanding(event, league)}> <h2><a>Bảng xếp hạng</a></h2> </div>
                <div className="livescore-soccer-main">
                    <div className="season-standings">
                        <div className="control-standing " >
                            <div className="parent-dropdown">
                                <span  className="pc-match">
                                    {CommonFunctions.getLeagueName(league)}
                                </span>
                                <span className="mobile-match">
                                    {CommonFunctions.getLeagueName(league)}
                                </span>
                            </div>
                        </div>
                        <StandingGrid leagueStanding={{league, standing}} />
                    </div>
                </div>
                <div className="view-more-block" onClick={event => this.handleClickStanding(event, league)}>
                    <a>Xem Thêm</a>
                </div>
            </div>
        );
    }
}