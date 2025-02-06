import React, { PureComponent } from 'react';
import LangHelper from '@jsroot/common/langHelper';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { toast } from 'react-toastify';
import CommonFunctions from '@jsroot/common/common-functions';
toast.configure();

export default class FavouriteLeagueIcon extends PureComponent {
    constructor(props) {
        super(props);
        const league = this.props.league;
        const favLeagues = CommonFunctions.getFavLeagues();
        const leagueIndex = favLeagues.findIndex(item => item.leagueId === league.leagueId);
        this.state = {
            isFavourite: leagueIndex >= 0,
            isShowTooltip: true
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.flagToggle !== this.props.flagToggle) {
            const league = this.props.league;
            const favLeagues = CommonFunctions.getFavLeagues();
            const leagueIndex = favLeagues.findIndex(item => item.leagueId === league.leagueId);
            const isFavourite = leagueIndex >= 0;
            if (isFavourite !== this.state.isFavourite) {
                this.setState({ isFavourite: isFavourite });
            }
        }
    }

    handleUpdateFavourite = () => {
        const { league, order } = this.props;
        let favLeague = CommonFunctions.getFavLeagues();
        const favourite = favLeague.find(item => item.leagueId === league.leagueId);
        let isFavourite = false;
        let message = '';
        if (favourite) {
            favLeague = favLeague.filter(item => item.leagueId !== league.leagueId);
            message = (<div className="fav-league fav-league-add">
                <ul>
                    <li className="text-fav"><i className="icon-livescore icon-favourite-outline"></i> Đã xóa khỏi Giải Đấu Của Tôi</li>
                </ul>
            </div>);
        } else {
            isFavourite = true;
            const orders = favLeague.map(item => item.order);
            const currentOrder = orders.length > 0 ? Math.max(...orders) : 0;
            const leagueTmp = {
                leagueId: league.leagueId,
                leagueNameEN: league.leagueNameEN,
                leagueFullNameEN: league.leagueFullNameEN,
                leagueNameVN: league.leagueNameVN,
                icon: league.icon,
                iconVN: league.iconVN,
                currentSeasonId: league.season ? league.season.seasonId : league.currentSeasonId,
                order: order ? order : currentOrder + 1
            };
            favLeague.push(leagueTmp);
            message = (<div className="fav-league fav-league-add">
                <ul>
                    <li className="text-fav"><i className="icon-livescore icon-live-start start-active"></i> Đã thêm vào Giải Đấu Của Tôi</li>
                </ul>
            </div>);
        }
        const toastId = toast.dark(message, {
            toastId: 'leaguefav',
            position: toast.POSITION.BOTTOM_CENTER,
            hideProgressBar: true,
            autoClose: 3000
        });
        toast.update(toastId, { render: () => message, autoClose: 3000 });
        this.setState({ isFavourite: isFavourite, isShowTooltip: false });
        localStorage.setItem('favourite-leagues', JSON.stringify(favLeague));
        localStorage.setItem('isDefaultLeague', 0);
        this.onUpdateFavLeague();
        return isFavourite;
    };

    renderTooltip = () => {
        const { isFavourite } = this.state;
        return (
            <Tooltip className="tooltip-add-favourite-match" >
                {isFavourite ? LangHelper.getResource('RemoveFavouriteLeagueTooltip') : LangHelper.getResource('AddFavouriteLeagueTooltip')}
            </Tooltip>
        );
    };

    onMouseOut = () => {
        const isShowTooltip = this.state.isShowTooltip;
        if (!isShowTooltip) {
            this.setState({ isShowTooltip: true });
        }
    };

    onUpdateFavLeague = () => {
        if (typeof (this.props.onUpdateFavLeague) === 'function') {
            this.props.onUpdateFavLeague();
        }
    };

    render() {
        const { isFavourite, isShowTooltip } = this.state;
        const { className } = this.props;
        const defaultClass = className ? className : '';
        const favClass = isFavourite ? 'icon-live-start start-active' : 'icon-favourite-outline';
        return (
            <>
                {
                    isShowTooltip ?
                        <OverlayTrigger
                            placement="bottom"
                            overlay={this.renderTooltip()}
                        >
                            <i onClick={this.handleUpdateFavourite} onMouseOut={this.onMouseOut}
                                className={`icon-fav-league icon-livescore ${defaultClass} ${favClass}`}
                            />
                        </OverlayTrigger> :
                        <i onClick={this.handleUpdateFavourite} onMouseOut={this.onMouseOut}
                            className={`icon-fav-league icon-livescore ${defaultClass} ${favClass}`}
                        />
                }
            </>
        );
    }
}