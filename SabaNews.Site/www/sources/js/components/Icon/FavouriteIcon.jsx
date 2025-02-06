import React, { PureComponent } from 'react';
import LangHelper from '@jsroot/common/langHelper';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import CommonFunctions from '@jsroot/common/common-functions';
import { toast } from 'react-toastify';
import Site from '@jsroot/common/site';

toast.configure();

export default class FavouriteIcon extends PureComponent {
    constructor(props) {
        super(props);

        const matchId = this.props.matchId;
        const favMatches = CommonFunctions.getFavouriteMatches();
        const matchIndex = favMatches.findIndex(item => item === matchId);
        this.state = {
            isFavourite: matchIndex >= 0,
            isShowTooltip: true
        };
    }

    componentDidUpdate(prevProps){
        if(prevProps.flagToggle !== this.props.flagToggle) {
            const matchId = this.props.matchId;
            const favMatches = CommonFunctions.getFavouriteMatches();
            const matchIndex = favMatches.findIndex(item => item === matchId);
            const isFavourite =  matchIndex >= 0;
            if(isFavourite !== this.state.isFavourite) {
                this.setState({isFavourite: isFavourite});
            }
        }
    }

    handleUpdateFavourite = () => {
        const matchId = this.props.matchId;
        const isFavourite = CommonFunctions.updateFavouriteMatch(matchId);
        let message = '';
        if (isFavourite) {
            const url = Site.resolveClientUrl('lich-thi-dau/bong-da/tran-dau-quan-tam');
            message = <div className="fav-match fav-match-add">
                <ul>
                    <li className="text-fav"><i className="icon-livescore icon-live-start start-active"></i> Thêm vào trận đấu quan tâm</li>
                    <li className="show-link-toastify"><a href={url}>hiển thị</a></li>
                </ul>
            </div>;
        } else {
            message = <div className="fav-match fav-match-remove">
                <ul>
                    <li className="text-fav"><i className="icon-livescore icon-favourite-outline"></i> Xóa khỏi Trận đấu quan tâm</li>
                </ul>
            </div>;
        }

        const toastId = toast.dark(message, {
            toastId: 'fav',
            position: toast.POSITION.BOTTOM_CENTER,
            hideProgressBar: true,
            autoClose: 3000
        });
        toast.update(toastId, { render: () => message, autoClose: 3000 });
        this.setState({ isFavourite: isFavourite, isShowTooltip: false});
        this.onUpdateFavouriteMatch();
    };

    renderTooltip = () => {
        const { isFavourite } = this.state;
        return (
            <Tooltip className="tooltip-add-favourite-match" >
                {isFavourite ? LangHelper.getResource('RemoveFavouriteMatchTooltip') : LangHelper.getResource('AddFavouriteMatchTooltip')}
            </Tooltip>
        );
    };

    onMouseOut = () => {
        const isShowTooltip = this.state.isShowTooltip;
        if(!isShowTooltip) {
            this.setState({isShowTooltip: true});
        }
    };

    onUpdateFavouriteMatch = () => {
        const matchId = this.props.matchId;
        if(typeof(this.props.onUpdateFavouriteMatch) === 'function') {
            this.props.onUpdateFavouriteMatch(matchId);
        }
    };

    render() {
        const { isFavourite, isShowTooltip } = this.state;
        const favIconClass = isFavourite ? 'icon-live-start start-active' : 'icon-favourite-outline';

        return (
            <>
                {
                    isShowTooltip ?
                        <OverlayTrigger
                            placement="bottom"
                            overlay={this.renderTooltip()}
                        >
                            <i onClick={this.handleUpdateFavourite} onMouseOut={this.onMouseOut}
                                className={`icon-livescore ${favIconClass}`}
                            />
                        </OverlayTrigger> :
                        <i onClick={this.handleUpdateFavourite} onMouseOut={this.onMouseOut}
                            className={`icon-livescore ${favIconClass}`}
                        />
                }
            </>
        );
    }
}