import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import queryString from 'query-string';
import CommonFunctions from '@jsroot/common/common-functions';
import { Euro } from '../../euro-constants';
import Site from '@jsroot/common/site';

export class FunctionBar extends Component {
    componentDidMount() {
        const tabStatus = this.updateTabStatus();
        const defaultTab = this.getDefaultActiveKey(tabStatus);
        this.props.setActiveTab(defaultTab);
    }

    updateTabStatus = () => {
        const tabStatus = {
            enableTabSummary: true,
            enableTabStatistics: true,
            enableTabLineups: true,
            enableTabHeadtohead: true
        };
        const { generalInfo, incidents, lineup, headToHead, statistic } = this.props.match;
        tabStatus['enableTabLineups'] = this.checkEnableLineup(generalInfo, lineup);
        tabStatus['enableTabHeadtohead'] = this.checkEnableH2H(headToHead);
        tabStatus['enableTabStatistics'] = this.checkEnableStatistics(generalInfo, statistic);
        tabStatus['enableTabSummary'] = this.checkEnableIncident(generalInfo, incidents);
        return tabStatus;
    };

    checkEnableIncident = (generalInfo, incidents) => {
        let isEnable = true;
        if (!incidents || incidents.length === 0 || CommonFunctions.isPreMatch(generalInfo.status)) {
            isEnable = false;
        }
        return isEnable;
    };

    checkEnableStatistics = (generalInfo, statistic) => {
        let isEnable = true;
        if (!statistic || !statistic.homeStatistic || !statistic.awayStatistic || CommonFunctions.isPreMatch(generalInfo.status)) {
            isEnable = false;
        }
        return isEnable;
    };

    checkEnableLineup = (generalInfo, lineup) => {
        let isEnable = true;
        if (generalInfo.isLineUp === 0) {
            isEnable = false;
        }
        if (!lineup || !lineup.generalInfo || (lineup.home.length === 0 && lineup.away.length === 0 )) {
            isEnable = false;
        }
        return isEnable;
    };

    checkEnableH2H = headToHead => {
        let isEnable = true;
        if(!headToHead || headToHead.common.length === 0) {
            isEnable = false;
        }
        return isEnable;
    };

    getDefaultActiveKey = tabStatus => {
        const mapTabStatusKey = {
            'dien-bien': 'Summary',
            'thong-ke': 'Statistics',
            'doi-hinh': 'Lineups',
            'doi-dau': 'Headtohead'
        };
        let defaultTab = '';
        const params = queryString.parse(window.location.search);
        if(params['tab']) {
            defaultTab = params['tab'].toLowerCase();
        }

        if(!defaultTab || (defaultTab && !tabStatus[`enableTab${mapTabStatusKey[defaultTab]}`])) {
            defaultTab = '';
            if(tabStatus.enableTabHeadtohead) {
                defaultTab = 'doi-dau';
            }
            if(tabStatus.enableTabLineups) {
                defaultTab = 'doi-hinh';
            }
            if(tabStatus.enableTabStatistics) {
                defaultTab = 'thong-ke';
            }
            if(tabStatus.enableTabSummary) {
                defaultTab = 'dien-bien';
            }
        }
        return defaultTab;
    };

    scrollToTab = tab =>  {
        const section = document.getElementById(tab);
        if (section) {
            const { match } = this.props;
            const isMobile = window.innerWidth < 768;
            const generalHeight = document.querySelector('.detail-fixed').offsetHeight;
            const headerHeight = document.querySelector('.header').offsetHeight;
            const tmpHeight = isMobile ? headerHeight + document.querySelector('.block-line-up-title').offsetHeight : 0;
            window.scroll({
                top: section.offsetTop - generalHeight + tmpHeight,
                left: 0,
                behavior: 'smooth'
            });
            this.props.setActiveTab(tab);
            const { matchId, league, homeTeam, awayTeam } = match.generalInfo;
            const homeTeamName = Site.toSlug(CommonFunctions.getTeamName(homeTeam));
            const awayTeamName = Site.toSlug(CommonFunctions.getTeamName(awayTeam));
            const path = Euro.MatchDetailUrl;
            let url = Site.resolveClientUrl(`${path}/${homeTeamName}-vs-${awayTeamName}/${matchId}`);
            url = `${url}/?tab=${tab}`;
        }
    };

    checkTabEnable = tabStatus => {
        return tabStatus.enableTabSummary
            || tabStatus.enableTabStatistics
            || tabStatus.enableTabLineups
            || tabStatus.enableTabHeadtohead;
    };

    getActiveTabClass = (activeTab, tab) =>  activeTab === tab ? 'active' : '';


    render() {
        const tabStatus = this.updateTabStatus();
        const { activeTab } = this.props;
        const isTabEnable = this.checkTabEnable(tabStatus);
        return (
            <Fragment>
                <div className="team-menu-tabs">
                    <ul className="nav-team">
                        <li onClick={() => this.scrollToTab('dien-bien')} className={`${this.getActiveTabClass(activeTab, 'dien-bien')} ${!tabStatus.enableTabSummary ? 'disabled' : 'nav-team-item'}`}>
                            Diễn biến
                        </li>
                        <li onClick={() => this.scrollToTab('thong-ke')} className={`${this.getActiveTabClass(activeTab, 'thong-ke')} ${!tabStatus.enableTabStatistics ? 'disabled' : 'nav-team-item'}`}>
                            Thống kê
                        </li>
                        <li onClick={() => this.scrollToTab('doi-hinh')} className={`${this.getActiveTabClass(activeTab, 'doi-hinh')} ${!tabStatus.enableTabLineups ? 'disabled' : 'nav-team-item'}`}>
                            Đội hình
                        </li>
                    </ul>
                </div>
                {
                    !isTabEnable &&
                    <div className="none-livescore">Đang cập nhật dữ liệu...</div>
                }
            </Fragment>
        );
    }
}


const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { match, activeTab } = state;
    return { match, activeTab };
};

export default connect(mapStateToProps, mapDispatchToProps)(FunctionBar);