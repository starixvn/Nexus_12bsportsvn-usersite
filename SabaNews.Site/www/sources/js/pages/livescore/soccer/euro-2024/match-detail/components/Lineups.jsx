import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import { IncidentStatus, IncidentPosition, IncidentIconType } from '@jsroot/common/constants';
import Site from '@jsroot/common/site';
import LangHelper from '@jsroot/common/langHelper';
import CommonFunctions from '@jsroot/common/common-functions';
import IncidentIcon from '@jsroot/components/Icon/IncidentIcon';

export class Lineups extends Component {
    getPlayerIncident = playerId => {
        const incidents = this.props.match.incidents;
        let playerIncident = {
            goals: 0,
            ownGoals: 0,
            penalty: 0,
            redCard: 0,
            yellowCard: 0,
            yellowTurnRedCard: 0,
            outSubsitution: 0,
            inSubsitution: 0
        };

        incidents && incidents.map(item => {
            if (item.playerId === playerId) {
                playerIncident = this.getGeneralIncident(item, playerIncident);
            }
            if (item.type === IncidentStatus.Substitution) {
                if (item.outPlayerId === playerId) {
                    playerIncident.outSubsitution++;
                }
                if (item.inPlayerId === playerId) {
                    playerIncident.inSubsitution++;
                }
            }
        });
        return playerIncident;
    };

    getGeneralIncident = (incident, playerIncident) => {
        switch (incident.type) {
            case IncidentStatus.Goal:
                playerIncident.goals++;
                break;
            case IncidentStatus.OwnGoal:
                playerIncident.ownGoals++;
                break;
            case IncidentStatus.Penalty:
                if (incident.homeScore !== 0 || incident.awayScore !== 0) {
                    playerIncident.penalty++;
                }
                break;
            case IncidentStatus.RedCard:
                playerIncident.redCard++;
                break;
            case IncidentStatus.YellowCard:
                playerIncident.yellowCard++;
                break;
            case IncidentStatus.YellowTurnRedCard:
                playerIncident.yellowTurnRedCard++;
                break;
        }
        return playerIncident;
    };

    getGoalsNumber = (goals, className) => {
        return (
            <Fragment>
                {
                    goals > 1 &&
                    <span className={className}>{goals}</span>
                }
            </Fragment>
        );
    };

    renderIconListPlayer = player => {
        const playerIncident = this.getPlayerIncident(player.playerId);
        const goalsClass = 'number-position';
        return (
            <Fragment>
                {
                    playerIncident.goals > 0 &&
                    <Fragment>
                        <span className="icon-line-up">
                            {this.getGoalsNumber(playerIncident.goals, goalsClass)}
                            <IncidentIcon type={IncidentIconType.Goal} />
                        </span>
                    </Fragment>
                }
                {
                    playerIncident.ownGoals > 0 &&
                    <>
                        <span className="icon-line-up">
                            {this.getGoalsNumber(playerIncident.ownGoals, goalsClass)}
                            <IncidentIcon type={IncidentIconType.OwnGoal} />
                        </span>
                    </>
                }
                {
                    playerIncident.penalty > 0 &&
                    <>
                        <span className="icon-line-up">
                            {this.getGoalsNumber(playerIncident.penalty, goalsClass)}
                            <IncidentIcon type={IncidentIconType.Penalty} />
                        </span>
                    </>
                }
                {
                    playerIncident.outSubsitution > 0 &&
                    <span className="icon-line-up">
                        <IncidentIcon type={IncidentIconType.outSubsitution} />
                    </span>
                }
                {
                    playerIncident.inSubsitution > 0 &&
                    <span className="icon-line-up">
                        <IncidentIcon type={IncidentIconType.inSubsitution} />
                    </span>
                }
                {
                    (playerIncident.redCard > 0) &&
                    <span className="icon-line-up">
                        <IncidentIcon type={IncidentIconType.RedCard} />
                    </span>
                }
                {
                    (playerIncident.yellowTurnRedCard > 0) &&
                    <span className="icon-line-up">
                        <IncidentIcon type={IncidentIconType.YellowTurnRedCard} />
                    </span>
                }
                {
                    (playerIncident.yellowCard > 0 && playerIncident.yellowTurnRedCard === 0) &&
                    <span className="icon-line-up">
                        <IncidentIcon type={IncidentIconType.YellowCard} />
                    </span>
                }
            </Fragment>
        );
    };

