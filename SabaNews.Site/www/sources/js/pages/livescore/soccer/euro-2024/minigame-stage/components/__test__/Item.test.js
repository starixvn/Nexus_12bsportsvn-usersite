import React from 'react';
import { shallow } from 'enzyme';
import { Item }  from '../Item';
import CommonFunctions from '@jsroot/common/common-functions';
import DateTimeService from '@jsroot/common/dateTimeService';
import DataService from '@jsroot/common/dataService';
describe('Item', () => {
    const defaultProps = {
        votes: [{matchId: 1}],
        teams: [],
        match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 2}},
        result: null,
        updateVote:  jest.fn().mockImplementation(() => Promise.resolve()),
        getVotes: jest.fn()
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        window.stage = 1;
        CommonFunctions.getTeamName = jest.fn().mockReturnValue('team');
        CommonFunctions.getTeamIcon = jest.fn().mockReturnValue('icon');
    })

    describe('checkVoteOption', () => {
        it('return correctly when vote is draw', () => {
            // Arrange
            defaultProps.votes = [{matchId: 1, teamId: 0, stage: 1}];
            const container = shallow(<Item {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.checkVoteOption();

            // Assert
            expect(result).toEqual(0);
        });

        it('return correctly when vote homeTeam', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 2}},
                votes: [{matchId: 1, teamId: 1, stage: 1}]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.checkVoteOption();

            // Assert
            expect(result).toEqual(1);
        });

        it('return correctly when vote awayTeam', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 2}},
                votes: [{matchId: 1, teamId: 2, stage: 1}]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.checkVoteOption();

            // Assert
            expect(result).toEqual(2);
        });

        it('return correctly when vote awayTeam', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 2}},
                votes: []
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.checkVoteOption();

            // Assert
            expect(result).toEqual(null);
        });
    });

    describe('checkKnockoutMatch', () => {
        it('return correctly when match is not knockout', () => {
            // Arrange
            window.stage = 1;
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 2}, status: 50},
                votes: [{matchId: 1, teamId: 2}]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.checkKnockoutMatch();

            // Assert
            expect(result).toEqual(true);
        });

        it('return correctly when match is knockout match & team correct', () => {
            // Arrange
            window.stage = 2;
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 2}, status: 0},
                votes: [{matchId: 1, teamId: 2}],
                teams: [1, 2, 3, 4]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.checkKnockoutMatch();

            // Assert
            expect(result).toEqual(true);
        });


        it('return correctly when match is knockout match & team not correct', () => {
            // Arrange
            window.stage = 2;
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
                votes: [{matchId: 1, teamId: 2}],
                teams: [1, 2, 3, 4]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.checkKnockoutMatch();

            // Assert
            expect(result).toEqual(false);
        });
    });


    describe('handleVoteTeam', () => {
        it('return correctly when stage = 2 & vote draw', () => {
            // Arrange
            window.stage = 2;
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
                votes: [{matchId: 1, teamId: 0}],
                teams: [1, 2, 3, 4]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.handleVoteTeam(0);

            // Assert
            expect(result).toEqual(undefined);
        });

        it('return correctly when voted old team', () => {
            // Arrange
            window.stage = 1;
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
                votes: [{matchId: 1, teamId: 1, stage: 1}],
                teams: [1, 2, 3, 4]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.handleVoteTeam(1);

            // Assert
            expect(result).toEqual(undefined);
        });
        it('return correctly when stage = 2 & vote teamId', () => {
            // Arrange
            window.stage = 2;
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId:2}, status:0, startTime:'2024-05-20 2:00:00'},
                votes: [{matchId: 1, teamId: 1}],
                teams: [1, 2, 3, 4]
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2024-05-19 2:00:00');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.handleVoteTeam(1);

            // Assert
            expect(props.updateVote).toHaveBeenCalled();
        });
        

        it('return correctly when match is finished', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 2}, status: 50},
                votes: [{matchId: 1, teamId: 1}],
                teams: [1, 2, 3, 4]
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-11 2:00:00');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();
            DataService.postDataAsync = jest.fn(() => promise);
            instance.checkKnockoutMatch = jest.fn().mockReturnValue(false);


            // Act
            const result = instance.handleVoteTeam(2);

            // Assert
            expect(result).toEqual(undefined);
        });

        it('return correctly when match startTime < 30m', () => {
            // Arrange
            window.stage = 1;
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 2}, status: 0, startTime: '2024-05-20 7:00:00'},
                votes: [{matchId: 1, teamId: 1}],
                teams: [1, 2, 3, 4]
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2024-05-20 13:30:00');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();
            DataService.postDataAsync = jest.fn(() => promise);
            instance.checkKnockoutMatch = jest.fn().mockReturnValue(true);


            // Act
            const result = instance.handleVoteTeam(2);

            // Assert
            expect(result).toEqual(undefined);
        });

        it('return correctly when match is live', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 2}, status: 10},
                votes: [{matchId: 1, teamId: 1}],
                teams: [1, 2, 3, 4]
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-09 2:00:00');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();
            DataService.postDataAsync = jest.fn(() => promise);
            instance.checkKnockoutMatch = jest.fn().mockReturnValue(false);


            // Act
            const result = instance.handleVoteTeam(2);

            // Assert
            expect(result).toEqual(undefined);
            
        });
        

    });

    describe('getVoteTeam', () => {
        it('return correctly when vote = 1', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
                vote: {matchId: 1, teamId: 1},
                teams: [1, 2, 3, 4]
            }
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('homeTeam');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getVoteTeam(1);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when vote = 2', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
                vote: {matchId: 1, teamId: 1},
                teams: [1, 2, 3, 4]
            }
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('homeTeam');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getVoteTeam(2);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when vote = 0', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
                vote: {matchId: 1, teamId: 1},
                teams: [1, 2, 3, 4]
            }
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('homeTeam');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getVoteTeam(0);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when vote > 2', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
                vote: {matchId: 1, teamId: 1},
                teams: [1, 2, 3, 4]
            }
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('homeTeam');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getVoteTeam(4);

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('checkDisabledVote', () => {
        it('disabled vote when match is finished', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, status: 50, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
            }
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('homeTeam');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.checkDisabledVote();

            // Assert
            expect(result).toEqual(true);
        });

        it('disabled vote when match is start into 30m', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, status: 0, startTime: '2022-10-10 10:00:00', homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-10 16:50:00')
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('homeTeam');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.checkDisabledVote();

            // Assert
            expect(result).toEqual(true);
        });

        it('enable vote when knockout match is votable', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, status: 0, startTime: '2022-10-10 10:00:00', homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-10 10:50:00')
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('homeTeam');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();
            instance.checkKnockoutMatch = jest.fn().mockReturnValue(true);

            // Act
            const result = instance.checkDisabledVote();

            // Assert
            expect(result).toEqual(false);
        });

        it('return disabled vote when knockout match is unvotable', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, status: 0, startTime: '2022-10-10 10:00:00', homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-10 10:50:00')
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('homeTeam');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();
            instance.checkKnockoutMatch = jest.fn().mockReturnValue(false);

            // Act
            const result = instance.checkDisabledVote();

            // Assert
            expect(result).toEqual(true);
        });
    });

    describe('renders', () => {
        it('render correctly when vote homeTeam', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
                vote: {matchId: 1, teamId: 1},
                teams: [1, 2, 3, 4]
            }
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('homeTeam');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();
            instance.checkVoteOption = jest.fn().mockReturnValue(1)

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when vote awayTeam', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
                vote: {matchId: 1, teamId: 1},
                teams: [1, 2, 3, 4],
                number: 1
            }
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('homeTeam');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();
            instance.checkVoteOption = jest.fn().mockReturnValue(2)

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when vote draw', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
                vote: {matchId: 1, teamId: 1},
                teams: [1, 2, 3, 4],
                number: 10
            }
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('homeTeam');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();
            instance.checkVoteOption = jest.fn().mockReturnValue(0)

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly and call exacly function', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
                vote: {matchId: 1, teamId: 1},
                teams: [1, 2, 3, 4],
                number: 10
            }
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('homeTeam');
            const container = shallow(<Item {...props} />);


            // Assert
            container.find('.statistic-team-home').simulate('click', 1);
            container.find('.statistic-draw').simulate('click', 0);
            container.find('.statistic-team-away').simulate('click', 6);
        });
    });
});