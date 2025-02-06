import React, { PureComponent } from 'react';
import CommonFunctions from '@jsroot/common/common-functions';
import { MatchStatus } from '@jsroot/common/constants';
import TeamIcon from '@jsroot/components/Icon/TeamIcon';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';
import DateTimeService from '@jsroot/common/dateTimeService';
import { EqualHeight, EqualHeightElement } from 'react-equal-height';
import dayjs from 'dayjs';
import { Euro } from '../../euro-constants';


export class Item extends PureComponent {
    constructor(props) {
        super(props);
        this.stage = parseInt(window.stage, 10);
    }

    checkKnockoutMatch = () => {
        const { match, teams } = this.props;
        const result = this.stage !== Euro.MinigameStage.Knockout || (this.stage === Euro.MinigameStage.Knockout
            && teams.includes(match.homeTeam.teamId)
            && teams.includes(match.awayTeam.teamId));
        return result;
    };

    checkVoteOption = () => {
        const { match, vote } = this.props;
        if(!vote) {
            return null;
        }
        let voteStatus = null;
        if(vote.teamId === 0) {
            voteStatus = 0;
        } else if(match.homeTeam.teamId ===  vote.teamId) {
            voteStatus = 1;
        } else if(match.awayTeam.teamId ===  vote.teamId) {
            voteStatus = 2;
        }
        return voteStatus;
    };

    handleVote = teamId => {
        const { match, vote } = this.props;
        if ((this.stage === Euro.MinigameStage.Knockout && teamId === 0) || (vote && vote.teamId === teamId)) {
            return;
        }
        const startTime = DateTimeService.convertFromUTC(match.startTime);
        const currentTime = dayjs(DateTimeService.getCurrentClientDateTime());
        const minutes = startTime.diff(currentTime, 'minutes');
        if (match.status === MatchStatus.Finished
            || CommonFunctions.isLiveMatch(match.status)
            || minutes <= 30
            || !this.checkKnockoutMatch()) {
            return;
        }
        const params = {
            stage: this.stage,
            teamId: teamId,
            matchId: match.matchId
        };
        this.props.updateVote(params).then(() => {
            this.props.getVotes();
        });
    };

    getTeamVote = () => {
        const { match, vote } = this.props;
        if(!vote) {
            return '';
        }
        let voteTeamName = '';
        if(match.homeTeam.teamId === vote.teamId) {
            voteTeamName = CommonFunctions.getTeamName(match.homeTeam);
        } else if(match.awayTeam.teamId === vote.teamId) {
            voteTeamName = CommonFunctions.getTeamName(match.awayTeam);
        } else if(vote.teamId === 0) {
            voteTeamName = 'Hòa';
        }
        return voteTeamName;
    };

    getVoteResult = (match, result) => {
        if(result === null && match.status === MatchStatus.Finished) {
            return <span className="choose choose-empty"><i className="icon-emtry" /></span>;
        } else if(result === null) {
            return <span></span>;
        }
        if(result.status) {
            return <span className="choose choose-win"><i className="icon-win" /></span>;
        } else {
            return <span className="choose choose-lose"><i className="icon-lose" /></span>;
        }
    };

    getVoteScore = (match, result) => {
        if(result === null && match.status === MatchStatus.Finished) {
            return <span>0</span>;
        } else if(result === null) {
            return <></>;
        }
        if(result.status) {
            return <span>{`+${result.score}`}</span>;
        }
        return <span>0</span>;
    };

    checkDisabledVote = () => {
        const { match } = this.props;
        const startTime = DateTimeService.convertFromUTC(match.startTime);
        const currentTime = dayjs(DateTimeService.getCurrentClientDateTime());
        const minutes = startTime.diff(currentTime, 'minutes');
        let status = false;
        if (match.status === MatchStatus.Finished
            || CommonFunctions.isLiveMatch(match.status)
            || minutes <= 30
            || !this.checkKnockoutMatch()) {
            status = true;
        }
        return status;
    };

    render() {
        const { match, result, number } = this.props;
        const voteStatus = this.checkVoteOption();
        return (
            <div className={`group-items-table-detial ${this.checkDisabledVote() ? 'finish' : ''}`}>
                <div className="name-play-mobile">
                    #{number < 10 ? '0' + number : number}: {CommonFunctions.getTeamName(match.homeTeam)} vs {CommonFunctions.getTeamName(match.awayTeam)}
                </div>
                <div className="group-cell-table">
                    <div className="table-row table-row-index">
                        <div className="team-choose">
                            <EqualHeight>
                                <div className={`minigame-team home-team ${voteStatus === 1 ? 'active' : ''}`} onClick={() => this.handleVote(match.homeTeam.teamId)}>
                                    <div className="group-bg-logo">
                                        <TeamIcon className="soccer-team-logo" src={CommonFunctions.getTeamIcon(match.homeTeam)} />
                                    </div>
                                    <EqualHeightElement name="Name">
                                        <div className="team-name">
                                            {CommonFunctions.getTeamName(match.homeTeam)}
                                        </div>
                                    </EqualHeightElement>
                                </div>
                                {
                                    this.stage !== Euro.MinigameStage.Knockout &&
                                    <div className={`minigame-team ${voteStatus === 0 ? 'active' : ''}`} onClick={() => this.handleVote(0)} >
                                        <div className="group-bg-logo"><i className="icon-minigame_draw" /></div>
                                        <EqualHeightElement name="Name">
                                            <div className="team-name"> Hòa </div>
                                        </EqualHeightElement>
                                    </div>
                                }

                                <div className={`minigame-team away-team ${voteStatus === 2 ? 'active' : ''}`} onClick={() => this.handleVote(match.awayTeam.teamId)}>
                                    <div className="group-bg-logo">
                                        <TeamIcon className="soccer-team-logo" src={CommonFunctions.getTeamIcon(match.awayTeam)} />
                                    </div>
                                    <EqualHeightElement name="Name">
                                        <div className="team-name">
                                            {CommonFunctions.getTeamName(match.awayTeam)}
                                        </div>
                                    </EqualHeightElement>
                                </div>
                            </EqualHeight>
                        </div>
                    </div>
                    <div className="table-row table-row-name_team">{this.getTeamVote()}</div>
                    <div className="table-row ">{this.getVoteResult(match, result)}</div>
                    <div className="table-row table-row-score">{this.getVoteScore(match, result)}</div>
                    
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { teams } = state;
    return { teams };
};

export default connect(mapStateToProps, mapDispatchToProps)(Item);