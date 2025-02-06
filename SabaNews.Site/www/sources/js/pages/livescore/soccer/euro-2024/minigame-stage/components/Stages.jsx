import React, { PureComponent } from 'react';
import CommonFunctions from '@jsroot/common/common-functions';
import { Tabs, Tab } from 'react-bootstrap';
import Grid from './Grid';
import { MobileMaxWidth, MatchStatus } from '@jsroot/common/constants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

export class Stages extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isMobile: window.innerWidth <= MobileMaxWidth ? true : false,
            selectedStageId: this.initDefaultStage()
        };
    }

    initDefaultStage = () => {
        const { groupStages } = this.props;
        let currentStage = groupStages[groupStages.length - 1].key;
        for (let i = 0; i < groupStages.length; i++) {
            const stageMatches = groupStages[i].matches;
            const lastMatch = stageMatches[stageMatches.length - 1];
            if (lastMatch.status === MatchStatus.NotStarted) {
                currentStage = groupStages[i].key;
                break;
            }
        }
        return currentStage;
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }


    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const isMobile = this.state.isMobile;
        if (!isMobile && window.innerWidth <= MobileMaxWidth) {
            this.setState({ isMobile: true });
        } else {
            if (isMobile && window.innerWidth > MobileMaxWidth) {
                this.setState({ isMobile: false });
            }
        }
    };

    handleSelectTab = key => {
        this.setState({ selectedStageId: parseInt(key, 10) });
    };

    onChange = event => {
        this.setState({ selectedStageId: parseInt(event.target.value, 10) });
    };


    getNumberVoted = () => {
        const { votes, groupStages } = this.props;
        let count = 0;
        const voted = votes.filter(item => item.stage === parseInt(window.stage, 10));
        groupStages.map(group => {
            count += group.matches.length;
        });
        return `${voted.length}/${count}`;
    };

    getMatchWithStage = () => {
        const { groupStages } = this.props;
        const { selectedStageId } = this.state;
        const stage = groupStages.find(item => item.key === parseInt(selectedStageId, 10));
        return stage;
    };

    getNumberMatch = matchStage => {
        const { matches } = this.props;
        const firstMatch = matchStage[0];
        const index = matches.findIndex(item => item.matchId === firstMatch.matchId);
        return index;
    };


    render() {
        const { groupStages, votes } = this.props;
        if (votes === null) {
            return null;
        }
        const { selectedStageId, isMobile } = this.state;
        const stages = groupStages;
        const currentStage = this.getMatchWithStage();
        return (
            <>
                <div className="minigame-stage-container">
                    <div className="statistic">
                        <div className="statistic-sticky">
                            <div className="statistic_stage">{`Giai đoạn ${window.stage}`}</div>
                            <div className="statistic_round">{`Số trận đã dự đoán:`} <span className="number-big">{this.getNumberVoted()}</span></div>
                        </div>
                    </div>
                    <div className="statistic-main">
                        {
                            (stages.length === 1) &&
                            <Grid matches={stages[0].matches} startNum={this.getNumberMatch(stages[0].matches)} />
                        }
                        {
                            (stages.length > 1 && !isMobile) &&
                            <Tabs className="minigame-nav" activeKey={selectedStageId} onSelect={this.handleSelectTab}>
                                {
                                    stages.map(group => {
                                        return (
                                            <Tab eventKey={group.key} title={CommonFunctions.getStageName(group.stage)} key={group.key} className="season-standings">
                                                {selectedStageId === group.key && <Grid matches={group.matches} startNum={this.getNumberMatch(group.matches)} />}
                                            </Tab>);
                                    }
                                    )
                                }
                            </Tabs>
                        }
                        {
                            (stages.length > 1 && isMobile) && <>
                                <div className="nav-select-mb">
                                    <select onChange={this.onChange} value={selectedStageId} className="custom-select minigame-nav-mobile">
                                        {
                                            stages.map(group =>
                                                <option value={group.key} key={group.key} >{CommonFunctions.getStageName(group.stage)}</option>)}
                                    </select>
                                </div>
                                {
                                    <Grid matches={currentStage.matches} startNum={this.getNumberMatch(currentStage.matches)} />
                                }
                            </>
                        }
                    </div>
                </div>
            </>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { stages, league, votes, matches } = state;
    return { stages, league, votes, matches };
};

export default connect(mapStateToProps, mapDispatchToProps)(Stages);