    getListLineup = (lineup, teamType) => {
        let formation;
        let players;
        if (teamType === IncidentPosition.Home) {
            formation = lineup.generalInfo.homeFormation;
            players = lineup.home.filter(player => player.position !== 0);
        } else {
            formation = lineup.generalInfo.awayFormation;
            players = lineup.away.filter(player => player.position !== 0);
        }
        if (players.length === 0) {
            return null;
        }
        players = this.processPlayers(players);
        const formationArray = formation.split('-');
        const goalKeeperIncident = this.getPlayerIncident(players[0].playerId);
        const playersInfo = [[
            {
                number: players[0].playerNumber,
                name: players[0].playerName,
                isGoalKeeper: true,
                goals: goalKeeperIncident.goals,
                ownGoals: goalKeeperIncident.ownGoals,
                penalty: goalKeeperIncident.penalty,
                outSubsitution: goalKeeperIncident.outSubsitution,
                inSubsitution: goalKeeperIncident.inSubsitution,
                redCard: goalKeeperIncident.redCard,
                yellowCard: goalKeeperIncident.yellowCard,
                yellowTurnRedCard: goalKeeperIncident.yellowTurnRedCard
            }
        ]];
        let index = 1;
        formationArray.map(line => {
            const lineArray = [];
            for (let i = 0; i < line; i++) {
                if (!players[index]) {
                    break;
                }
                const incident = this.getPlayerIncident(players[index].playerId);
                lineArray.push({
                    number: players[index].playerNumber,
                    name: players[index].playerName,
                    isGoalKeeper: false,
                    goals: incident.goals,
                    ownGoals: incident.ownGoals,
                    penalty: incident.penalty,
                    outSubsitution: incident.outSubsitution,
                    inSubsitution: incident.inSubsitution,
                    redCard: incident.redCard,
                    yellowCard: incident.yellowCard,
                    yellowTurnRedCard: incident.yellowTurnRedCard
                });
                index++;
            }
            playersInfo.push(lineArray);
        });
        return playersInfo;

    };

