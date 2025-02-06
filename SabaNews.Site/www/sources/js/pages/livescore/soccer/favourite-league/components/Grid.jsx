import React, { PureComponent } from 'react';
import CommonFunctions from '@jsroot/common/common-functions';
import Site from '@jsroot/common/site';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import Item from './Item';
import DragItem from './DragItem';

export class Grid extends PureComponent {
    constructor(props) {
        super(props);
        this.searchInput = React.createRef();
        this.state = {
            searchKey: '',
            searchLeagues: []
        };
    }
    handleChange = event => {
        const searchKey = event.target.value;
        this.debounceSearchKeyInputChange(searchKey);
    };

    debounceSearchKeyInputChange = Site.debounce(searchKey => {
        this.setState({
            searchKey: searchKey
        }, () => {
            if (searchKey.length > 2) {
                const leagues = this.props.leagues;
                let result = [];
                result = leagues.filter(item =>
                    this.checkSearchLeague(item.leagueNameEN, searchKey)
                    || this.checkSearchLeague(item.leagueFullNameEN, searchKey)
                    || this.checkSearchLeague(item.leagueNameVN, searchKey));
                this.setState({ searchLeagues: result });
            } else if (searchKey.length === 0) {
                this.setState({ searchLeagues: [] });
            }
        });
    });

    resetSearchBox = () => {
        this.searchInput.value = '';
        this.setState({ searchKey: '', searchLeagues: []});
    };

    checkSearchLeague = (fieldName, searchKey) => fieldName && (fieldName.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1);

    onUpdateFavLeague = league => {
        const favLeagues = [...this.props.favLeagues];
        const currentFavLeagues = CommonFunctions.getFavLeagues();
        const favLeague = currentFavLeagues.find(item => item.leagueId === league.leagueId);
        if (favLeague) {
            const index = favLeagues.findIndex(item => item.leagueId === league.leagueId);
            if (index < 0) {
                favLeagues.unshift(favLeague);
            }
        }
        this.props.setFavLeagues(favLeagues);
    };

    isDefault = () => {
        const { searchKey, searchLeagues } = this.state;
        return searchKey.length < 3 && searchLeagues.length === 0;
    };

    sortLeagues = leagues => {
        if (!leagues) {
            return leagues;
        }
        const items = [...leagues];
        return items.sort((item1, item2) => (item2.order - item1.order));
    };

    onDrag = league => {
        this.props.setFavLeagues(league);
    };
    render() {
        const { searchKey, searchLeagues } = this.state;
        const isDefault = this.isDefault();
        const favLeagues = this.sortLeagues(this.props.favLeagues);
        return (
            <>
                <div className='group-searchbar'>
                    <div className="livescore-soccer-search-bar">
                        <input
                            type="text"
                            placeholder="tìm kiếm giải đấu..."
                            className="livescore-soccer-searchbox form-control"
                            onChange={this.handleChange}
                            ref={input => this.searchInput = input}
                        />
                        <span className="btn-search-match">
                            <i className="icon-livescore icon-search"></i>
                        </span>
                        {
                            searchKey.length > 0 && <span className="btn-close-match" onClick={this.resetSearchBox}><i className="icon-livescore icon-close"></i></span>
                        }
                    </div>
                </div>

                <div className="drop-and-drag-league">
                    {
                        isDefault && favLeagues !== null &&
                        <DragItem leagues={favLeagues} onUpdateFavLeague={this.onUpdateFavLeague} onDrag={this.onDrag} />
                    }
                    {
                        !isDefault &&
                        <Item leagues={searchLeagues} searchKey={searchKey} onUpdateFavLeague={this.onUpdateFavLeague} />
                    }
                </div>
            </>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { leagues, favLeagues } = state;
    return { leagues, favLeagues };
};

export default connect(mapStateToProps, mapDispatchToProps)(Grid);