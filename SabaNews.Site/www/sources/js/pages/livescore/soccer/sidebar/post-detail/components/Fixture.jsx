import React, { PureComponent } from 'react';
import SkeletonGrid from '../../match-grid/SkeletonGrid';
import Grid from './Grid';

export default class Fixture extends PureComponent {
    constructor(props) {
        super(props);
    }


    handleClickFixture = event => {
        const url = this.props.url;
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };



    groupMatches = matches => {
        const tempMatches = [];
        if (matches === null) {
            return tempMatches;
        }
        const totalItems = matches.length;
        for (let i = 0; i < totalItems; i++) {
            const match = matches[i];
            const league = match.league;
            const key = league.leagueId;
            const item = {
                key,
                league: league,
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


    render() {
        const { title , isLiveTitle , data } = this.props;
        const group = this.groupMatches(data);
        return (
            <div className="livescore-post-detail">
                <h3 className="block__title"><a onClick={this.handleClickFixture}>{title}</a></h3>
                {
                    data === null && <SkeletonGrid />
                }
                {
                    <div className="livescore-soccer-main">
                    {
                        data !== null && data?.length > 0 ? 
                        group.map(item => {
                            return <Grid key={item.key} league={item.league} matches={item.matches} />
                        }) : <p className="none-data">{ isLiveTitle ? "Không có trận đấu nào đang diễn ra" : "Không có trận đấu nào diễn ra ngày hôm nay"}</p>
                    }
                </div>
                }
            </div>
        )
    }
}