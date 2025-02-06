import React, { Fragment } from 'react';
import { shallow } from 'enzyme';
import Match from '../Match';
import CommonFunctions from '@jsroot/common/common-functions';

describe('Match', () => {
    const defaultProps = {
        match: {matchId: 1, status: 0, homeTeam: {teamId: 1, icon: 'icon'}, awayTeam: {teamId: 1, icon: 'icon'}},
    };


    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getTeamStatus', () => {
        it('return as expected when match status != Finished', () => {
            // Arrange
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('name');
            const container = shallow(<Match {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getTeamStatus(defaultProps.match, true);

            // Assert
            expect(result).toEqual(<Fragment />);
        });

        it('return as expected when match status = Finished and PenaltyScore > 0', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    status: 50,
                    homeTeamPenaltyScore: 1,
                    awayTeamPenaltyScore: 0
                }
            };
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('name');
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getTeamStatus(props.match, true);

            // Assert
            expect(result).toEqual(<li>PEN</li>);
        });

        it('return as expected when match status = Finished and isSecondLeg = true and AggregateScore > 0', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    status: 50,
                    homeTeamAggregateScore: 1,
                    awayTeamAggregateScore: 0,
                    isSecondLeg: true
                }
            };
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('name');
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getTeamStatus(props.match, true);

            // Assert
            expect(result).toEqual(<li>AGG</li>);
        });

        it('return as expected when match status = Finished and isSecondLeg = false and PenaltyScore = 0', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    status: 50,
                    isSecondLeg: false
                }
            };
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('name');
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getTeamStatus(props.match, true);

            // Assert
            expect(result).toEqual(<Fragment />);
        });
    });

    describe('onClick', () => {
        const { location } = window;

        beforeAll(() => {
            delete window.location;
            window.location = { href: '' };
        });

        afterAll(() => {
            window.location = location;
        });


        it('calls correctly functions when ctrlKey = false', () => {
            // Arrange
            const event = {
                target: { className: '' },
                ctrlKey: false
            };
            window.open = jest.fn();
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('test team name vn');
            CommonFunctions.getMatchDetailPageUrl = jest.fn().mockReturnValue('url');
            const container = shallow(<Match {...defaultProps} />);

            // Act
            container.find('.group-match-item').simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('url');
        });

        it('calls correctly functions when ctrlKey = true', () => {
            // Arrange
            const event = {
                target: { className: '' },
                ctrlKey: true
            };
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('name');
            CommonFunctions.getMatchDetailPageUrl = jest.fn().mockReturnValue('url');
            window.open = jest.fn();
            const container = shallow(<Match {...defaultProps} />);

            // Act
            container.find('div.group-match-item').simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledWith('url', '_blank');
        });
    });

    describe('renders', () => {
        it('render correctly when homeTeam win', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {startTime: '2022-10-10', status: 20, homeTeam: {teamId: 1, icon: 'icon'}, awayTeam: {teamId: 1, icon: 'icon'}}
            }
            CommonFunctions.isLiveMatch = jest.fn().mockReturnValue(true);
            CommonFunctions.getMatchResult = jest.fn().mockReturnValue(1);
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when awayTeam win', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {startTime: '2022-10-10', status: 20, homeTeam: {teamId: 1, icon: 'icon'}, awayTeam: {teamId: 1, icon: 'icon'}}
            }
            CommonFunctions.isLiveMatch = jest.fn().mockReturnValue(false);
            CommonFunctions.getMatchResult = jest.fn().mockReturnValue(2);
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('name');
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});