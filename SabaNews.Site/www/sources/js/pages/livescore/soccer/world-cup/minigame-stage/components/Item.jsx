import React, { PureComponent } from 'react';
import CommonFunctions from '@jsroot/common/common-functions';
import TeamIcon from '@jsroot/components/Icon/TeamIcon';
import { MatchStatus } from '@jsroot/common/constants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import DateTimeService from '@jsroot/common/dateTimeService';
import dayjs from 'dayjs';
import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';
import { EqualHeight, EqualHeightElement } from 'react-equal-height';

export class Item extends PureComponent {
    constructor(props) {
        super(props);
        this.stage = parseInt(window.stage, 10);
    }

    checkVoteOption = () => {
        const { match, votes } = this.props;
        let vote = null;
        const matchVote = votes.find(item => item.matchId === match.matchId && item.stage === this.stage);
        if (!matchVote) {
            return vote;
        }
        if (matchVote.teamId === 0) {
            vote = 0;
        } else if (match.homeTeam.teamId === matchVote.teamId) {
            vote = 1;
        } else if (match.awayTeam.teamId === matchVote.teamId) {
            vote = 2;
        }
        return vote;
    };

    checkKnockoutMatch = () => {
        const { match, teams } = this.props;
        const result = this.stage !== 4 || (this.stage === 4
            && teams.includes(match.homeTeam.teamId)
            && teams.includes(match.awayTeam.teamId));
        return !result;
    };

    handleVoteTeam = async teamId => {
        const { match, votes } = this.props;
        const vote = votes.find(item => item.matchId === match.matchId && item.stage === this.stage);
        if ((this.stage === 4 && teamId === 0) || (vote && vote.teamId === teamId)) {
            return;
        }
        const url = Site.resolveClientUrl('worldcup2022/GetMinigameVoteMatch');
        await DataService.postDataAsync(url, { matchId: match.matchId }).then(response => {
            const voteMatch = response.data;
            const startTime = DateTimeService.convertFromUTC(voteMatch.startTime);
            const currentTime = dayjs(DateTimeService.getCurrentClientDateTime());
            const minutes = startTime.diff(currentTime, 'minutes');
            if (voteMatch.status === MatchStatus.Finished
                || minutes <= 30
                || this.checkKnockoutMatch()) {
                return;
            }
            const params = {
                stage: window.stage,
                teamId: teamId,
                matchId: match.matchId
            };
            this.props.updateVote(params).then(() => {
                this.props.getVotes();
            });
        });
    };

    getVoteTeam = vote => {
        const { match } = this.props;
        if (vote === 1) {
            return (
                <span>Bạn dự đoán <b>{CommonFunctions.getTeamName(match.homeTeam)}</b> sẽ giành chiến thắng!</span>
            );
        } else if (vote === 2) {
            return (
                <span>Bạn dự đoán <b>{CommonFunctions.getTeamName(match.awayTeam)}</b> sẽ giành chiến thắng!</span>
            );
        } else if (vote === 0) {
            return (
                <span>Bạn dự đoán {CommonFunctions.getTeamName(match.homeTeam)} và {CommonFunctions.getTeamName(match.awayTeam)} sẽ <b>Hòa</b> nhau!</span>
            );
        }
        return <span></span>;
    };

    checkDisabledVote = () => {
        const { match } = this.props;
        const startTime = DateTimeService.convertFromUTC(match.startTime);
        const currentTime = dayjs(DateTimeService.getCurrentClientDateTime());
        const minutes = startTime.diff(currentTime, 'minutes');
        let status = false;
        if (match.status === MatchStatus.Finished
            || minutes <= 30
            || this.checkKnockoutMatch()) {
            status = true;
        }
        return status;
    };

    render() {
        const { match, number } = this.props;
        const vote = this.checkVoteOption();
        return (
            <div className={`statistic-grid-item ${vote != null ? 'active' : ''}`} onClick={this.onClick}>
                <div className="statistic-grid-item-header">
                    <div className="statistic-grid-item-round">
                        {`Trận ${number < 10 ? '0' + number : number}: ${CommonFunctions.getTeamName(match.homeTeam)} vs ${CommonFunctions.getTeamName(match.awayTeam)}`}
                    </div>
                    <div className="statistic-grid-item-fav show-pc">{this.getVoteTeam(vote)}</div>
                </div>

                <div className={`statistic-grid-item-body ${this.checkDisabledVote() ? 'finish' : ''}`}>
                    <div className="team-main">
                        <EqualHeight>
                            <div className={`statistic-team statistic-team-home ${vote === 1 ? 'active' : ''}`} onClick={() => this.handleVoteTeam(match.homeTeam.teamId)}>
                                <TeamIcon className="statistic-team-logo" src={CommonFunctions.getTeamIcon(match.homeTeam)} />
                                <EqualHeightElement name="Name">
                                    <div className="statistic-team-name">{CommonFunctions.getTeamName(match.homeTeam)}</div>
                                </EqualHeightElement>
                            </div>
                            {
                                this.stage !== 4 &&
                                <div className={`statistic-team statistic-draw ${vote === 0 ? 'active' : ''}`} onClick={() => this.handleVoteTeam(0)}>
                                    <i className="icon-minigame_draw" />
                                    <EqualHeightElement name="Name">
                                        <div className="statistic-team-name">Hòa</div>
                                    </EqualHeightElement>
                                </div>
                            }
                            <div className={`statistic-team statistic-team-away ${vote === 2 ? 'active' : ''}`} onClick={() => this.handleVoteTeam(match.awayTeam.teamId)}>
                                <TeamIcon className="statistic-team-logo" src={CommonFunctions.getTeamIcon(match.awayTeam)} />
                                <EqualHeightElement name="Name">
                                    <div className="statistic-team-name">{CommonFunctions.getTeamName(match.awayTeam)}</div>
                                </EqualHeightElement>
                            </div>
                        </EqualHeight>
                    </div>
                    {
                        vote !== null && <div className="statistic-grid-item-fav show-mb">{this.getVoteTeam(vote)}</div>
                    }
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { votes, teams } = state;
    return { votes, teams };
};

export default connect(mapStateToProps, mapDispatchToProps)(Item);