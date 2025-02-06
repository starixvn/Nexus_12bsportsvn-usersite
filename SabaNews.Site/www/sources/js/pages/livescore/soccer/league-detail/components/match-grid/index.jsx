import React, { PureComponent } from 'react';
import { Form } from 'react-bootstrap';
import dayjs from 'dayjs';
import Grid from './Grid';
import DateTimeService from '@jsroot/common/dateTimeService';
import CommonFunctions from '@jsroot/common/common-functions';
import LangHelper from '@jsroot/common/langHelper';
import { LeagueType } from '@jsroot/common/constants';

export default class MatchGrid extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            searchKey: ''
        };
    }

    handleChangeSearchKey = event => {
        this.setState({ searchKey: event.target.value });
    };

    getRoundName = (round, type) => type === LeagueType.Cup ? `${LangHelper.getResource('Turn')} ${round}`
                                                            : `${LangHelper.getResource('Round')} ${round}`;

    groupMatchesByDate = matches => {
        const totalItems = matches.length;
        const tempMatches = [];
        for (let i = 0; i < totalItems; i++) {
            const match = matches[i];
            const startTime = DateTimeService.convertFromUTC(match.startTime);
            const key = DateTimeService.formatDateTime(startTime, 'YYYY-MM-DD');
            const item = {
                key,
                text: DateTimeService.formatDateTime(key, 'dddd, DD/MM/YYYY'),
                childs: [match]
            };
            if (tempMatches.length === 0) {
                tempMatches.push(item);
            } else {
                const index = tempMatches.findIndex(x => x.key === key);
                if (index === - 1) {
                    tempMatches.push(item);
                } else {
                    tempMatches[index].childs.push(match);
                }
            }
        }

        return tempMatches;
    };

    groupMatchesByStageAndRound = (matches, lastStage, lastRound) => {
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

    checkGroupLeagueType =  (stages, matches, league) => {
        return stages.length <= 1
            && matches.filter(item => item.round > 0).length === 0
            && league.leagueType === LeagueType.League;
    };

    checkGroupMatches = (stages, matches, league) => {
        return this.checkGroupLeagueType(stages, matches, league)
        || (stages.length === 0 && matches.filter(item => item.round > 0).length === 0)
        || league.leagueType === LeagueType.Friendly;
    };

    groupMatches = (stages, matches, league) => {
        if (this.checkGroupMatches(stages, matches, league)) {
            return this.groupMatchesByDate(matches);
        }

        const tempMatches = this.groupMatchesByStageAndRound(matches);

        const totalItems = tempMatches.length;
        const result = [];
        for (let i = 0; i < totalItems; i++) {
            const item = tempMatches[i];
            let text;
            if(!item.stage) {
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
                childs: this.groupMatchesByDate(item.matches)
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

    filterMatches = (matches, searchKey) => {
        return matches.filter(match =>
            CommonFunctions.getTeamName(match.homeTeam).toLowerCase().indexOf(searchKey.toLowerCase()) !== -1
            || CommonFunctions.getTeamName(match.awayTeam).toLowerCase().indexOf(searchKey.toLowerCase()) !== -1);
    };

    render() {
        let { league, stages, matches, sortAsc } = this.props;
        if (matches.length === 0) {
            return <div className="none-livescore">Đang cập nhật dữ liệu...</div>;
        }

        matches = this.sortMatches([...matches], sortAsc);
        const searchKey = this.state.searchKey;
        if (searchKey.length > 0) {
            matches = this.filterMatches(matches, searchKey);
        }

        matches = this.groupMatches(stages, matches, league);

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
                    matches.length === 0 && searchKey.length > 0
                    && <div className="none-livescore">Không tìm thấy đội bóng nào phù hợp.</div>
                }
                {
                    matches.length > 0 &&
                    <Grid league={league} matches={matches} searchKey={searchKey} />
                }
            </div>
        );
    }
}