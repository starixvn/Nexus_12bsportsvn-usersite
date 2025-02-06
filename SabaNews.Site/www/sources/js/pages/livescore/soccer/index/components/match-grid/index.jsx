import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import dayjs from 'dayjs';
import SearchBar from '../SearchBar';
import Grid from './Grid';
import { ActionCreators } from '../../actions';
import CommonFunctions from '@jsroot/common/common-functions';
import { LeagueType, MatchStatus } from '@jsroot/common/constants';

export class MatchGrid extends PureComponent {
    filterMatches = (matches, searchKey) => {
        if (searchKey.length > 0) {
            return matches.filter(match => CommonFunctions.getLeagueName(match.league).toLowerCase().indexOf(searchKey.toLowerCase()) !== -1
                || CommonFunctions.getTeamName(match.homeTeam).toLowerCase().indexOf(searchKey.toLowerCase()) !== -1
                || CommonFunctions.getTeamName(match.awayTeam).toLowerCase().indexOf(searchKey.toLowerCase()) !== -1);
        } else {
            return matches;
        }
    };
    getGroupKey = league => {
        let stage = 0;
        let season = 0;
        if(league.leagueType !== LeagueType.League && league.leagueType !== LeagueType.Friendly && league.stage) {
            stage = league.stage.stageId;
        }
        if(league.leagueType !== LeagueType.League && league.leagueType !== LeagueType.Friendly && league.season) {
            season = league.season.seasonId;
        }
        return `${league.leagueId}-${season}-${stage}`;
    };

    groupMatchesByStage = matches => {
        const totalItems = matches.length;
        const tempMatches = [];
        for (let i = 0; i < totalItems; i++) {
            const match = matches[i];
            const league = match.league;
            const key = this.getGroupKey(league);
            const item = {
                key,
                ...league,
                matches: [match]
            };
            if (tempMatches.length === 0) {
                tempMatches.push(item);
            } else {
                const index = tempMatches.findIndex(x => x.key === key);
                if (index === - 1) {
                    tempMatches.push(item);
                } else {
                    tempMatches[index].matches.push(match);
                }
            }
        }

        return tempMatches;
    };

    groupLeagues = matches => {
        const tmpMatches = this.groupMatchesByStage(matches);
        let tmpLeagues = [];
        let favLeagues = CommonFunctions.getFavLeagues();
        favLeagues = favLeagues.sort((item1, item2) => (item2.order - item1.order));
        const favLeagueIds = favLeagues.map(item => item.leagueId);
        const outfavLeagues = tmpMatches.filter(item => !favLeagueIds.includes(item.leagueId));
        favLeagueIds.map(leagueId => {
            const infavLeagues = tmpMatches.filter(item => item.leagueId === leagueId);
            infavLeagues.forEach(item => tmpLeagues.push(item) );
        });
        tmpLeagues = [...tmpLeagues, ...outfavLeagues];
        return tmpLeagues;
    };

    checkPreMatch = status => {
        return status === MatchStatus.Postpone
                || status === MatchStatus.Cancel
                || status === MatchStatus.TBD
                || status === MatchStatus.Delay;
    };

    checkPostMatch = status => {
        return status === MatchStatus.Finished || status === MatchStatus.CutInHalf;
    }

    render() {
        let { matches, selectedDate, today, searchKey, banner } = this.props;
        if (dayjs(selectedDate).isBefore(today) && !window.isLivePage) {
            matches = matches.filter(match =>
                this.checkPostMatch(match.status)
                || this.checkPreMatch(match.status)
                || CommonFunctions.isLiveMatch(match.status));
        }

        let totalMatches = matches.length;
        if (totalMatches === 0) {
            return <div className="none-livescore">
                { !window.isLivePage ? 'Không có trận đấu nào.' : 'Hiện tại không có trận đấu trực tiếp nào.' }
            </div>;
        }

        matches = this.filterMatches(matches, searchKey);
        totalMatches = matches.length;

        const leagues = this.groupLeagues(matches);
        return (
            <>
                <SearchBar />
                {
                    totalMatches === 0 && searchKey.length > 0 &&
                    <div className="none-livescore">Không tìm thấy giải đấu hoặc trận đấu nào phù hợp.</div>
                }
                {
                    totalMatches > 0 &&
                    <Grid leagues={leagues} banner={banner}/>
                }
            </>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { selectedDate, today, searchKey, banner } = state;
    return { selectedDate, today, searchKey, banner };
};

export default connect(mapStateToProps, mapDispatchToProps)(MatchGrid);