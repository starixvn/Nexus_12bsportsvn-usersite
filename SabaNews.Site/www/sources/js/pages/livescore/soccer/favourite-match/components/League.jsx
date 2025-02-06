import React, { PureComponent } from 'react';
import CommonFunctions from '@jsroot/common/common-functions';
import FavouriteLeagueIcon from '@jsroot/components/Icon/FavouriteLeagueIcon';
import TeamIcon from '@jsroot/components/Icon/TeamIcon';
import { Width1024 } from '@jsroot/common/constants';

export default class League extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isMobile: window.innerWidth <= Width1024 ? true : false
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const isMobile = this.state.isMobile;
        if (!isMobile && window.innerWidth <= Width1024) {
            this.setState({ isMobile: true });
        } else {
            if (isMobile && window.innerWidth > Width1024) {
                this.setState({ isMobile: false });
            }
        }
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
        const { league, flagToggleIcon } =  this.props;
        const { isMobile } = this.state;
        const separate = isMobile ? '' : ': ';
        const leagueName = CommonFunctions.getLeagueName(league);
        const countryName = league.countryVN ? league.countryVN + separate : '';
        const iconCountry = league.countryIconVN ?? ( league.country ? league.country.countryLogo : null);
        return(
            <div className="group-match-item-slogan"
                onClick={event => this.handleClickLeague(event, league)}>
                <FavouriteLeagueIcon league={league} flagToggle={flagToggleIcon} onUpdateFavLeague={this.props.onUpdateFavLeague}/>
                <TeamIcon src={iconCountry} />
                <div className="livescore-name-team">
                    <span className="country-name">{countryName}</span>
                    <span className="round-name">{leagueName}</span>
                </div>
            </div>
        );
    }
}