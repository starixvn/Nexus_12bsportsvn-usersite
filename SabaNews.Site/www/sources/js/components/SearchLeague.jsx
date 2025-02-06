import React, { PureComponent } from 'react';
import { Modal } from 'react-bootstrap';
import CommonFunctions from '@jsroot/common/common-functions';
import TeamIcon from '@jsroot/components/Icon/TeamIcon';
import FavouriteLeagueIcon from '@jsroot/components/Icon/FavouriteLeagueIcon';
import Site from '@jsroot/common/site';
import LangHelper from '@jsroot/common/langHelper';

export default class SearchLeague extends PureComponent {
    constructor(props) {
        super(props);
        this.searchInput = React.createRef();
        this.state = {
            searchKey: '',
            leagues: [],
            favLeagues: [],
            toggleIcon: false
        };
    }

    handleChange = event => {
        const searchKey = event.target.value;
        this.debounceSearchKeyInputChange(searchKey);
    };

    resetSearchBox = () => {
        this.searchInput.value = '';
        this.setState({
            searchKey: '',
            leagues: [],
            toggleIcon: !this.state.toggleIcon
        });
    };

    checkSearchLeague = (fieldName, searchKey) =>  fieldName && (fieldName.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1);

    debounceSearchKeyInputChange = Site.debounce(searchKey => {
        this.setState({
            searchKey: searchKey
        }, () => {
            if (searchKey.length > 2) {
                const searchLeagues = this.props.searchLeagues;
                let result = [];
                result = searchLeagues.filter(item =>
                    this.checkSearchLeague(item.leagueNameEN, searchKey)
                    || this.checkSearchLeague(item.leagueFullNameEN, searchKey)
                    || this.checkSearchLeague(item.leagueNameVN, searchKey));
                this.setState({ leagues: result, toggleIcon: !this.state.toggleIcon });
            } else if (searchKey.length === 0) {
                this.setState({ leagues: [], toggleIcon: !this.state.toggleIcon });
            }
        });
    });

    handleClose = () => {
        this.props.onClose();
        this.setState({ searchKey: '', leagues: [], favLeagues: [] });
    };

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

    isDefault = () => {
        const { searchKey, leagues } = this.state;
        return searchKey.length < 3 && leagues.length === 0;
    };

    onUpdateFavLeague = league => {
        const { favLeagues } = this.state;
        const currentFavLeagues = CommonFunctions.getFavLeagues();
        const leagueIndex = currentFavLeagues.findIndex(item => item.leagueId === league.leagueId);
        const isFavourite = leagueIndex >= 0;
        if (isFavourite) {
            const index = favLeagues.findIndex(item => item.leagueId === league.leagueId);
            if (index < 0) {
                favLeagues.unshift(league);
            }
        }
        this.setState({ favLeagues: favLeagues, toggleIcon: !this.state.toggleIcon });
        this.props.onUpdateFavLeague();
    };

    getMajorLeagues = () => {
        const searchLeagues = this.props.searchLeagues;
        const leagues = searchLeagues ? searchLeagues.filter(item => item.priority !== 0) : [];
        return leagues;
    };

    renderLeagues = (leagues, title) => {
        if (leagues.length === 0) {
            return null;
        }
        const { searchKey, toggleIcon } = this.state;
        return (
            <>
                {
                    title !== null && <div className="search-league-title">{title}</div>
                }
                {
                    leagues.map((league, index) => {
                        const reg = new RegExp(`(${searchKey})`, 'gi');
                        const leagueName = CommonFunctions.getLeagueName(league)
                            .replace(reg, "<span class='text-matched'>$1</span>");
                        return (
                            <div key={index} className="leagues-item" onClick={event => this.handleClick(event, league)}>
                                <div className="leagues-name">
                                    <TeamIcon className="logo" src={CommonFunctions.getLeagueIcon(league)} />
                                    <span className="text" dangerouslySetInnerHTML={{ __html: leagueName }} />
                                </div>
                                <div className="toggle-league">
                                    <FavouriteLeagueIcon league={league} onUpdateFavLeague={() => this.onUpdateFavLeague(league)} flagToggle={toggleIcon} />
                                </div>
                            </div>
                        );
                    })
                }
            </>
        );
    };

    render() {
        const { isShowSearchPopup } = this.props;
        const { searchKey, leagues, favLeagues } = this.state;
        const isDefault = this.isDefault();
        const majorLeagues = this.getMajorLeagues();
        return (
            <Modal className="modal-livescore" size="sm" show={isShowSearchPopup} onHide={this.handleClose}>
                <Modal.Header>
                    <Modal.Title>{LangHelper.getResource('AddLeague')}</Modal.Title>
                    <i className="icon-livescore icon-close" onClick={this.handleClose} />
                </Modal.Header>
                <Modal.Body>
                    <div className="livescore-soccer-search-bar">
                        <input type="text" placeholder="tìm kiếm giải đấu..."
                            className="livescore-soccer-searchbox form-control"
                            onChange={this.handleChange}
                            ref={input => this.searchInput = input}
                        />
                        <span className="btn-search-match"><i className="icon-livescore icon-search"></i></span>
                        {
                            searchKey.length > 0 &&
                            <span className="btn-close-match" onClick={this.resetSearchBox}><i className="icon-livescore icon-close"></i></span>
                        }
                    </div>
                    <div className={`modal-data ${this.state.leagues.length ? 'spacing-top' : ''}`}>
                        {
                            <div className="livescore-soccer-extension">
                                {
                                    isDefault &&
                                    <>
                                        {this.renderLeagues(favLeagues, LangHelper.getResource('RecentLeague'))}
                                        {this.renderLeagues(majorLeagues, LangHelper.getResource('MajorLeague'))}
                                    </>
                                }
                                {
                                    !isDefault &&
                                    this.renderLeagues(leagues)
                                }
                            </div>
                        }
                        {
                            this.state.leagues.length === 0 && searchKey.length >= 3 &&
                            <p className="not-found">{LangHelper.getResource('NotFoundLeague')}</p>
                        }
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}