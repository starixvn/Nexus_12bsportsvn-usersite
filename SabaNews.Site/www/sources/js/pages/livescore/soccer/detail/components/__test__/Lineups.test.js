import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Lineups } from '../Lineups';
import CommonFunctions from '@jsroot/common/common-functions';

describe('Lineups', () => {
    let defaultProps = {
        match: {
            generalInfo: {isLineup: false},
            incidents: [],
            lineup: null,
            headToHead: null,
            statistic: null
        },
        setActiveTab: jest.fn(() => '')
    };
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getPlayerIncident', () => {
        it('return correctly when call function', () => {
            // Arrange
            const incidents = [
                { matchId: 1, type: 9, outPlayerId: 1, inPlayerId: 2 },
                { matchId: 1, type: 9, outPlayerId: 2, inPlayerId: 3 },
                { matchId: 1, type: 1, playerId: 2, inPlayerId: 3}
            ];
            const playerId = 2;
            defaultProps.match.incidents = incidents;
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result =  instance.getPlayerIncident(playerId);

            // Assert
            expect(result.outSubsitution).toEqual(1);
            expect(result.inSubsitution).toEqual(1);
        });
    });

    describe('getGeneralIncident', () => {
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
        it('return correctly when incident type = Goal', () => {
            // Arrange
            const incident = { matchId: 1, type: 1, playerId: 1 };
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result =  instance.getGeneralIncident(incident, playerIncident);

            // Assert
            expect(result.goals).toEqual(1);
        });

        it('return correctly when incident type = OwnGoal', () => {
            // Arrange
            const incident = { matchId: 1, type: 17, playerId: 1 };
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result =  instance.getGeneralIncident(incident, playerIncident);

            // Assert
            expect(result.ownGoals).toEqual(1);
        });

        it('return correctly when incident type = Penalty and have score', () => {
            // Arrange
            const incident = { matchId: 1, type: 8, playerId: 1, homeScore: 1, awayScore: 1 };
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result =  instance.getGeneralIncident(incident, playerIncident);

            // Assert
            expect(result.penalty).toEqual(1);
        });

        it('return correctly when incident type = Penalty and dont have score', () => {
            // Arrange
            const incident = { matchId: 1, type: 8, playerId: 1, homeScore: 0, awayScore:  0};
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result =  instance.getGeneralIncident(incident, playerIncident);

            // Assert
            expect(result.penalty).toEqual(1);
        });

        it('return correctly when incident type = RedCard', () => {
            // Arrange
            const incident = { matchId: 1, type: 4, playerId: 1};
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result =  instance.getGeneralIncident(incident, playerIncident);

            // Assert
            expect(result.redCard).toEqual(1);
        });

        it('return correctly when incident type = YellowCard', () => {
            // Arrange
            const incident = { matchId: 1, type: 3, playerId: 1};
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result =  instance.getGeneralIncident(incident, playerIncident);

            // Assert
            expect(result.yellowCard).toEqual(1);
        });

        it('return correctly when incident type = YellowTurnRedCard', () => {
            // Arrange
            const incident = { matchId: 1, type: 15, playerId: 1};
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result =  instance.getGeneralIncident(incident, playerIncident);

            // Assert
            expect(result.yellowTurnRedCard).toEqual(1);
        });
    });

    describe('getGoalsNumber', () => {
        it('return correctly when goal lower 2', () => {
            // Arrange
            const goal = 1;
            const className = "goal";
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result =  instance.getGoalsNumber(goal, className);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when goal more than 2', () => {
            // Arrange
            const goal = 3;
            const className = "goal";
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result =  instance.getGoalsNumber(goal, className);

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('renderIconListPlayer', () => {
        it('render empty when player has not any incident', () => {
            // Arrange
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
            const player = { playerId: 1 }
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            instance.getPlayerIncident = jest.fn().mockReturnValue(playerIncident);
            instance.getGoalsNumber = jest.fn();
            // Act
            const result =  instance.renderIconListPlayer(player);

            // Assert
            expect(result).toMatchSnapshot();

        });

        it('render correctly when get yellowTurnRedCard event', () => {
            // Arrange
            let playerIncident = {
                goals: 1,
                ownGoals: 1,
                penalty: 1,
                redCard: 1,
                yellowCard: 1,
                yellowTurnRedCard: 0,
                outSubsitution: 1,
                inSubsitution: 1
            };
            const player = { playerId: 1 }
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            instance.getPlayerIncident = jest.fn().mockReturnValue(playerIncident);
            instance.getGoalsNumber = jest.fn();
            // Act
            const result =  instance.renderIconListPlayer(player);

            // Assert
            expect(result).toMatchSnapshot();

        });

        it('render correctly when player has incidents', () => {
            // Arrange
            let playerIncident = {
                goals: 1,
                ownGoals: 1,
                penalty: 1,
                redCard: 1,
                yellowCard: 1,
                yellowTurnRedCard: 1,
                outSubsitution: 1,
                inSubsitution: 1
            };
            const player = { playerId: 1 }
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            instance.getPlayerIncident = jest.fn().mockReturnValue(playerIncident);
            instance.getGoalsNumber = jest.fn();
            // Act
            const result =  instance.renderIconListPlayer(player);

            // Assert
            expect(result).toMatchSnapshot();

        });
    });

    describe('getListLineup', () => {
        it('return correctly when hometeam do not have any player', () => {
            // Arrange
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            const lineup = {
                generalInfo: { homeFormation: '4-3-3', awayFormation: '5-3-2' },
                home: [],
                away: []
            };
            const teamType = 1;

            // Act
            const result = instance.getListLineup(lineup, teamType);

            // Assert
            expect(result).toEqual(null);
        });

        it('return correctly when awayteam do not have any player', () => {
            // Arrange
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            const lineup = {
                generalInfo: { homeFormation: '4-3-3', awayFormation: '5-3-2' },
                home: [],
                away: []
            };
            const teamType = 2;

            // Act
            const result = instance.getListLineup(lineup, teamType);

            // Assert
            expect(result).toEqual(null);
        });

        it('return correctly when team players have incident', () => {
            // Arrange
            const lineup = {
                generalInfo: { homeFormation: '1-3', awayFormation: '1-1' },
                home: [{playerName: "home1", playerNumber: 1}, {playerName: "home2", playerNumber: 2}, {playerName: "home3", playerNumber: 3}],
                away: [{playerName: "away1", playerNumber: 1}, {playerName: "away2", playerNumber: 2}, {playerName: "away3", playerNumber: 3}]
            };
            const teamType = 1;
            let playerIncident = {
                goals: 1,
                ownGoals: 1,
                penalty: 1,
                redCard: 1,
                yellowCard: 1,
                yellowTurnRedCard: 1,
                outSubsitution: 1,
                inSubsitution: 1
            }
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            instance.getPlayerIncident = jest.fn().mockReturnValue(playerIncident);
            // Act
            const result = instance.getListLineup(lineup, teamType);

            // Assert
            expect(result.length).toEqual(3);
        });
    });

    describe('renderIconLineup', () => {
        it('render empty when has no incident', () => {
            // Arrange
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
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            instance.getIconGoalLineup = jest.fn().mockReturnValue('goal');
            // Act
            const result =  instance.renderIconLineup(playerIncident);

            // Assert
            expect(result).toMatchSnapshot();
        });
        it('render correctly when get yellow turn red card event', () => {
            // Arrange
            let playerIncident = {
                goals: 1,
                ownGoals: 1,
                penalty: 1,
                redCard: 1,
                yellowCard: 1,
                yellowTurnRedCard: 0,
                outSubsitution: 1,
                inSubsitution: 1
            };
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            instance.getIconGoalLineup = jest.fn().mockReturnValue('goal');
            // Act
            const result =  instance.renderIconLineup(playerIncident);

            // Assert
            expect(result).toMatchSnapshot();
        });
        it('render correctly when call functions', () => {
            // Arrange
            let playerIncident = {
                goals: 1,
                ownGoals: 1,
                penalty: 1,
                redCard: 1,
                yellowCard: 1,
                yellowTurnRedCard: 1,
                outSubsitution: 1,
                inSubsitution: 1
            };
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            instance.getIconGoalLineup = jest.fn().mockReturnValue('goal');
            // Act
            const result =  instance.renderIconLineup(playerIncident);

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('getIconGoalLineup', () => {
        it('render empty when palyer has no any goal event', () => {
            // Arrange
            let playerIncident = {
                goals: 0,
                penalty: 0
            };
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            instance.getGoalsNumber = jest.fn().mockReturnValue(1);
            // Act
            const result =  instance.getIconGoalLineup(playerIncident);

            // Assert
            expect(result).toEqual('');
        });

        it('render empty when player have both goal & penalty', () => {
            // Arrange
            let playerIncident = {
                goals: 2,
                penalty: 2
            };
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            instance.getGoalsNumber = jest.fn().mockReturnValue(1);
            // Act
            const result =  instance.getIconGoalLineup(playerIncident);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render empty when player have only goal', () => {
            // Arrange
            let playerIncident = {
                goals: 1,
                penalty: 0
            };
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            instance.getGoalsNumber = jest.fn().mockReturnValue(1);
            // Act
            const result =  instance.getIconGoalLineup(playerIncident);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render empty when player have only penalty', () => {
            // Arrange
            let playerIncident = {
                goals: 0,
                penalty: 1
            };
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            instance.getGoalsNumber = jest.fn().mockReturnValue(1);
            // Act
            const result =  instance.getIconGoalLineup(playerIncident);

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('renderListPlayer', () => {
        it('render correctly when call function', () => {
            // Arrange
            const title = "đội hình";
            const home = [
                {playerNumber: 1, playerName: 'home name 1'},
                {playerNumber: 2, playerName: 'home name 2'}
            ];
            const away = [
                {playerNumber: 1, playerName: 'away name 1'},
                {playerNumber: 2, playerName: 'away name 2'}
            ];

            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            instance.renderIconListPlayer = jest.fn().mockReturnValue('icons');

            // Act
            const result =  instance.renderListPlayer(title, home, away);

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('renderPitchView', () => {
        it('return null when line up general data is null', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    lineup: {
                        generalInfo: null
                    }
                }
            };

            const container = shallow(<Lineups {...props}/>);
            const instance = container.instance();

            // Act
            const result =  instance.renderPitchView();

            // Assert
            expect(result).toEqual(null);
        });

        it('return null when line up formation data is null', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    lineup: {
                        generalInfo: {
                            homeFormation: null,
                            awayFormation: null
                        },
                        home: [],
                        away: []
                    }
                }
            };

            const container = shallow(<Lineups {...props}/>);
            const instance = container.instance();

            // Act
            const result =  instance.renderPitchView();

            // Assert
            expect(result).toEqual(null);
        });

        it('render correctly when call function', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    lineup: {
                        generalInfo: {
                            homeFormation: '4-3-3',
                            awayFormation: '4-4-2'
                        },
                        home: [],
                        away: []
                    }
                }
            };
            const home = [
                {playerNumber: 1, playerName: 'home name 1'},
                {playerNumber: 2, playerName: 'home name 2'}
            ];

            const container = shallow(<Lineups {...props}/>);
            const instance = container.instance();
            instance.getListLineup = jest.fn().mockReturnValue(home);
            instance.renderTeamLineup = jest.fn();
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('messi');
            // Act
            const result =  instance.renderPitchView();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('renderTeamLineup', () => {
        it('render correctly when render hometeam lineup', () => {
            // Arrange
            const lineups = [
                [{number: 1, name: 'name 1'}, {number: 2, name: 'name2'}],
                [{number: 3, name: 'name 3'}]
            ];

            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            instance.renderIconLineup = jest.fn().mockReturnValue("icons");
            // Act
            const result =  instance.renderTeamLineup(lineups, true);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when render awayteam lineup', () => {
            // Arrange
            const lineups = [
                [{number: 1, name: 'name 1'}, {number: 2, name: 'name2'}],
                [{number: 3, name: 'name 3'}]
            ];

            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            instance.renderIconLineup = jest.fn().mockReturnValue("icons");
            // Act
            const result =  instance.renderTeamLineup(lineups, false);

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('getTeamSubstitution', () => {
        it('return null when incidents data is null', () => {
            // Arrange
            const props =  {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    incidents: null
                }
            };
            const container = shallow(<Lineups {...props}/>);
            const instance = container.instance();

            // Act
            const result = instance.getTeamSubstitution(1);

            // Assert
            expect(result).toEqual(null);
        });

        it('return null when home team do not have any subsitution event', () => {
            // Arrange
            const incidents = [
                { matchId: 1, position: 2, type: 1, playerId: 2, inPlayerId: 3, time: 1, second: 34, homeScore: 0, awayScore: 0}
            ];
            const lineup = { home:[], away: []};
            defaultProps.match.lineup = lineup;
            defaultProps.match.incidents = incidents;
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getTeamSubstitution(1);

            // Assert
            expect(result).toEqual([]);
        });

        it('return null when away team do not have any subsitution event', () => {
            // Arrange
            const incidents = [
                { matchId: 1, type: 1, playerId: 2, inPlayerId: 3}
            ];
            const lineup = { home:[], away: []};
            defaultProps.match.lineup = lineup;
            defaultProps.match.incidents = incidents;
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getTeamSubstitution(2);

            // Assert
            expect(result).toEqual([]);
        });

        it('return correctly when have subsitution event', () => {
            // Arrange
            const incidents = [
                { matchId: 1, position: 1, time: -1, type: 9, outPlayerId: 1, inPlayerId: 2 },
                { matchId: 1, position: 1, time: 0, type: 9, outPlayerId: 2, inPlayerId: 3 },
                { matchId: 1, position: 1, time: 1, type: 9, outPlayerId: 4, inPlayerId: 5 },
                { matchId: 1, type: 1, playerId: 2, inPlayerId: 3}
            ];
            const lineup = {
                home:[{playerId: 1, playerNumber: 1}, {playerId: 2, playerNumber: 2}],
                away: [{playerId: 3, playerNumber: 3}, {playerId: 3, playerNumber: 3}]
            };
            defaultProps.match.incidents = incidents;
            defaultProps.match.lineup = lineup;
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getTeamSubstitution(1);

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('renderSubstitution', () => {
        it('render empty when do not have subtitution data', () => {
            // Arrange
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            instance.getTeamSubstitution = jest.fn().mockReturnValue([]);
            // Act
            const result = instance.renderSubstitution();

            // Assert
            expect(result).toEqual(null);
        });

        it('render empty when do not have subtitution data', () => {
            // Arrange
            const player = [{ playerId: 1 }, { playerId: 2 }]
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            instance.getTeamSubstitution = jest.fn().mockReturnValue(player);
            // Act
            const result = instance.renderSubstitution();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('render', () => {
        it('render nothing when dont have lineup data', () => {
            // Arrange
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('render nothing when dont have lineup general data', () => {
            // Arrange
            const lineup = {generalInfo: null};
            defaultProps.match.lineup = lineup
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('render nothing when dont have lineup general data', () => {
            // Arrange
            const lineup = {generalInfo: null, home:[], away: []};
            defaultProps.match.lineup = lineup
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('render correctly when lineup dont have coach', () => {
            // Arrange
            const lineup = {
                generalInfo: {
                    homeFormation: '4-3-3',
                    awayFormation: '4-4-2'
                },
                home: [
                    {playerId: 1, playerNumber: 1, position: 1},
                    {playerId: 2, playerNumber: 2, position: 2},
                    {playerId: 3, playerNumber: 3, position: 0},
                    {playerId: 2, playerNumber: 4, position: 2}
                ],
                away: [
                    {playerId: 1, playerNumber: 1, position: 1},
                    {playerId: 2, playerNumber: 2, position: 2},
                    {playerId: 3, playerNumber: 3, position: 0},
                    {playerId: 2, playerNumber: 4, position: 2}
                ]
            }
            defaultProps.match.lineup = lineup
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when lineup dont have coach', () => {
            // Arrange
            const lineup = {
                generalInfo: {
                    homeFormation: '4-3-3',
                    awayFormation: '4-4-2',
                    homeCoach: 'homecoach',
                    awayCoach: 'awaycoach'
                },
                home: [
                    {playerId: 1, playerNumber: 1, position: 1},
                    {playerId: 2, playerNumber: 2, position: 2},
                    {playerId: 3, playerNumber: 3, position: 0},
                    {playerId: 2, playerNumber: 4, position: 2}
                ],
                away: [
                    {playerId: 1, playerNumber: 1, position: 1},
                    {playerId: 2, playerNumber: 2, position: 2},
                    {playerId: 3, playerNumber: 3, position: 0},
                    {playerId: 2, playerNumber: 4, position: 2}
                ]
            }
            defaultProps.match.lineup = lineup
            const container = shallow(<Lineups {...defaultProps}/>);
            const instance = container.instance();
            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

});