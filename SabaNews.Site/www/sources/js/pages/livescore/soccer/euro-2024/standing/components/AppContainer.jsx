import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import { Width1024, MatchStatus } from '@jsroot/common/constants';
import { Euro } from '../../euro-constants';
import Grid from './Grid';
import Item from './Item';
import Site from '@jsroot/common/site';
import LangHelper from '@jsroot/common/langHelper';

export class AppContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMobile: window.innerWidth <= Width1024 ? true : false
        };
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    componentDidMount() {
        this.props.getMatches();
        window.addEventListener('resize', this.handleResize);
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

    getPlayoffStages = () => {
        const { stages } = this.props;
        const playoffStages = stages.filter(item =>
            item.stageId >= Euro.EightTeamStage &&
            !item.stageNameEN.toLowerCase().includes('place')
        );
        return playoffStages;
    };

    groupMatchByStage = () => {
        const { matches, league } = this.props;
        const playoffStages = this.getPlayoffStages();
        let tempMatches = [];
        matches.map(value => {
            const match = { ...value, league };
            const stage = match.stage;
            const stageIndex = playoffStages.findIndex(item => item.stageId === stage.stageId);
            if (stageIndex < 0) {
                return;
            }
            const key = stage.stageId;
            const item = {
                key,
                stage,
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
        });
        tempMatches = tempMatches.sort((item1, item2) => item2.stage.orderIndex - item1.stage.orderIndex);
        tempMatches.forEach((item, index) => {
            let isFinished = false;
            const stageMatches = item.matches;
            const lastMatch = stageMatches[stageMatches.length - 1];
            if(lastMatch.status === MatchStatus.Finished) {
                isFinished = true;
            }
            tempMatches[index] = {...item, isFinished};
        });
        return tempMatches;
    };

    sortMatchByLastStage = (matches, lastStage) => {
        const tmpMatches = [];
        const matchIds = [];
        lastStage.map(match => {
            if (!match.matchId) {
                return;
            }
            const homeMatch = matches.filter(item => item.homeTeam.teamId === match.homeTeam.teamId || item.awayTeam.teamId === match.homeTeam.teamId);
            const awayMatch = matches.filter(item => item.homeTeam.teamId === match.awayTeam.teamId || item.awayTeam.teamId === match.awayTeam.teamId);
            const homeResult = this.getMatchMapWithStage(homeMatch);
            if (homeResult.match !== null) {
                tmpMatches.push(homeResult.match);
            }
            homeResult.matchIds.forEach(item => matchIds.push(item));

            const awayResult = this.getMatchMapWithStage(awayMatch);
            if (awayResult.match !== null) {
                tmpMatches.push(awayResult.match);
            }
            awayResult.matchIds.forEach(item => matchIds.push(item));
        });
        const matchIdsFilter = matchIds.join(',');
        const outMatches = matches.filter(item => !matchIdsFilter.includes(item.matchId.toString()));
        const oMatches = this.groupMatchBySecondLeg(outMatches, true);
        return [...tmpMatches, ...oMatches];
    };

    groupMatchBySecondLeg = (matches, isOutMatches) => {
        const tmpMatches = [];
        matches.map(match => {
            if (!match.isSecondLeg) {
                const matchSecondLeg = matches.find(item => item.isSecondLeg && (item.homeTeam.teamId === match.homeTeam.teamId || item.awayTeam.teamId === match.homeTeam.teamId));
                const item = { ...match };
                if (isOutMatches) {
                    item.isDraw = false;
                }
                if (matchSecondLeg) {
                    item.secondLeg = matchSecondLeg;
                }
                tmpMatches.push(item);
            }
        });
        return tmpMatches;
    };


    getMatchMapWithStage = matchFilter => {
        let tmpMatch = null;
        const matchIds = [];
        if (matchFilter.length === 1) {
            tmpMatch = matchFilter[0];
            matchIds.push(matchFilter[0].matchId);
        } else if (matchFilter.length === 2) {
            const firstlegIndex = matchFilter.findIndex(item => !item.isSecondLeg);
            const firstleg = { ...matchFilter[firstlegIndex] };
            firstleg.secondLeg = matchFilter[1 - firstlegIndex];
            tmpMatch = firstleg;
            matchIds.push(matchFilter[0].matchId);
            matchIds.push(matchFilter[1].matchId);
        }
        return { match: tmpMatch, matchIds: matchIds };
    };

    separateMatches = (stages, isPrev) => {
        const tmpStages = stages.filter(item => item.matches.length > 1);
        const totalItems = tmpStages.length;
        const newStages = [];
        for (let i = 0; i < totalItems; i++) {
            const stage = { ...tmpStages[i] };
            const matches = stage.matches;
            if (matches.length % 2 === 0) {
                if (isPrev) {
                    stage.matches = matches.slice(0, matches.length / 2);
                } else {
                    stage.matches = matches.slice(matches.length / 2);
                }
            }
            newStages.push(stage);
        }
        return newStages;
    };

    getFinalAndPlaceMatch = (groupMatches, matches) => {
        const placeMatch = matches.find(item => item.stage?.stageNameEN.toLowerCase().includes('place'));
        const finalStage = groupMatches[groupMatches.length - 1];
        const finalMatch = finalStage?.matches && finalStage.matches.length > 0 ? finalStage.matches[0]: null;
        return {placeMatch, finalMatch};
    };

    sortMatches = groups => {
        groups.map(stage => {
            if(stage.key === Euro.EightTeamStage) {
                const matches = stage.matches;
                const tmpMatches = [];
                Euro.EightTeamMatches.map(item => {
                    const match = matches.find(m => m.matchId === item);
                    tmpMatches.push(match);
                });
                stage.matches = tmpMatches;
            }
            if(stage.key === Euro.QuarterfinalsStage) {
                const matches = stage.matches;
                const tmpMatches = [];
                Euro.QuaterFinalMatches.map(item => {
                    const match = matches.find(m => m.matchId === item);
                    tmpMatches.push(match);
                });
                stage.matches = tmpMatches;
            }
            if(stage.key === Euro.SemifinalsStage) {
                const matches = stage.matches;
                const tmpMatches = [];
                Euro.SemiFinalMatches.map(item => {
                    const match = matches.find(m => m.matchId === item);
                    tmpMatches.push(match);
                });
                stage.matches = tmpMatches;
            }
        });
        return groups;
    };

    render() {
        const { matches, league } = this.props;
        const { isMobile } = this.state;
        if (!matches || matches.length === 0) {
            return null;
        }
        let groupMatches = this.groupMatchByStage();
        groupMatches = groupMatches.reverse();
        groupMatches = this.sortMatches(groupMatches);
        const prevMatchStages = this.separateMatches(groupMatches, true);
        const lastMatchStages = this.separateMatches(groupMatches, false);
        const {placeMatch, finalMatch} = this.getFinalAndPlaceMatch(groupMatches, matches);
        return (
            <div className="play-offs">
                {
                    isMobile &&
                    <div className="wc-playoffs-showmb">
                        <div className="draw-container">
                            <div className="draw-wrapper">
                                <div className="shadowHeader"></div>
                                <div className="learHeader"></div>
                                <Grid matches={groupMatches} thirdPlace={{ ...placeMatch, league }} isMobile={isMobile} />
                            </div>
                        </div>
                    </div>
                }
                {
                    !isMobile &&
                    <div className="wc-playoffs-showpc">
                        <div className="flex-play-offs">
                            <div className="draw-container">
                                <div className="draw-wrapper">
                                    <Grid matches={prevMatchStages} isMobile={isMobile} />
                                </div>
                            </div>
                            <div className="euro-result">
                                <div className="end-round">
                                    <ul className="euro-result-header">
                                        <li className="logo-result"><img src={Site.resolveClientUrl(`images/euro2024/cup.png`)} /></li>
                                        <li className="uppercase-title">{LangHelper.getResource('FinalStage')}</li>
                                    </ul>
                                    <div className="draw">
                                        <div className="draw__round draw__round--result">
                                            <div className="draw__brackets">
                                                {finalMatch && <Item finalMatch={finalMatch} match={{ ...finalMatch, league }} positionClass={'draw__bracket--odd'} index={0} />}
                                                {placeMatch && <Item placeMatch={placeMatch} match={{ ...placeMatch, league }} positionClass={'draw__bracket--even'} index={1} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="third-round">
                                    <ul className="euro-result-header">
                                        <li>{LangHelper.getResource('ThirdPlace')}</li>
                                    </ul>
                                    <div className="draw">
                                        <div className="draw__round draw__round--result">
                                            <div className="draw__brackets">
                                                {finalMatch && <Item finalMatch={finalMatch} match={{ ...finalMatch, league }} positionClass={'draw__bracket--odd'} index={0} />}
                                                {placeMatch && <Item placeMatch={placeMatch} match={{ ...placeMatch, league }} positionClass={'draw__bracket--even'} index={1} />}
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                            <div className="draw-container wc-flip-x">
                                <div className="draw-wrapper">
                                    <Grid matches={lastMatchStages} isMobile={isMobile} />
                                </div>
                            </div>
                        </div>
                    </div>
                }

            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { matches, league, stages } = state;
    return { matches, league, stages };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);