    renderIconLineup = player => {
        const goalClass = 'number-goal';
        return (
            <Fragment>

                {this.getIconGoalLineup(player)}
                {
                    player.ownGoals > 0 &&
                    <span className="icon_f ic_ownbong">
                        {this.getGoalsNumber(player.ownGoals, goalClass)}
                        <svg width="24" height="24" viewBox="0 0 31 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="19" cy="12" r="12" fill="white"/>
                            <path d="M26.6395 4.37039C25.6394 3.36372 24.4493 2.56518 23.138 2.02101C21.8268 1.47685 20.4205 1.19786 19.0006 1.20021C17.5803 1.19799 16.1737 1.47703 14.8622 2.02118C13.5506 2.56533 12.3601 3.3638 11.3595 4.37039C7.14677 8.57644 7.14677 15.4229 11.3595 19.63C12.3601 20.6369 13.5508 21.4355 14.8626 21.9797C16.1743 22.5238 17.5812 22.8027 19.0016 22.8002C20.4215 22.8027 21.8278 22.5239 23.139 21.9799C24.4502 21.4359 25.6404 20.6376 26.6405 19.6311C30.8533 15.425 30.8533 8.5786 26.6395 4.37039ZM25.7448 17.3953H23.3213L21.9621 20.1102C21.0139 20.46 20.0114 20.6401 19.0006 20.6421C17.9879 20.6403 16.9834 20.4598 16.0336 20.1091L14.6776 17.4061H12.2628C11.3719 16.3 10.7694 14.9906 10.5092 13.595L12.5167 10.9212L11.2028 8.29589C11.6221 7.40525 12.1919 6.59345 12.8873 5.89614C13.8606 4.92076 15.0535 4.19226 16.3664 3.77153L18.9995 5.52603L21.6337 3.77261C22.9462 4.19363 24.139 4.92168 25.1128 5.89614C25.8074 6.59262 26.3768 7.40329 26.7961 8.29266L25.4823 10.9212L27.4898 13.595C27.2308 14.9861 26.6313 16.2916 25.7448 17.3953Z" fill="#EE2316"/>
                            <path d="M15.3999 11.1691L16.9428 15.5999H21.057L22.5999 11.1691L18.9999 8.3999L15.3999 11.1691Z" fill="#EE2316"/>
                            <rect width="19" height="13" rx="5" fill="white"/>
                            <path d="M9.58293 7.06299C9.58293 8.36279 9.26066 9.36182 8.61613 10.0601C7.9716 10.7583 7.04777 11.1074 5.84465 11.1074C4.64152 11.1074 3.7177 10.7583 3.07316 10.0601C2.42863 9.36182 2.10637 8.35921 2.10637 7.05225C2.10637 5.74528 2.42863 4.74805 3.07316 4.06055C3.72128 3.36947 4.64868 3.02393 5.85539 3.02393C7.0621 3.02393 7.98413 3.37126 8.6215 4.06592C9.26245 4.76058 9.58293 5.7596 9.58293 7.06299ZM3.85197 7.06299C3.85197 7.94027 4.01848 8.60091 4.35148 9.04492C4.68449 9.48893 5.18221 9.71094 5.84465 9.71094C7.1731 9.71094 7.83732 8.82829 7.83732 7.06299C7.83732 5.29411 7.17668 4.40967 5.85539 4.40967C5.19296 4.40967 4.69344 4.63346 4.35686 5.08105C4.02027 5.52507 3.85197 6.18571 3.85197 7.06299ZM13.5313 6.59033H16.6466V10.6616C16.1417 10.8263 15.6654 10.9409 15.2179 11.0054C14.7738 11.0734 14.3191 11.1074 13.8536 11.1074C12.6684 11.1074 11.7624 10.7601 11.1358 10.0654C10.5128 9.36719 10.2013 8.36637 10.2013 7.06299C10.2013 5.79541 10.5629 4.80713 11.2862 4.09814C12.0131 3.38916 13.0193 3.03467 14.3048 3.03467C15.1104 3.03467 15.8874 3.1958 16.6358 3.51807L16.0826 4.8501C15.5097 4.56364 14.9135 4.42041 14.294 4.42041C13.5743 4.42041 12.9978 4.66211 12.5645 5.14551C12.1313 5.62891 11.9146 6.27881 11.9146 7.09521C11.9146 7.94743 12.0883 8.59912 12.4356 9.05029C12.7865 9.49788 13.295 9.72168 13.961 9.72168C14.3083 9.72168 14.661 9.68587 15.0191 9.61426V7.97607H13.5313V6.59033Z" fill="#EE2316"/>
                        </svg>

                    </span>
                }
                {
                    player.inSubsitution > 0 &&
                    <span className="icon_f ic_thay_nguoi">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" fill="white" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706
                                7.02944 21 12 21ZM14.3143 11.9308V16.5H9.68577V11.9308H6.60005L12.0001 6.60001L17.4001 11.9308H14.3143Z" fill="#319C2F"
                            />
                        </svg>
                    </span>
                }
                {
                    player.outSubsitution > 0 &&
                    <span className="icon_f ic_thay_nguoi">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" fill="white" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944
                                16.9706 3 12 3ZM9.68572 12.0692L9.68572 7.5L14.3143 7.5L14.3143 12.0692L17.4 12.0692L12 17.4L6.6 12.0692L9.68572 12.0692Z" fill="#E94633"
                            />
                        </svg>
                    </span>
                }
                {
                    player.redCard > 0 &&
                    <span className="icon_f ic_the_do">
                        <span className="Common_iconWrapper__3p9Oo">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="11" fill="white" />
                                <rect x="6" y="5" width="12" height="14" rx="2.21591" fill="#E94633" />
                            </svg>
                        </span>
                    </span>
                }
                {
                    player.yellowTurnRedCard > 0 &&
                    <span className="icon_f ic_the_vang_do">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" fill="white" />
                            <rect x="8" y="7" width="10" height="12" rx="1.72249" fill="#F9C91E" />
                            <rect x="6" y="5" width="10" height="12" rx="1.72249" fill="#E94633" />
                        </svg>
                    </span>
                }
                {
                    player.yellowCard > 0 && player.yellowTurnRedCard === 0 &&
                    <span className="icon_f ic_the_vang">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="11" fill="white" />
                            <rect x="6" y="5" width="12" height="14" rx="2.21591" fill="#F9C91E" />
                        </svg>
                    </span>
                }
            </Fragment>
        );
    };

