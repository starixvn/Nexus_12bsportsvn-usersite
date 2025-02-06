import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs, Tab } from 'react-bootstrap';
import { ActionCreators } from '../actions';
import FavoriteLeagues from '@jsroot/components/FavoriteLeagues';
import FavoriteMatches from '@jsroot/components/FavoriteMatches';
import Breadscrum from '@jsroot/components/Breadscrum';
import SignalR from './SignalR';
import League from './League';
import MatchGrid from './match-grid/index';
import General from './general/Index';
import SeasonStandings from './standings/index';
import SkeletonLeague from './SkeletonLeague';
import SkeletonGrid from './match-grid/SkeletonGrid';
import withNavigation from '@jsroot/components/withNavigation';
import Site from '@jsroot/common/site';
import DateTimeService from '@jsroot/common/dateTimeService';
import CommonFunctions from '@jsroot/common/common-functions';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import _ from 'dayjs/locale/vi';
dayjs.extend(updateLocale);
dayjs.updateLocale('vi', {
    weekdays: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
});
dayjs.locale('vi');

export class AppContainer extends Component {
    constructor(props) {
        super(props);

        const tabs = ['tong-hop', 'lich-thi-dau', 'ket-qua', 'bang-xep-hang'];
        let selectedTab = window.getMatchByStageParams.selectedTab.toLowerCase(),
            selectedResultsTab = false,
            selectedStandingsTab = false,
            selectedFixtureTab = false;
        if (selectedTab.length === 0 || tabs.findIndex(tab => tab === selectedTab) === -1) {
            selectedTab = 'tong-hop';
        }

        switch (selectedTab) {
            case 'lich-thi-dau':
                selectedFixtureTab = true;
                break;
            case 'ket-qua':
                selectedResultsTab = true;
                break;
            case 'bang-xep-hang':
                selectedStandingsTab = true;
                break;
        }

        this.state = {
            selectedTab,
            selectedFixtureTab,
            selectedResultsTab,
            selectedStandingsTab,
            flagToggleFavLeagueIcon: false
        };
    }

    componentDidMount() {
        this.props.getFavLeagues();
        this.props.getLeagues();
        this.getMatches();
    }

    getMatches = () => {
        const params = {
            ...window.getMatchByStageParams,
            timezone: DateTimeService.getClientTimezone()
        };
        this.props.getMatchesBySeason(params);
    };

    handleSelectTab = key => {
        let { selectedFixtureTab, selectedResultsTab, selectedStandingsTab } = this.state;
        const { league, isCurrentSeason } = this.props;
        const leagueName = CommonFunctions.getLeagueName(league);
        switch (key) {
            case 'tong-hop':
                if (!selectedFixtureTab) {
                    selectedFixtureTab = true;
                }
                document.title = `Livescore ${leagueName} ${league.season?.year}`;
                document.head.querySelector('meta[name="description"]').content = `Cập nhật LTĐ, KQBD, link xem trực tiếp ${leagueName} ${league.season?.year} nhanh và chính xác nhất trên SABA VN.`;
                break;
            case 'lich-thi-dau':
                if (!selectedFixtureTab) {
                    selectedFixtureTab = true;
                }
                document.title = `Lịch thi đấu ${leagueName} ${league.season?.year} [Mới nhất]`;
                document.head.querySelector('meta[name="description"]').content = `Xem lịch thi đấu ${leagueName} ${league.season?.year} mới nhất trên SABA VN. LTĐ và xem trực tiếp các trận đấu ${leagueName} ${league.season?.year} được cập nhất liên tục cho độc giả`;
                break;
            case 'ket-qua':
                if (!selectedResultsTab) {
                    selectedResultsTab = true;
                }
                document.title = `KQBĐ trực tuyến ${leagueName} ${league.season?.year} [CẬP NHẬT]`;
                document.head.querySelector('meta[name="description"]').content = `Xem KQBĐ trực tuyến ${leagueName} ${league.season?.year} mới nhất. Cập nhật kết quả bóng đá và tỉ số trận đấu ${leagueName} ${league.season?.year} chính xác nhất trên SABA VN`;
                break;
            case 'bang-xep-hang':
                if (!selectedStandingsTab) {
                    selectedStandingsTab = true;
                }
                break;
        }

        this.setState({ selectedTab: key, selectedFixtureTab, selectedResultsTab, selectedStandingsTab });

        const params = window.getMatchByStageParams;
        const season = this.getSeasonParam(isCurrentSeason, params);
        const url = Site.resolveClientUrl(`lich-thi-dau/bong-da/${Site.toSlug(leagueName)}${season}/${params.leagueId}/${key}`);
        this.props.navigate(url);
    };

