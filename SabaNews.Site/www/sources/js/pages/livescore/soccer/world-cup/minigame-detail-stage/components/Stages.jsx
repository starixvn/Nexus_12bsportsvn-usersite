import React, { PureComponent } from 'react';
import CommonFunctions from '@jsroot/common/common-functions';
import { Tabs, Tab } from 'react-bootstrap';
import Grid from './Grid';
import { WorldCup, MobileMaxWidth, MatchStatus } from '@jsroot/common/constants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import Site from '@jsroot/common/site';

export class Stages extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isMobile: window.innerWidth <= MobileMaxWidth ? true : false,
            selectedStageId: this.initStageId()
        };
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    initStageId = () => {
        const { groupStages } = this.props;
        let currentStage = groupStages[groupStages.length - 1].key;
        for(let i = 0; i < groupStages.length; i++) {
            const stageMatches = groupStages[i].matches;
            const lastMatch = stageMatches[stageMatches.length - 1];
            if(lastMatch.status === MatchStatus.NotStarted) {
                currentStage = groupStages[i].key;
                break;
            }
        }
        return currentStage;
    };

    handleResize = () => {
        const isMobile = this.state.isMobile;
        if (!isMobile && window.innerWidth <= MobileMaxWidth){
            this.setState({ isMobile: true });
        } else{
            if (isMobile && window.innerWidth > MobileMaxWidth){
                this.setState({ isMobile: false });
            }
        }
    };

    handleSelectTab = key => {
        this.setState({ selectedStageId: key });
    };

    onChange = event => {
        this.setState({ selectedStageId: parseInt(event.target.value, 10) });
    };

    handleClick = event => {
        const url = Site.resolveClientUrl(WorldCup.MinigameDetailUrl);
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };

    getMatchWithStage = () => {
        const { groupStages } = this.props;
        const { selectedStageId } = this.state;
        const stage = groupStages.find(item => item.key === parseInt(selectedStageId, 10));
        return stage;
    };

    getNumberMatch = matchesStage => {
        const { matches } = this.props;
        const firstMatch = matchesStage[0];
        const index = matches.findIndex(item => item.matchId === firstMatch.matchId);
        return index;
    };


    render() {
        const { votes, groupStages } = this.props;
        if(votes === null) {
            return null;
        }
        const { selectedStageId, isMobile } = this.state;
        const stages = groupStages;
        const currentStage = this.getMatchWithStage();
        return (
            <>
                <ul className="stage-number">
                    <li>chi tiết dự đoán - giai đoạn { window.stage }</li>
                    <li onClick={this.handleClick} style={{ cursor : 'pointer'}}>Quay lại <i className="icon-go_back" /></li>
                </ul>
                <div className="wrapper-scroll">
                    {
                        stages.length === 1 &&
                        <Grid matches={stages[0].matches} votes={votes} startNum={this.getNumberMatch(stages[0].matches)} />
                    }
                    {
                        (stages.length > 1 && !isMobile) &&
                        <Tabs className="live-score-nav" activeKey={selectedStageId} onSelect={this.handleSelectTab}>
                            {
                                stages.map(group => {
                                    return (
                                        <Tab eventKey={group.key} title={CommonFunctions.getStageName(group.stage)}  key={group.key}  className="season-standings">
                                            <Grid matches={group.matches} votes={votes} startNum={this.getNumberMatch(group.matches)}/>
                                        </Tab>
                                    );
                                })
                            }
                        </Tabs>
                    }
                    {
                        (stages.length > 1 && isMobile) &&
                        <>
                            <div className="nav-select-mb">
                                <select onChange={this.onChange} value={selectedStageId} className="custom-select minigame-nav-mobile">
                                    {
                                        stages.map(group =>
                                            <option value={group.key} key={group.key} >{CommonFunctions.getStageName(group.stage)}</option>)
                                    }
                                </select>
                            </div>
                            {
                                <Grid matches={currentStage.matches} votes={votes} startNum={this.getNumberMatch(currentStage.matches)}/>
                            }
                        </>
                    }
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
