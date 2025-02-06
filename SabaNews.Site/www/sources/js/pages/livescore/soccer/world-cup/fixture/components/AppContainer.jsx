import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import Grid from './Grid';
import SkeletonGrid from './SkeletonGrid';
import SignalR from './SignalR';
import DateTimeService from '@jsroot/common/dateTimeService';
import { WorldCup, Width1024, MatchStatus } from '@jsroot/common/constants';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

export class AppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobile: window.innerWidth <= Width1024 ? true : false
        };
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

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.props.getMatches();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    checkIsFinished = league => {
        const today = dayjs(DateTimeService.getCurrentClientDateTime()).format('YYYY-MM-DD HH:mm:ss');
        const endTime = dayjs(DateTimeService.convertFromUTC(league.season.endTime)).format('YYYY-MM-DD HH:mm:ss');
        return dayjs(today).isSameOrAfter(endTime);
    };

    getMatches = () => {
        const { league, matches } = this.props;
        if (!matches || matches.length === 0) {
            return {matches: null};
        }
        let tmpMatches = matches;
        let isFinished = false;
        const finalMatches = tmpMatches[tmpMatches.length - 1];
        const EightTeamMatches = matches.filter(item => item.stage.stageId === WorldCup.EightTeamStage);
        const lastEightTeamMatch = EightTeamMatches[EightTeamMatches.length - 1];
        if (this.checkIsFinished(league) || finalMatches.status !== MatchStatus.NotStarted) {
            tmpMatches = [...matches].reverse();
            isFinished = true;
        } else if (league.currentStageId < WorldCup.QuarterfinalsStage && lastEightTeamMatch.status !== MatchStatus.Finished) {
            tmpMatches = matches.filter(item => item.stage?.stageId < WorldCup.QuarterfinalsStage);
        } else if (lastEightTeamMatch.status === MatchStatus.Finished || league.currentStageId >= WorldCup.QuarterfinalsStage) {
            tmpMatches = matches.filter(item => item.stage.stageId !== WorldCup.GroupsStage);
        }
        return {matches: tmpMatches, isFinished: isFinished};
    };

    render() {
        const { league, matches } = this.props;
        const { isMobile } = this.state;
        const matchGrid = this.getMatches();
        return (
            <div>
                <SignalR />
                {
                    matches === null &&
                    <SkeletonGrid isMobile={isMobile} />
                }
                {
                    matchGrid.matches && matchGrid.matches.length > 0 &&
                    <Grid isMobile={isMobile} matches={matchGrid.matches} league={league} isFinished={matchGrid.isFinished} />
                }
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