    getIconGoalLineup = player => {
        const goalClass = 'number-goal';
        const goal = (
            <span className="icon_f ic_bong" style={{ marginLeft: player.goals > 1 ? '7px' : '0px' }}>
                {this.getGoalsNumber(player.goals, goalClass)}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="white" />
                    <path d="M18.3662 5.64183C17.5328 4.80294 16.5411 4.13749 15.4484 3.68402C14.3557 3.23054 13.1838 2.99805 12.0005 3.00001C10.8169 2.99816
                        9.64478 3.23069 8.55181 3.68415C7.45884 4.13762 6.46675 4.803 5.63293 5.64183C2.12232 9.14687 2.12232 14.8522 5.63293 18.3582C6.46677
                        19.1972 7.45899 19.8628 8.55214 20.3162C9.6453 20.7697 10.8177 21.0021 12.0014 21C13.1846 21.0021 14.3565 20.7697 15.4492 20.3164C16.5419
                        19.8631 17.5337 19.1978 18.3671 18.3591C21.8777 14.854 21.8777 9.14867 18.3662 5.64183ZM17.6207 16.4959H15.6011L14.4684 18.7583C13.6783
                        19.0498 12.8428 19.1999 12.0005 19.2016C11.1566 19.2001 10.3196 19.0497 9.52801 18.7574L8.39802 16.5049H6.38565C5.64323 15.5832 5.14115
                        14.492 4.92432 13.329L6.59725 11.1008L5.50237 8.91308C5.85173 8.17088 6.32659 7.49438 6.90608 6.91328C7.71714 6.10047 8.71126 5.49338
                        9.80533 5.14278L11.9996 6.60486L14.1947 5.14368C15.2885 5.49453 16.2825 6.10124 17.094 6.91328C17.6728 7.49368 18.1474 8.16924 18.4968
                        8.91038L17.4019 11.1008L19.0748 13.329C18.859 14.4882 18.3595 15.5762 17.6207 16.4959Z" fill="#324A75"
                    />
                    <path d="M9 11.3077L10.2857 15H13.7143L15 11.3077L12 9L9 11.3077Z" fill="#324A75" />
                </svg>
            </span>
        );
        const penalty = (
            <span className="icon_f ic_penalty"  style={{ marginLeft: player.penalty > 1 ? '7px' : '0px' }}>
                {this.getGoalsNumber(player.penalty, goalClass)}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="white" />
                    <path d="M18.3663 5.64183C17.5329 4.80294 16.5411 4.13749 15.4484 3.68402C14.3557 3.23054 13.1838 2.99805 12.0005 3.00001C10.817 2.99816 9.64481
                        3.23069 8.55184 3.68415C7.45887 4.13762 6.46678 4.803 5.63296 5.64183C2.12235 9.14687 2.12235 14.8522 5.63296 18.3582C6.4668 19.1972 7.45902
                        19.8628 8.55217 20.3162C9.64533 20.7697 10.8177 21.0021 12.0014 21C13.1846 21.0021 14.3565 20.7697 15.4492 20.3164C16.5419 19.8631 17.5337
                        19.1978 18.3672 18.3591C21.8778 14.854 21.8778 9.14867 18.3663 5.64183ZM17.6207 16.4959H15.6012L14.4685 18.7583C13.6783 19.0498 12.8429 19.1999
                        12.0005 19.2016C11.1566 19.2001 10.3196 19.0497 9.52804 18.7574L8.39805 16.5049H6.38568C5.64326 15.5832 5.14118 14.492 4.92436 13.329L6.59728
                        11.1008L5.5024 8.91308C5.85176 8.17088 6.32662 7.49438 6.90611 6.91328C7.71717 6.10047 8.71129 5.49338 9.80536 5.14278L11.9996 6.60486L14.1948
                        5.14368C15.2885 5.49453 16.2825 6.10124 17.094 6.91328C17.6729 7.49368 18.1474 8.16924 18.4968 8.91038L17.4019 11.1008L19.0749 13.329C18.859
                        14.4882 18.3595 15.5762 17.6207 16.4959Z" fill="#324A75"
                    />
                    <path d="M9 11.3077L10.2857 15H13.7143L15 11.3077L12 9L9 11.3077Z" fill="#324A75" />
                    <circle cx="7" cy="7" r="5" fill="white" />
                    <path d="M6.76902 7.10984H7.19044C7.58432 7.10984 7.87905 7.03271 8.07461 6.87847C8.27017 6.72147 8.36795 6.49423 8.36795 6.19675C8.36795 5.89652
                        8.28532 5.67479 8.12006 5.53156C7.95755 5.38833 7.70139 5.31672 7.35158 5.31672H6.76902V7.10984ZM9.66115 6.1513C9.66115 6.80134 9.45732 7.29851
                        9.04967 7.64282C8.64477 7.98712 8.06772 8.15927 7.31852 8.15927H6.76902V10.3077H5.48822V4.26729H7.41768C8.15035 4.26729 8.70675 4.42567 9.08685
                        4.74242C9.46972 5.05643 9.66115 5.52605 9.66115 6.1513Z" fill="#324A75"
                    />
                </svg>
            </span>
        );
        let icon = '';
        if (player.goals > 0 && player.penalty > 0) {
            icon = <div className="lineup-goals">{goal} {penalty}</div>;
        } else if (player.goals > 0) {
            icon = goal;
        } else if (player.penalty > 0) {
            icon = penalty;
        }

        return icon;
    };

