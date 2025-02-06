import React, { Fragment } from 'react';
import { shallow } from 'enzyme';
import { MatchSummary } from '../MatchSummary';
import CommonFunctions from '@jsroot/common/common-functions';
import LangHelper from '@jsroot/common/langHelper';

describe('MatchSummary', () => {
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

    describe('checkIncidentMainTimeEventType', () => {
        it('return false when incident type is finished', () => {
            // Arrange
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.checkIncidentMainTimeEventType(50);

            // Assert
            expect(result).toEqual(false);
        });

        it('return false when incident type is End', () => {
            // Arrange
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.checkIncidentMainTimeEventType(12);

            // Assert
            expect(result).toEqual(true);
        });


        it('return false when incident type is Halftime', () => {
            // Arrange
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.checkIncidentMainTimeEventType(11);

            // Assert
            expect(result).toEqual(true);
        });
        it('return false when incident type is ExtraTimeEnd', () => {
            // Arrange
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.checkIncidentMainTimeEventType(26);

            // Assert
            expect(result).toEqual(true);
        });
    });

    describe('mappingIncidentTimeEventType', () => {
        it('return empty when incident type is not main time event', () =>{
            // Arrange
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.mappingIncidentTimeEventType(1);

            // Assert
            expect(result).toEqual('');
        });

        it('return correct when incident type is GameStart', () =>{
            // Arrange
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.mappingIncidentTimeEventType(10);

            // Assert
            expect(result).toEqual(LangHelper.getResource('GameStart'));
        });

        it('return correct when incident type is Halftime', () =>{
            // Arrange
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.mappingIncidentTimeEventType(11);

            // Assert
            expect(result).toEqual(LangHelper.getResource('HalftimeEnd'));
        });

        it('return correct when incident type is End', () =>{
            // Arrange
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.mappingIncidentTimeEventType(12);

            // Assert
            expect(result).toEqual(LangHelper.getResource('FullTimeEnd'));
        });

        it('return correct when incident type is ExtraTimeEnd', () =>{
            // Arrange
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.mappingIncidentTimeEventType(26);

            // Assert
            expect(result).toEqual(LangHelper.getResource('ExtraTimeEnd'));
        });

        it('return correct when incident type is PenaltyShootoutEnd', () =>{
            // Arrange
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.mappingIncidentTimeEventType(27);

            // Assert
            expect(result).toEqual(LangHelper.getResource('PenaltyShootoutEnd'));
        });
    });

    describe('renderFinishStatus', () => {
        it('render correctly when match dont have both extrascore and penalty score', () => {
            // Arrange
            const generalInfo = {
                matchId: 1,
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 2,
                homeTeamPenaltyScore: 0,
                awayTeamPenaltyScore: 0
            };
            defaultProps.match.generalInfo = generalInfo;
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.renderFinishStatus();

            // Assert
            expect(result).toMatchSnapshot();
        });
        it('render correctly when match have both extrascore and penalty score', () => {
            // Arrange
            const generalInfo = {
                matchId: 1,
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 2,
                homeTeamExtraScore: 3,
                awayTeamExtraScore: 4,
                homeTeamPenaltyScore: 3,
                awayTeamPenaltyScore: 3
            };
            defaultProps.match.generalInfo = generalInfo;
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.renderFinishStatus();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('getPenaltyShootout', () => {
        it('return correctly when incident type is not penalty shootout', () => {
            // Arrange
            const incident = {position: 0, type: 11};
            let penaltyShootOutData = {
                homeType: null,
                homePlayerName: null,
                awayType: null,
                awayPlayerName: null,
                score: null
            };
            const homePenaltyShootoutScore = 0;
            const awayPenaltyShootoutScore = 0;
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();
            instance.getPenaltyShootout
            // Act
            const result = instance.getPenaltyShootout(incident, penaltyShootOutData, homePenaltyShootoutScore, awayPenaltyShootoutScore);

            // Assert
            expect(result.homePenaltyShootoutScore).toEqual(0);
            expect(result.awayPenaltyShootoutScore).toEqual(0);
            expect(result.penaltyShootOutData).toEqual(penaltyShootOutData);
        });

        it('return correctly when home team have penalty shootout event', () => {
            // Arrange
            const incident = {position: 1, type: 8, playerName: 'name'};
            let penaltyShootOutData = {
                homeType: null,
                homePlayerName: null,
                awayType: null,
                awayPlayerName: null,
                score: null
            };
            const homePenaltyShootoutScore = 0;
            const awayPenaltyShootoutScore = 0;
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getPenaltyShootout(incident, penaltyShootOutData, homePenaltyShootoutScore, awayPenaltyShootoutScore);

            // Assert
            expect(result.homePenaltyShootoutScore).toEqual(1);
            expect(result.awayPenaltyShootoutScore).toEqual(0);
            expect(result.penaltyShootOutData.homeType).toEqual(incident.type);
        });

        it('return correctly when home team fail penalty shootout event', () => {
            // Arrange
            const incident = {position: 1, type: 16, playerName: 'name'};
            let penaltyShootOutData = {
                homeType: null,
                homePlayerName: null,
                awayType: null,
                awayPlayerName: null,
                score: null
            };
            const homePenaltyShootoutScore = 0;
            const awayPenaltyShootoutScore = 0;
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getPenaltyShootout(incident, penaltyShootOutData, homePenaltyShootoutScore, awayPenaltyShootoutScore);

            // Assert
            expect(result.homePenaltyShootoutScore).toEqual(0);
            expect(result.awayPenaltyShootoutScore).toEqual(0);
            expect(result.penaltyShootOutData.homeType).toEqual(incident.type);
        });

        it('return correctly when away team have penalty shootout event', () => {
            // Arrange
            const incident = {position: 2, type: 8, playerName: 'name'};
            let penaltyShootOutData = {
                homeType: null,
                homePlayerName: null,
                awayType: null,
                awayPlayerName: null,
                score: null
            };
            const homePenaltyShootoutScore = 0;
            const awayPenaltyShootoutScore = 0;
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getPenaltyShootout(incident, penaltyShootOutData, homePenaltyShootoutScore, awayPenaltyShootoutScore);

            // Assert
            expect(result.homePenaltyShootoutScore).toEqual(0);
            expect(result.awayPenaltyShootoutScore).toEqual(1);
            expect(result.penaltyShootOutData.awayType).toEqual(incident.type);
        });

        it('return correctly when home team fail penalty shootout event', () => {
            // Arrange
            const incident = {position: 2, type: 16, playerName: 'name'};
            let penaltyShootOutData = {
                homeType: null,
                homePlayerName: null,
                awayType: null,
                awayPlayerName: null,
                score: null
            };
            const homePenaltyShootoutScore = 0;
            const awayPenaltyShootoutScore = 0;
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getPenaltyShootout(incident, penaltyShootOutData, homePenaltyShootoutScore, awayPenaltyShootoutScore);

            // Assert
            expect(result.homePenaltyShootoutScore).toEqual(0);
            expect(result.awayPenaltyShootoutScore).toEqual(0);
            expect(result.penaltyShootOutData.awayType).toEqual(incident.type);
        });
    });

    describe('checkRenderPenaltyShootout', () => {
        it('return false when penalty shootout is null', () => {
            // Arrange
            const penaltyShootOutData = null;
            const hasPenaltyShootout = false
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.checkRenderPenaltyShootout(penaltyShootOutData, hasPenaltyShootout);

            // Assert
            expect(result).toEqual(false);
        });

        it('return false when penalty shootout property is null', () => {
            // Arrange
            const penaltyShootOutData = {
                homeType: null,
                homePlayerName: null,
                awayType: null,
                awayPlayerName: null,
                score: null
            };
            const hasPenaltyShootout = false
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.checkRenderPenaltyShootout(penaltyShootOutData, hasPenaltyShootout);

            // Assert
            expect(result).toEqual(false);
        });

        it('return true when have penalty shootout data', () => {
            // Arrange
            const penaltyShootOutData = {
                homeType: 8,
                homePlayerName: "name 1",
                awayType: 16,
                awayPlayerName: "name 2",
                score: "3-2"
            };
            const hasPenaltyShootout = true
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.checkRenderPenaltyShootout(penaltyShootOutData, hasPenaltyShootout);

            // Assert
            expect(result).toEqual(true);
        });
    });

    describe('getMainTimeScore', () => {
        it('return correctly when incident type is not main time', () => {
            // Arrange
            const type = 1;
            const score = '';
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getMainTimeScore(type, score);

            // Assert
            expect(result).toEqual(score);
        });

        it('return correctly when incident type is Halftime', () => {
            // Arrange
            const generalInfo = {
                matchId: 1,
                homeTeamHalfScore: 1,
                awayTeamHalfScore: 2,
                homeTeamTotalScore: 3,
                awayTeamTotalScore: 4
            };
            defaultProps.match.generalInfo = generalInfo;
            const type = 11;
            const score = '';
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

           // Act
           const result = instance.getMainTimeScore(type, score);

           // Assert
           expect(result).toEqual('1 -  2');
       });

       it('return correctly when incident type is End', () => {
            // Arrange
            const generalInfo = {
                matchId: 1,
                homeTeamHalfScore: 1,
                awayTeamHalfScore: 2,
                homeTeamTotalScore: 3,
                awayTeamTotalScore: 4
            };
            defaultProps.match.generalInfo = generalInfo;
            const type = 12;
            const score = '';
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getMainTimeScore(type, score);

            // Assert
            expect(result).toEqual('3 -  4');
        });
    });

    describe('checkRenderMainTimeEvent', () => {
        it('return false when incident type is not main time event', () => {
            // Arrange
            const incident = {type: 1};
            const lastIncident = {type: 1}
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.checkRenderMainTimeEvent(incident, lastIncident);
            instance.checkIncidentMainTimeEventType = jest.fn().mockReturnValue(false);
            // Assert
            expect(result).toEqual(false);
        });

        it('return false when last incident type is end match event', () => {
            // Arrange
            const incident = {type: 12};
            const lastIncident = {type: 12}
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.checkRenderMainTimeEvent(incident, lastIncident);
            instance.checkIncidentMainTimeEventType = jest.fn().mockReturnValue(true);
            // Assert
            expect(result).toEqual(false);
        });

        it('return true when incident type is main time event', () => {
            // Arrange
            const incident = {type: 11};
            const lastIncident = {type: 11}
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.checkRenderMainTimeEvent(incident, lastIncident);
            instance.checkIncidentMainTimeEventType = jest.fn().mockReturnValue(true);
            // Assert
            expect(result).toEqual(true);
        });
    });

    describe('renderPenaltyShootout', () => {
        it('return null when incident not have penalty shootout data', () => {
            // Arrange
            const incidents = [
                { matchId: 1, position: 0, type: 10, time: 1, second: 34, homeScore: 0, awayScore: 0},
                { matchId: 1, position: 1, type: 1, time: 10, second: 100, homeScore: 1, awayScore: 0},
                { matchId: 1, position: 0, type: 11, time: 12, second:150, homeScore: 0, awayScore: 0},
                { matchId: 1, position: 2, type: 9, time: 15, second: 500, homeScore: 1, awayScore: 0},
                { matchId: 1, position: 0, type: 12, time: 20, second: 600, homeScore: 1, awayScore: 0},
                { matchId: 1, position: 1, type: 8, playerName: "name 1", inPlayerId: 3, time: 16, second: 550, homeScore: 1, awayScore: 1},
                { matchId: 1, position: 2, type: 16, playerName: "name 2", inPlayerId: 3, time: 16, second: 550, homeScore: 1, awayScore: 1},
            ];
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.renderPenaltyShootout(incidents);
            // Assert
            expect(result).toEqual(null);
        });
    });

    describe('renderPenaltyShootout', () => {
        it('render correctly when when home shootout > away shootout', () => {
            // Arrange
            const incidents = [
                { matchId: 1, position: 1, type: 8, playerName: "name 1", homeScore: 0, awayScore: 0, isPenaltyShootout: true},
                { matchId: 1, position: 2, type: 16, playerName: "name 2", homeScore: 0, awayScore: 0, isPenaltyShootout: true},
                { matchId: 1, position: 1, type: 16, playerName: "name 3", homeScore: 0, awayScore: 0, isPenaltyShootout: true},
                { matchId: 1, position: 2, type: 8, playerName: "name 4", homeScore: 0, awayScore: 0, isPenaltyShootout: true},
                { matchId: 1, position: 1, type: 8, playerName: "name 5", homeScore: 0, awayScore: 0, isPenaltyShootout: true},
            ];
            CommonFunctions.getTeamName = jest.fn().mockReturnValue("name");
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.renderPenaltyShootout(incidents);
            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when away shootout > home shootout', () => {
            // Arrange
            const incidents = [
                { matchId: 1, position: 2, type: 8, playerName: "name 1", homeScore: 0, awayScore: 0, isPenaltyShootout: true},
                { matchId: 1, position: 1, type: 16, playerName: "name 2", homeScore: 0, awayScore: 0, isPenaltyShootout: true},
                { matchId: 1, position: 1, type: 16, playerName: "name 3", homeScore: 0, awayScore: 0, isPenaltyShootout: true},
                { matchId: 1, position: 2, type: 8, playerName: "name 4", homeScore: 0, awayScore: 0, isPenaltyShootout: true},
                { matchId: 1, position: 2, type: 8, playerName: "name 5", homeScore: 0, awayScore: 0, isPenaltyShootout: true},
            ];
            CommonFunctions.getTeamName = jest.fn().mockReturnValue("name");
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.renderPenaltyShootout(incidents);
            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when away shootout = home shootout', () => {
            // Arrange
            const incidents = [
                { matchId: 1, position: 1, type: 8, playerName: "name 1", homeScore: 0, awayScore: 0, isPenaltyShootout: true},
                { matchId: 1, position: 2, type: 16, playerName: "name 2", homeScore: 0, awayScore: 0, isPenaltyShootout: true},
                { matchId: 1, position: 1, type: 16, playerName: "name 3", homeScore: 0, awayScore: 0, isPenaltyShootout: true},
                { matchId: 1, position: 2, type: 8, playerName: "name 4", homeScore: 0, awayScore: 0, isPenaltyShootout: true},
            ];
            CommonFunctions.getTeamName = jest.fn().mockReturnValue("name");
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.renderPenaltyShootout(incidents);
            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('renderLastShootout', () => {
        it('return expected component when lastHome is not null and type = penalty success', () => {
             // Arrange
            const lasthome = { matchId: 1, position: 1, type: 8, playerName: "name 1", homeScore: 0, awayScore: 0, isPenaltyShootout: true};
            const lastAway = null;
            CommonFunctions.getTeamName = jest.fn().mockReturnValue("name");
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.renderLastShootout(lasthome, lastAway, 0, 0);
            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return expected component when lastHome is not null and type = penalty success', () => {
            // Arrange
           const lasthome = { matchId: 1, position: 1, type: 16, playerName: "name 1", homeScore: 0, awayScore: 0, isPenaltyShootout: true};
           const lastAway = null;
           CommonFunctions.getTeamName = jest.fn().mockReturnValue("name");
           const container = shallow(<MatchSummary {...defaultProps}/>);
           const instance = container.instance();

           // Act
           const result = instance.renderLastShootout(lasthome, lastAway, 0, 0);
           // Assert
           expect(result).toMatchSnapshot();
       });

        it('return expected component when lastAway is not null and type = penalty success', () => {
            // Arrange
           const lasthome = null;
           const lastAway = { matchId: 1, position: 1, type: 8, playerName: "name 1", homeScore: 0, awayScore: 0, isPenaltyShootout: true};
           CommonFunctions.getTeamName = jest.fn().mockReturnValue("name");
           const container = shallow(<MatchSummary {...defaultProps}/>);
           const instance = container.instance();

           // Act
           const result = instance.renderLastShootout(lasthome, lastAway, 0, 0);
           // Assert
           expect(result).toMatchSnapshot();
       });

       it('return expected component when lastAway is not null and type = penalty failed', () => {
        // Arrange
       const lasthome = null;
       const lastAway = { matchId: 1, position: 1, type: 16, playerName: "name 1", homeScore: 0, awayScore: 0, isPenaltyShootout: true};
       CommonFunctions.getTeamName = jest.fn().mockReturnValue("name");
       const container = shallow(<MatchSummary {...defaultProps}/>);
       const instance = container.instance();

       // Act
       const result = instance.renderLastShootout(lasthome, lastAway, 0, 0);
       // Assert
       expect(result).toMatchSnapshot();
   });

       it('return expected component when lastAway is null and lastHome is null', () => {
            // Arrange
           const lasthome = null;
           const lastAway = null;
           CommonFunctions.getTeamName = jest.fn().mockReturnValue("name");
           const container = shallow(<MatchSummary {...defaultProps}/>);
           const instance = container.instance();

           // Act
           const result = instance.renderLastShootout(lasthome, lastAway, 0, 0);
           // Assert
           expect(result).toEqual(<Fragment />);
       });
    });

    describe('render', () => {
        it('render nothing when incidents is null', () => {
            // Arrange
            defaultProps.match.incidents = null;
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('render nothing when match is preMatch', () => {
            // Arrange
            const container = shallow(<MatchSummary {...defaultProps}/>);
            const instance = container.instance();
            instance.renderPenaltyShootout = jest.fn().mockReturnValue('penalty');
            CommonFunctions.isPreMatch = jest.fn().mockReturnValue(true)
            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });


        it('render correctly when incidents have all type', () => {
            // Arrange
            const incidents = [
                { matchId: 1, position: 0, type: 10, time: 1, second: 34, homeScore: 0, awayScore: 0},
                { matchId: 1, position: 1, type: 1, time: 10, second: 100, homeScore: 1, awayScore: 0},
                { matchId: 1, position: 0, type: 11, time: 12, second:150, homeScore: 0, awayScore: 0},
                { matchId: 1, position: 2, type: 9, time: 15, second: 500, homeScore: 1, awayScore: 0},
                { matchId: 1, position: 0, type: 12, time: 20, second: 600, homeScore: 1, awayScore: 0},
                { matchId: 1, position: 1, type: 8, playerName: "name 1", inPlayerId: 3, time: 16, second: 550, homeScore: 0, awayScore: 0},
                { matchId: 1, position: 2, type: 16, playerName: "name 2", inPlayerId: 3, time: 16, second: 550, homeScore: 0, awayScore: 0},
            ];
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    generalInfo: {
                        matchId: 1,
                        status:50,
                        homeTeamTotalScore: 1,
                        awayTeamTotalScore: 2,
                        homeTeamHalfScore: 0,
                        awayTeamHalfScore: 0,
                        homeTeamExtraScore: 3,
                        awayTeamExtraScore: 4,
                        homeTeamPenaltyScore: 3,
                        awayTeamPenaltyScore: 3
                    },
                    incidents: incidents
                }
            }
            const container = shallow(<MatchSummary {...props}/>);
            const instance = container.instance();
            instance.checkRenderPenaltyShootout = jest.fn().mockReturnValue(true);
            instance.renderPenaltyShootout = jest.fn().mockReturnValue('penalty');
            CommonFunctions.produceIncidents = jest.fn().mockReturnValue(incidents);
            CommonFunctions.isPreMatch = jest.fn().mockReturnValue(false);

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
})