import React, { PureComponent } from 'react';
import { Form } from 'react-bootstrap';
import dayjs from 'dayjs';
import DateTimeService from '@jsroot/common/dateTimeService';
import CommonFunctions from '@jsroot/common/common-functions';
import LangHelper from '@jsroot/common/langHelper';
import { LeagueType } from '@jsroot/common/constants';
import Item from '../match-grid/Item';
import Standing from './Standing';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default class General extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            searchKey: ''
        };
    }

    checkGroupLeagueType = (stages, matches, league) => {
        return stages.length <= 1
            && matches.filter(item => item.round > 0).length === 0
            && league.leagueType === LeagueType.League;
    };

    isGroupByDate = (stages, matches, league) => {
        return this.checkGroupLeagueType(stages, matches, league)
            || (stages.length === 0 && matches.filter(item => item.round > 0).length === 0)
            || league.leagueType === LeagueType.Friendly;
    };

    getRoundName = (round, type) => type === LeagueType.Cup ? `${LangHelper.getResource('Turn')} ${round}`
        : `${LangHelper.getResource('Round')} ${round}`;

    groupMatchesByStageAndRound = matches => {
        const totalItems = matches.length;
        const tempMatches = [];
        for (let i = 0; i < totalItems; i++) {
            const match = matches[i];
            const stage = match.stage;
            const stageId = stage ? stage.stageId : 0;
            const round = match.round ? match.round : 0;
            const item = {
                stageId, stage, round,
                matches: [match]
            };

            if (tempMatches.length === 0) {
                tempMatches.push(item);
            } else {
                const lastItem = tempMatches[tempMatches.length - 1];
                if (stageId === lastItem.stageId && round === lastItem.round) {
                    tempMatches[tempMatches.length - 1].matches.push(match);
                } else {
                    tempMatches.push(item);
                }
            }
        }

        return tempMatches;
    };

    groupMatches = matches => {
        const { stages, league } = this.props;
        if (this.isGroupByDate(stages, matches, league)) {
            return CommonFunctions.groupMatchesByDate(matches);
        }

        const tempMatches = this.groupMatchesByStageAndRound(matches);

        const totalItems = tempMatches.length;
        const result = [];
        for (let i = 0; i < totalItems; i++) {
            const item = tempMatches[i];
            let text;
            if (!item.stage) {
                text = '';
            } else if (item.round > 0 && item.stage.roundCount > 1 && league.leagueType === LeagueType.Cup) {
                text = `${CommonFunctions.getStageName(item.stage)} - ${this.getRoundName(item.round, league.leagueType)}`;
            } else if (item.round > 0 && item.stage.roundCount > 1 && league.leagueType !== 2) {
                text = this.getRoundName(item.round, league.leagueType);
            } else {
                text = CommonFunctions.getStageName(item.stage);
            }

            result.push({
                key: i,
                text,
                childs: CommonFunctions.groupMatchesByDate(item.matches)
            });
        }

        return result;
    };

    sortMatches = (matches, sortAsc) => {
        if (sortAsc) {
            return matches.sort((item1, item2) => dayjs(item1.startTime).diff(dayjs(item2.startTime)));
        } else {
            return matches.sort((item1, item2) => dayjs(item2.startTime).diff(dayjs(item1.startTime)));
        }
    };

    searchMatches = (matches, searchKey) => {
        return matches.filter(match =>
            CommonFunctions.getTeamName(match.homeTeam).toLowerCase().indexOf(searchKey.toLowerCase()) !== -1
            || CommonFunctions.getTeamName(match.awayTeam).toLowerCase().indexOf(searchKey.toLowerCase()) !== -1);
    };

    filterRoundAndStage = (matches, stage, round) => {
        const tmpMatches = [];
        matches.forEach(match => {
            const matchStage = match.stage;
            const matchStageId = matchStage ? matchStage.stageId : 0;
            const matchRound = match.round ? match.round : 0;
            if (matchStageId === stage && matchRound === round) {
                tmpMatches.push(match);
            }
        });
        return tmpMatches;
    };

    filterPostMatches = matches => {
        const { stages, league } = this.props
        let postMatches = [];
        if (matches.length === 0) {
            return postMatches;
        }
        matches = this.sortMatches([...matches], false);
        if (this.isGroupByDate(stages, matches, league)) {
            const lastWeek = dayjs(DateTimeService.getCurrentClientDateTime()).subtract(1, "day").format('YYYY-MM-DD');
            postMatches = matches.filter(item => dayjs(dayjs(DateTimeService.convertFromUTC(item.startTime)).format('YYYY-MM-DD')).isSameOrAfter(lastWeek));
        } else {
            const match = matches[0];
            const lastRound = match.round ? match.round : 0;
            const lastStage = match.stage ? match.stage.stageId : 0;
            postMatches = this.filterRoundAndStage(matches, lastStage, lastRound);
        }
        const today = dayjs(DateTimeService.getCurrentClientDateTime()).format('YYYY-MM-DD');
        postMatches = postMatches.filter(item => dayjs(dayjs(DateTimeService.convertFromUTC(item.startTime)).format('YYYY-MM-DD')).isBefore(today));
        postMatches = this.groupMatches(postMatches);
        return postMatches;
    };

    filterPreMatches = matches => {
        const { stages, league } = this.props
        let postMatches = [];
        if (matches.length === 0) {
            return postMatches;
        }
        matches = this.sortMatches([...matches], true);
        if (this.isGroupByDate(stages, matches, league)) {
            const lastWeek = dayjs(DateTimeService.getCurrentClientDateTime()).add(1, "day").format('YYYY-MM-DD');
            postMatches = matches.filter(item => dayjs(dayjs(DateTimeService.convertFromUTC(item.startTime)).format('YYYY-MM-DD')).isSameOrBefore(lastWeek));
        } else {
            const match = matches[0];
            const lastRound = match.round ? match.round : 0;
            const lastStage = match.stage ? match.stage.stageId : 0;
            postMatches = this.filterRoundAndStage(matches, lastStage, lastRound);
        }
        const today = dayjs(DateTimeService.getCurrentClientDateTime()).format('YYYY-MM-DD');
        postMatches = postMatches.filter(item => dayjs(dayjs(DateTimeService.convertFromUTC(item.startTime)).format('YYYY-MM-DD')).isAfter(today));
        postMatches = this.groupMatches(postMatches);
        return postMatches;
    };


    filterTodayMatches = (preMatches, postMatches) => {
        let todayMatches = [];
        const today = dayjs(DateTimeService.getCurrentClientDateTime()).format('YYYY-MM-DD');
        preMatches.forEach(item => {
            const startTime = dayjs(DateTimeService.convertFromUTC(item.startTime)).format('YYYY-MM-DD');
            if (dayjs(startTime).isSame(today)) {
                todayMatches.push(item);
            }
        });
        postMatches.forEach(item => {
            const startTime = dayjs(DateTimeService.convertFromUTC(item.startTime)).format('YYYY-MM-DD');
            if (dayjs(startTime).isSame(today)) {
                todayMatches.push(item);
            }
        });
        todayMatches = this.sortMatches(todayMatches, true);
        todayMatches = this.groupMatches(todayMatches);
        return todayMatches;
    };

    handleChangeSearchKey = event => {
        this.setState({ searchKey: event.target.value });
    };

    handleViewMore = key => {
        window.scrollTo({ top: 0 });
        this.props.handleSelectTab(key);
    };

    renderGrid = (matches, tab) => {
        const { league } = this.props;
        const { searchKey } = this.state;
        return (
            <div>
                {
                    matches.map((item, index) => {
                        return (
                            <div className="soccer-match-grid" key={item.key}>
                                <div className="soccer-match-grid-item">
                                    <div className="soccer-match-grid-item-header">{item.text}</div>
                                    <div className="soccer-match-grid-item-body">
                                        {
                                            item.childs.map(child => <Item key={child.key} searchKey={searchKey} league={league} child={child} />)
                                        }
                                        {
                                            tab && index === (matches.length - 1) &&
                                            <p className="view-more-general-league" onClick={() => this.handleViewMore(tab)}><span>Hiển thị thêm</span> <i className="icon-chevron-down"></i></p>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )

    }


    render() {
        let { league, preMatches, postMatches } = this.props;
        const { searchKey } = this.state;
        if (preMatches.length === 0 && postMatches.length === 0) {
            return <div className="none-livescore">Đang cập nhật dữ liệu...</div>;
        }
        if (searchKey.length > 0) {
            preMatches = this.searchMatches(preMatches, searchKey);
            postMatches = this.searchMatches(postMatches, searchKey);
        }
        const todayMatches = this.filterTodayMatches(preMatches, postMatches);
        const listPostMatches = this.filterPostMatches(postMatches);
        const listPreMatches = this.filterPreMatches(preMatches);
        return (
            <div className="league-story">
                <div className="group-searchbar">
                    <div className="livescore-soccer-search-bar">
                        <Form.Control type="text" placeholder="Tìm kiếm đội bóng..."
                            id="livescore-soccer-searchbox" className="livescore-soccer-searchbox"
                            value={searchKey}
                            onChange={this.handleChangeSearchKey}
                        />
                        <span className="btn-search-match"><i className="icon-livescore icon-search" /></span>
                    </div>
                </div>
                {
                    todayMatches.length > 0 &&
                    <>
                        <div className="heading-general-league">{LangHelper.getResource('TodayMatches')}</div>
                        {this.renderGrid(todayMatches)}
                    </>
                }
                {
                    listPostMatches.length > 0 &&
                    <div className="post-match-grid">
                        <div className="heading-general-league">{LangHelper.getResource('LastestScore')}</div>
                        {this.renderGrid(listPostMatches, 'ket-qua')}
                    </div>
                }
                {
                    listPreMatches.length > 0 &&
                    <div className="pre-match-grid">
                        <div className="heading-general-league">{LangHelper.getResource('Upcomming')}</div>
                        {this.renderGrid(listPreMatches, 'lich-thi-dau')}
                    </div>
                }
                {
                    league.hasSeasonStandings &&
                    <div className="standing-grid">
                        <Standing />
                        <p className="view-more-general-league" onClick={() => this.handleViewMore('bang-xep-hang')}><span>Hiển thị thêm</span> <i className="icon-chevron-down"></i></p>
                    </div>
                }
            </div>
        );
    }
}