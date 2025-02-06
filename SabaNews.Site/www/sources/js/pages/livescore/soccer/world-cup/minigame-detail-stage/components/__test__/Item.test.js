import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Item }  from '../Item';
import CommonFunctions from '@jsroot/common/common-functions';
import DateTimeService from '@jsroot/common/dateTimeService';
import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';

describe('Item', () => {
    const defaultProps = {
        votes: [],
        vote: {teamId: 1, matchId: 1},
        teams: [],
        match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 2}},
        result: null,
        updateVote: jest.fn(),
        getVotes: jest.fn()
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        CommonFunctions.getTeamName = jest.fn().mockReturnValue('team');
        CommonFunctions.getTeamIcon = jest.fn().mockReturnValue('icon');
    })

    describe('checkVoteOption', () => {
        it('return correctly when vote is draw', () => {
            // Arrange
            defaultProps.vote = {matchId: 1, teamId: 0};
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
                vote: {matchId: 1, teamId: 1}
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
                vote: {matchId: 1, teamId: 2}
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
                vote: null
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
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 2}},
                vote: {matchId: 1, teamId: 2}
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.checkKnockoutMatch();

            // Assert
            expect(result).toEqual(false);
        });

        it('return correctly when match is knockout match & team correct', () => {
            // Arrange
            window.stage = 4;
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 2}},
                vote: {matchId: 1, teamId: 2},
                teams: [1, 2, 3, 4]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.checkKnockoutMatch();

            // Assert
            expect(result).toEqual(false);
        });


        it('return correctly when match is knockout match & team not correct', () => {
            // Arrange
            window.stage = 4;
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
                vote: {matchId: 1, teamId: 2},
                teams: [1, 2, 3, 4]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.checkKnockoutMatch();

            // Assert
            expect(result).toEqual(true);
        });
    });

    describe('handleVote', () => {
        it('return correctly when stage = 4 & vote draw', () => {
            // Arrange
            window.stage = 4;
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
                vote: {matchId: 1, teamId: 0},
                teams: [1, 2, 3, 4]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.handleVote(0);

            // Assert
            expect(result).toEqual(Promise.resolve({}));
        });

        it('return correctly when voted old team', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
                vote: {matchId: 1, teamId: 1},
                teams: [1, 2, 3, 4]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.handleVote(1);

            // Assert
            expect(result).toEqual(Promise.resolve({}));
        });

        it('return correctly when match is finished', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 2}},
                vote: {matchId: 1, teamId: 1},
                teams: [1, 2, 3, 4]
            }
            const response = {
                data: {
                    matchId: 1,
                    status: 50,
                    startTime: '2022-10-10 8:00:00'
                }
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-11 2:00:00');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            instance.checkKnockoutMatch = jest.fn().mockReturnValue(true);


            // Act
            const result = instance.handleVote(2);

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('/worldcup2022/GetMinigameVoteMatch', {matchId: 1});
            expect(result).toEqual(Promise.resolve({}));
        });

        it('return correctly when match is not started', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 2}},
                vote: {matchId: 1, teamId: 1},
                teams: [1, 2, 3, 4]
            }
            const response = {
                data: {
                    matchId: 1,
                    status: 0,
                    startTime: '2022-10-10 8:00:00'
                }
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-09 2:00:00');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            instance.checkKnockoutMatch = jest.fn().mockReturnValue(false);


            // Act
            const result = instance.handleVote(2);

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('/worldcup2022/GetMinigameVoteMatch', {matchId: 1});
        });

    });

    describe('getTeamVote', () => {
        it('return correctly when vote homeTeam', () => {
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
            const result = instance.getTeamVote();

            // Assert
            expect(result).toEqual('homeTeam');
        });

        it('return correctly when vote homeTeam', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
                vote: {matchId: 1, teamId: 6},
                teams: [1, 2, 3, 4]
            }
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('awayTeam');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getTeamVote();

            // Assert
            expect(result).toEqual('awayTeam');
        });

        it('return correctly when vote homeTeam', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
                vote: null,
                teams: [1, 2, 3, 4]
            }
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('awayTeam');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getTeamVote();

            // Assert
            expect(result).toEqual('');
        });

        it('return correctly when vote homeTeam', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
                vote: {matchId: 1, teamId: 0},
                teams: [1, 2, 3, 4]
            }
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('awayTeam');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getTeamVote();

            // Assert
            expect(result).toEqual('Hòa');
        });
    });

    describe('getVoteResult', () => {
        it('return correcly when vote match not finish', () => {
            // Arrange
            const match = {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}};
            const props = {
                ...defaultProps,
                match: match,
                vote: {matchId: 1, teamId: 0},
                teams: [1, 2, 3, 4]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getVoteResult(match, null);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correcly when vote correctly', () => {
            // Arrange
            const match = {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}};
            const props = {
                ...defaultProps,
                match: match,
                vote: {matchId: 1, teamId: 0},
                teams: [1, 2, 3, 4]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getVoteResult(match, { status: true});

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correcly when vote incorrectly', () => {
            // Arrange
            const match = {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}};
            const props = {
                ...defaultProps,
                match: match,
                vote: {matchId: 1, teamId: 0},
                teams: [1, 2, 3, 4]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getVoteResult(match, { status: false});

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correcly when match is finished & result is null', () => {
            // Arrange
            const match = {matchId: 1, status: 50, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}};
            const props = {
                ...defaultProps,
                match: match,
                vote: {matchId: 1, teamId: 0},
                teams: [1, 2, 3, 4]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getVoteResult(match, null);

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('getVoteScore', () => {
        it('return correctly when match not finished', () => {
             // Arrange
             const match = {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}};
             const props = {
                ...defaultProps,
                match: match,
                vote: {matchId: 1, teamId: 0},
                teams: [1, 2, 3, 4]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getVoteScore(match, null);

            // Assert
            expect(result).toEqual(<></>);
        });

        it('return correctly when vote correctly', () => {
            // Arrange
            const match = {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}};
            const props = {
               ...defaultProps,
               match: match,
               vote: {matchId: 1, teamId: 0},
               teams: [1, 2, 3, 4]
           }
           const container = shallow(<Item {...props} />);
           const instance = container.instance();

           // Act
           const result = instance.getVoteScore(match, {status: true, score: 10});

           // Assert
           expect(result).toEqual(<span>+10</span>);
       });

        it('return correctly when vote incorrectly', () => {
            // Arrange
            const match = {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}};
            const props = {
                ...defaultProps,
                match: match,
                vote: {matchId: 1, teamId: 0},
                teams: [1, 2, 3, 4]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getVoteScore(match, {status: false, score: 0});

            // Assert
            expect(result).toEqual(<span>0</span>);
        });
        it('return correctly when match is finished & result is null', () => {
            // Arrange
            const match = {matchId: 1, status: 50, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}};
            const props = {
                ...defaultProps,
                match: match,
                vote: {matchId: 1, teamId: 0},
                teams: [1, 2, 3, 4]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getVoteScore(match, null);

            // Assert
            expect(result).toEqual(<span>0</span>);
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
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

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
               vote: {matchId: 1, teamId: 6},
               teams: [1, 2, 3, 4]
           }
           const container = shallow(<Item {...props} />);
           const instance = container.instance();

           // Act
           const result = instance.render();

           // Assert
           expect(result).toMatchSnapshot();
        });

        it('render correctly when vote draw ', () => {
            // Arrange
            const props = {
               ...defaultProps,
               match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
               vote: {matchId: 1, teamId: 0},
               teams: [1, 2, 3, 4]
           }
           const container = shallow(<Item {...props} />);
           const instance = container.instance();

           // Act
           const result = instance.render();

           // Assert
           expect(result).toMatchSnapshot();
        });

        it('call correctly functions ', () => {
            // Arrange
            const props = {
               ...defaultProps,
               match: {matchId: 1, homeTeam: {teamId: 1}, awayTeam: {teamId: 6}},
               vote: {matchId: 1, teamId: 0},
               teams: [1, 2, 3, 4]
           }

           // Act
           const container = shallow(<Item {...props} />);

           // Assert
           container.find('.minigame-team.home-team').simulate('click', 1);
           container.find('.minigame-team').at(1).simulate('click', 0);
           container.find('.minigame-team.away-team').simulate('click', 6);
        });
    });
});