    renderListPlayer = (title, home, away) => {
        const homePlayers = this.processPlayers(home);
        const awayPlayers = this.processPlayers(away);
        return (
            <div className="line-up-change-men block-line-up">
                <div className="block-line-up-main">
                    <div className="block-line-up-title">{title}</div>
                    <div className="block-line-up-body">
                        <div className="line-up">
                            <div className="line-up-table">
                                <div className="table-paticipant home-team">
                                    {
                                        homePlayers.map((homePlayer, hIndex) => {
                                            return (
                                                <ul key={hIndex} className="list-paticipant">
                                                    <li className="number-player">{homePlayer.playerNumber}</li>
                                                    <li className="name-player">{homePlayer.playerName}</li>
                                                    <li className="action-player">{this.renderIconListPlayer(homePlayer)}</li>
                                                </ul>
                                            );
                                        })
                                    }
                                </div>
                                <div className="table-paticipant away-team">
                                    {
                                        awayPlayers.map((awayPlayer, aIndex) => {
                                            return (
                                                <ul key={aIndex} className="list-paticipant away-paticipant">
                                                    <li className="number-player">{awayPlayer.playerNumber}</li>
                                                    <li className="name-player">{awayPlayer.playerName}</li>
                                                    <li className="action-player">{this.renderIconListPlayer(awayPlayer)}</li>
                                                </ul>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    renderPitchView = () => {
        const lineup = this.props.match.lineup;
        const matchInfo = this.props.match.generalInfo;
        if (!lineup.generalInfo || !lineup.generalInfo.homeFormation || !lineup.generalInfo.awayFormation) {
            return null;
        }
        const homeLineup = this.getListLineup(lineup, IncidentPosition.Home);
        let awayLineup = this.getListLineup(lineup, IncidentPosition.Away);
        awayLineup = awayLineup.reverse();
        return (
            <div className="line-up-map">
                <div className="line-up-map-main">
                    <div className="line-up-map-head">
                        <div className="team">
                            <div className="team-head-name">{CommonFunctions.getTeamName(matchInfo.homeTeam)}</div>
                            <div className="team-head-number">{lineup.generalInfo.homeFormation}</div>
                        </div>
                    </div>
                    <div className="line-up-map-body">
                        {this.renderTeamLineup(homeLineup, true)}
                        {this.renderTeamLineup(awayLineup, false)}
                    </div>
                    <div className="line-up-map-head">
                        <div className="team">
                            <div className="team-head-name">{CommonFunctions.getTeamName(matchInfo.awayTeam)}</div>
                            <div className="team-head-number">{lineup.generalInfo.awayFormation}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    renderTeamLineup = (lineups, isHome) => {
        const { isEvent } = this.props;
        return (
            <div className="team-content">
                {
                    lineups.map((line, lineIndex) => {
                        const shirtIcon = this.getShirtIcon(isHome, isEvent);
                        return (
                            <div className="pitch-row" key={lineIndex}>
                                {
                                    line.map((player, pindex) => {
                                        return (
                                            <div className="pitch-item" key={pindex}>
                                                <div className="team-player-img">
                                                    <img src={Site.resolveClientUrl(`css/images/${shirtIcon}`)} alt="" />
                                                    <div className="team-number">
                                                        {player.number}
                                                        {this.renderIconLineup(player)}
                                                    </div>
                                                </div>
                                                <div className="text-name">{player.name}</div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    };

    getShirtIcon = (isHome, isEvent) => {
        let shirtIcon = 'red.png';
        if(!isHome && isEvent) {
            shirtIcon = 'puple.png';
        } else if(!isHome) {
            shirtIcon = 'blue.png';
        }
        return shirtIcon;
    };


    getTeamSubstitution = position => {
        if (!this.props.match.incidents) {
            return null;
        }
        const incidents = CommonFunctions.produceIncidents(this.props.match.incidents);
        const lineup = this.props.match.lineup;
        const players = position === IncidentPosition.Home ? lineup.home : lineup.away;
        const substitution = incidents.filter(item => item.type === IncidentStatus.Substitution && item.position === position);
        return (
            substitution && substitution.map((incident, key) => {
                const inPlayer = players.find(item => item.playerId === incident.inPlayerId);
                const outPlayer = players.find(item => item.playerId === incident.outPlayerId);
                return (
                    <ul key={key} className="list-paticipant list-change-main">
                        <li className="number-player">{incident.timeShow !== '' ? incident.timeShow + "'" : ''}</li>
                        <li className="name-player">
                            <p><i className="icon-livescore icon-in"></i> {inPlayer?.playerNumber || 0} - {incident.inPlayerName}</p>
                            <p> <i className="icon-livescore icon-out"></i> {outPlayer?.playerNumber || 0} - {incident.outPlayerName}</p>
                        </li>
                    </ul>
                );
            })
        );
    };

    renderSubstitution = () => {
        const homeSub = this.getTeamSubstitution(IncidentPosition.Home);
        const awaySub = this.getTeamSubstitution(IncidentPosition.Away);
        if (homeSub.length === 0 && awaySub.length === 0) {
            return null;
        }
        return (
            <div className="line-up-change-men block-line-up">
                <div className="block-line-up-main">
                    <div className="block-line-up-title">Thay người</div>
                    <div className="block-line-up-body">
                        <div className="line-up">
                            <div className="line-up-table">
                                <div className="table-paticipant home-team">
                                    {homeSub}
                                </div>
                                <div className="table-paticipant away-team">
                                    {awaySub}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    processPlayers = players => {
        const tmpPlayers = [];
        players.map(player => {
            if(tmpPlayers.length === 0) {
                tmpPlayers.push(player);
            } else {
                const index = tmpPlayers.findIndex(item => item.playerId === player.playerId);
                if(index < 0) {
                    tmpPlayers.push(player);
                }
            }
        });
        return tmpPlayers;
    };



    render() {
        const { lineup } = this.props.match;
        if (!lineup || !lineup.generalInfo || (lineup.home.length === 0 && lineup.away.length === 0 )) {
            return null;
        }
        const homePlayers = lineup.home.filter(player => player.position !== 0);
        const awayPlayers = lineup.away.filter(player => player.position !== 0);

        const homeSubPlayers = lineup.home.filter(player => player.position === 0).sort((a, b) => (a.playerNumber - b.playerNumber));
        const awaySubPlayers = lineup.away.filter(player => player.position === 0).sort((a, b) => (a.playerNumber - b.playerNumber));

        return (
            <div className="line-up-group" id="doi-hinh">
                <h2 className="title-custom">Đội hình</h2>
                <div className="line-up-group-spacing">
                    {this.renderPitchView()}
                    <div className="line-up-main">
                        <div className="line-up-team">
                            {this.renderListPlayer(LangHelper.getResource('LineupPlayer'), homePlayers, awayPlayers)}
                        </div>
                        <div className="line-up-team">
                            {this.renderListPlayer(LangHelper.getResource('LineupSubtitudePlayer'), homeSubPlayers, awaySubPlayers)}
                        </div>
                        {this.renderSubstitution()}
                        {
                            (lineup.generalInfo.homeCoach || lineup.generalInfo.awayCoach) &&
                            <div className="line-up-change-men block-line-up perent-men">
                                <div className="block-line-up-main">
                                    <div className="block-line-up-title">Huấn luyện viên</div>
                                    <div className="block-line-up-body">
                                        <div className="line-up">
                                            <div className="line-up-table">
                                                <div className="table-paticipant home-team">
                                                    <ul className="list-paticipant">
                                                        <li className="name-player">{lineup.generalInfo.homeCoach}</li>
                                                    </ul>
                                                </div>
                                                <div className="table-paticipant away-team">
                                                    <ul className="list-paticipant">
                                                        <li className="name-player">{lineup.generalInfo.awayCoach}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { match } = state;
    return {
        match
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Lineups);