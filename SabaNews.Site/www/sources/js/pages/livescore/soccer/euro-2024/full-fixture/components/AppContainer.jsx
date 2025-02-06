import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import Grid from './Grid';
import DateTimeService from '@jsroot/common/dateTimeService';
import { MatchStatus } from '@jsroot/common/constants';
import SignalR from './SignalR';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import _ from 'dayjs/locale/vi';
import SkeletonGrid from './SkeletonGird';
dayjs.extend(updateLocale);
dayjs.updateLocale('vi', {
    weekdays: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
});
dayjs.locale('vi');
export class AppContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getMatches();
    }
    componentDidUpdate() {
        const currentFixture = document.querySelector('.current');
        const ScrollToHeight = currentFixture != null ? currentFixture.offsetTop : 0;
        
        if(ScrollToHeight > 0) {
            const isMobile = window.innerWidth < 768;
            const anotherHeight = isMobile ? 52 : 86;
            window.scroll({
                top: ScrollToHeight - anotherHeight,
                left: 0,
                behavior: 'smooth'
            });
        }
    }

    groupMatchesByDate = matches => {
        const totalItems = matches.length;
        const tmpMatches = [];
        for (let i = 0; i < totalItems; i++) {
            const tmpMatch = matches[i];
            const startTime = DateTimeService.convertFromUTC(tmpMatch.startTime);
            const key = DateTimeService.formatDateTime(startTime, 'YYYY-MM-DD');
            const item = {
                key,
                text: DateTimeService.formatDateTime(key, 'dddd, DD/MM/YYYY'),
                childs: [tmpMatch]
            };
            if (tmpMatches.length === 0) {
                tmpMatches.push(item);
            } else {
                const index = tmpMatches.findIndex(x => x.key === key);
                if (index === - 1) {
                    tmpMatches.push(item);
                } else {
                    tmpMatches[index].childs.push(tmpMatch);
                }
            }
        }

        return tmpMatches;
    };

    groupMatchesByStage = (matches, league) => {
        let totalItems = matches.length;
        const tempMatches = [];
        for (let i = 0; i < totalItems; i++) {
            const match = { ...matches[i], league };
            const stage = match.stage;
            const key = stage ? stage.stageId : 0;
            const item = {
                key,
                stage,
                matches: [match]
            };

            if (tempMatches.length === 0) {
                tempMatches.push(item);
            } else {
                const index = tempMatches.findIndex(x => x.key === key);
                if (index === -1) {
                    tempMatches.push(item);
                } else {
                    tempMatches[index].matches.push(match);
                }
            }
        }

        tempMatches.forEach((item, index) => {
            let isFinished = false;
            const stageMatches = item.matches;
            const lastMatch = stageMatches[stageMatches.length - 1];
            if(lastMatch.status === MatchStatus.Finished) {
                isFinished = true;
            }
            tempMatches[index] = {...item, isFinished};
        });

        totalItems = tempMatches.length;
        const result = [];
        for (let i = 0; i < totalItems; i++) {
            const item = tempMatches[i];
            result.push({
                key: item.key,
                stage: item.stage,
                isFinished: item.isFinished,
                childs: this.groupMatchesByDate(item.matches)
            });
        }
        return result;
    };

    render() {
        const { league, matches } = this.props;
        if(!matches || matches.length === 0) {
            return <SkeletonGrid />;
        }
        const stages = this.groupMatchesByStage(matches, league);
        return (
            <div className="container">
                <SignalR  />
                <div className="livescore-soccer-main" >
                    <Grid stages={stages}/>
                </div>
            </div>
        );
    }

}


const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { matches, league } = state;
    return { matches, league };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);