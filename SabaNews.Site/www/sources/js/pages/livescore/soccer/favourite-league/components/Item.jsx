import React, { PureComponent } from 'react';
import TeamIcon from '@jsroot/components/Icon/TeamIcon';
import CommonFunctions from '@jsroot/common/common-functions';
import FavouriteLeagueIcon from '@jsroot/components/Icon/FavouriteLeagueIcon';
import LangHelper from '@jsroot/common/langHelper';

export default class Item extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            leagues: props.leagues
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.leagues !== this.props.leagues) {
            this.setState({ leagues: this.props.leagues });
        }
    }

    onUpdateFavLeague = league => {
        this.props.onUpdateFavLeague(league);
    };

    handleClickLeague = (event, league) => {
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

    render() {
        const { leagues } = this.state;
        const { searchKey } = this.props;
        if( this.props.leagues.length === 0) {
            return <div className="none-livescore">{LangHelper.getResource('NotFoundLeague')}</div>;
        }
        return (
            <div className="my-league">
                {leagues.map(league => {
                    const reg = new RegExp(`(${searchKey})`, 'gi');
                    const leagueName = CommonFunctions.getLeagueName(league)
                        .replace(reg, "<span class='text-matched'>$1</span>");
                    return (
                        <div className="draggable-item my-league-item result-search" key={league.leagueId}  onClick={event => this.handleClickLeague(event, league)}>
                            <FavouriteLeagueIcon league={league}
                                order={league.order}
                                onUpdateFavLeague={() => this.onUpdateFavLeague(league)}
                                className='my-league-item-action' />
                            <TeamIcon className="my-league-item-img" src={CommonFunctions.getLeagueIcon(league)} />
                            <div className="my-league-item-name"> <span dangerouslySetInnerHTML={{ __html: leagueName }}></span> </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}