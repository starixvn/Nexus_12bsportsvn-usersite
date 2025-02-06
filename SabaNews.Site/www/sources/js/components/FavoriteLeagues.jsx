import React, { PureComponent } from 'react';
import TeamIcon from '@jsroot/components/Icon/TeamIcon';
import LangHelper from '@jsroot/common/langHelper';
import Site from '@jsroot/common/site';
import CommonFunctions from '@jsroot/common/common-functions';
import FavouriteLeagueIcon from '@jsroot/components/Icon/FavouriteLeagueIcon';
import SearchLeague from './SearchLeague';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

export default class FavoriteLeagues extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            leagues: props.leagues,
            isShowSearchPopup: false
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.leagues !== prevProps.leagues) {
            this.setState({
                leagues: this.props.leagues
            });
        }
    }

    handleClick = (event, league) => {
        const className = event.target.className;
        if (className.includes('icon-livescore')) {
            return;
        }
        const url = CommonFunctions.getLeaguePageUrl(league);
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };

    sortLeagues = leagues => {
        const items = [...leagues];
        return items.sort((item1, item2) => (item2.order - item1.order));
    };

    onUpdateFavLeague = () => {
        const favLeagues = CommonFunctions.getFavLeagues();
        this.setState({ leagues: favLeagues });
        if (typeof (this.props.onToggleIcon) === 'function') {
            this.props.onToggleIcon();
        }
    };

    handleOpenSearchPopup = () => {
        this.setState({ isShowSearchPopup: true });
    };
    handleCloseSearchPopup = () => {
        this.setState({ isShowSearchPopup: false });
    };
    renderTooltip = () => {
        return (
            <Tooltip className="tooltip-add-favourite-match" >
                {LangHelper.getResource('AddLeague')}
            </Tooltip>
        );
    };
    handleNavigateToMyLeaguePage = event => {
        const url = Site.resolveClientUrl(`lich-thi-dau/bong-da/giai-dau-quan-tam`);
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };

    render() {
        const leagues = this.sortLeagues(this.state.leagues);
        const { isShowSearchPopup } = this.state;
        const { searchLeagues } = this.props;
        return (
            <div className="leagues">
                <div className="leagues-title">
                    <div className="leagues-group" onClick={this.handleNavigateToMyLeaguePage}>
                        <span>{LangHelper.getResource('MyLeagues')}</span>
                    </div>
                    <OverlayTrigger
                        placement="bottom"
                        overlay={this.renderTooltip()}
                    >
                        <i onClick={this.handleOpenSearchPopup} className="icon-livescore icon-close rotare-plus" />
                    </OverlayTrigger>
                </div>
                <div className="leagues-main">
                    {
                        leagues.map(league => {
                            return (
                                <div key={league.leagueId} className="leagues-item" onClick={event => this.handleClick(event, league)}>
                                    <div className="leagues-name">
                                        <TeamIcon alt={CommonFunctions.getLeagueName(league)} className="logo" src={CommonFunctions.getLeagueIcon(league)} />
                                        <span className="text">{CommonFunctions.getLeagueName(league)}</span>
                                    </div>
                                    <div className="toggle-league">
                                        <FavouriteLeagueIcon league={league} onUpdateFavLeague={this.onUpdateFavLeague} />
                                    </div>
                                </div>
                            );
                        })
                    }
                    {
                        leagues.length === 0 &&
                        <div className="empty-league">Nhấp vào biểu tượng <i className="icon-fav-league icon-livescore icon-favourite-outline" /> để thêm giải đấu yêu thích</div>
                    }
                </div>
                <SearchLeague searchLeagues={searchLeagues}
                    isShowSearchPopup={isShowSearchPopup}
                    onClose={this.handleCloseSearchPopup}
                    onUpdateFavLeague={this.onUpdateFavLeague} />
            </div>
        );
    }
}