    getSeasonParam = (isCurrentSeason, params) => {
        if(isCurrentSeason) {
            return "";
        }
        if(params.seasonId !== 0) {
            return '/' + params.seasonId;
        }
        return `/${params.seasonId}/${params.date}`;
    };

    renderSkeletonGrid = (tab, match) => {
        return tab && match === null && <SkeletonGrid  />
    };

    renderTabs = () => {
        const { selectedTab, selectedFixtureTab, selectedResultsTab, selectedStandingsTab } = this.state;
        const { league, stages, preMatches, postMatches } = this.props;
        return (
            <Tabs activeKey={selectedTab} id="livescore-tab-league-detail"
                className="live-score-nav"
                onSelect={this.handleSelectTab}
            >
                <Tab eventKey="tong-hop" title="Tổng hợp">
                    {
                        this.renderSkeletonGrid(true, preMatches)
                    }
                    {
                        (preMatches !== null || postMatches !== null) &&
                        <General  league={league} stages={stages} preMatches={preMatches} postMatches={postMatches} handleSelectTab={this.handleSelectTab}/>
                    }
                </Tab>
                <Tab eventKey="lich-thi-dau" title="Lịch thi đấu">
                    {
                        this.renderSkeletonGrid(selectedFixtureTab, preMatches)
                    }
                    {
                        selectedFixtureTab && preMatches !== null && <MatchGrid sortAsc league={league} stages={stages} matches={preMatches} />
                    }
                </Tab>
                <Tab eventKey="ket-qua" title="Kết quả">
                    {
                        this.renderSkeletonGrid(selectedResultsTab, postMatches)
                    }
                    {
                        selectedResultsTab && postMatches !== null &&
                        <MatchGrid sortAsc={false} league={league} stages={stages} matches={postMatches} />
                    }
                </Tab>
                <Tab eventKey="bang-xep-hang" title="BXH" disabled={!league || !league.hasSeasonStandings}>
                    {
                        selectedStandingsTab &&
                        <SeasonStandings />
                    }
                </Tab>
            </Tabs>);
    };

    onUpdateFavLeague = () => {
        this.props.setFavLeagues(CommonFunctions.getFavLeagues());
    };

    onToggleFavLeaguesIcon = () => {
        this.setState({flagToggleFavLeagueIcon: !this.state.flagToggleFavLeagueIcon});
    };

    render() {
        const { favLeagues, league, leagues } = this.props;
        return (
            <div className="container livescore-container">
                <SignalR getMatches={this.getMatches} />
                <div className="livescore-soccer">
                    <div className="livescore-soccer-main">
                        {
                            league === null && <SkeletonLeague />
                        }
                        {
                            league !== null &&
                            <>
                                <Breadscrum currentPage={CommonFunctions.getLeagueName(league)} currentPageUrl={window.location.href} />
                                <League league={league} flagToggleFavLeagueIcon={this.state.flagToggleFavLeagueIcon} onUpdateFavLeague={this.onUpdateFavLeague}/>
                            </>
                        }
                        {this.renderTabs()}
                    </div>
                    <div className="livescore-soccer-extension">
                        <FavoriteMatches />
                        <FavoriteLeagues searchLeagues={leagues} leagues={favLeagues} onToggleIcon={this.onToggleFavLeaguesIcon}/>
                    </div>
                </div>
            </div>
        );
    }
}

const AppContainerWithNavigation = withNavigation(AppContainer);

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { favLeagues, league, stages, preMatches, postMatches, leagues, isCurrentSeason } = state;
    return { favLeagues, league, stages, preMatches, postMatches, leagues, isCurrentSeason };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainerWithNavigation);