import React, { Fragment } from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Match from '../Match';
import Site from '@jsroot/common/site';
import CommonFunctions from '@jsroot/common/common-functions';

describe('Match', () => {
    const defaultProps = {
        match: {
            matchId: 1,
            status: 0,
            homeTeam: {
                icon: ''
            },
            awayTeam: {
                icon: ''
            },
            league: {
                Id: 1
            }
        },
        searchKey: ''
    };

    beforeEach(() => {
        Site.resolveClientUrl = jest.fn(url => url);
        CommonFunctions.isLiveMatch = jest.fn(() => false);
        CommonFunctions.getLeagueName = jest.fn(() => 'World Cup');

        CommonFunctions.getTeamName = jest.fn();
        CommonFunctions.getTeamName.mockReturnValueOnce('Belgium').mockReturnValueOnce('Croatia');

        Site.toSlug = jest.fn();
        Site.toSlug.mockReturnValueOnce('world-cup').mockReturnValueOnce('belgium').mockReturnValueOnce('croatia');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getTeamStatus', () => {
        it('return as expected when match status != Finished', () => {
            // Arrange
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
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getTeamStatus(props.match, true);

            // Assert
            expect(result).toEqual(<Fragment />);
        });
    });

    describe('getTeamName', () => {
        it('return as expected when searchKey.length = 0', () => {
            // Arrange
            CommonFunctions.getTeamName = jest.fn(() => 'Belgium');
            const container = shallow(<Match {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getTeamName({}, '');

            // Assert
            expect(result).toEqual('Belgium');
        });

        it('return as expected when searchKey.length > 0', () => {
            // Arrange
            CommonFunctions.getTeamName = jest.fn(() => 'Belgium');
            const container = shallow(<Match {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getTeamName({}, 'bel');

            // Assert
            expect(result).toEqual("<span class='text-matched'>Bel</span>gium");
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

        it('do nothing when target includes className icon-livescore', () => {
            // Arrange
            const event = {
                target: { className: 'icon-livescore' }
            };
            window.open = jest.fn();
            const container = shallow(<Match {...defaultProps} />);

            // Act
            container.find('div.group-match-item').simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual({ href: '' });
        });

        it('calls correctly functions when ctrlKey = false', () => {
            // Arrange
            const event = {
                target: { className: '' },
                ctrlKey: false
            };
            window.open = jest.fn();
            const container = shallow(<Match {...defaultProps} />);

            // Act
            container.find('div.group-match-item').simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('lich-thi-dau/bong-da/world-cup/belgium-vs-croatia/1');
        });

        it('calls correctly functions when ctrlKey = true', () => {
            // Arrange
            const event = {
                target: { className: '' },
                ctrlKey: true
            };
            window.open = jest.fn();
            const container = shallow(<Match {...defaultProps} />);

            // Act
            container.find('div.group-match-item').simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledWith('lich-thi-dau/bong-da/world-cup/belgium-vs-croatia/1', '_blank');
        });
    });

    describe('onUpdateFavouriteMatch', () => {
        it('calls correctly functions when onUpdateFavouriteMatch is function', () => {
            // Arrange
            const props = { ...defaultProps, onUpdateFavouriteMatch: jest.fn() };
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            instance.onUpdateFavouriteMatch(1);

            // Assert
            expect(props.onUpdateFavouriteMatch).toHaveBeenCalledWith(1);
        })
    });

    describe('render', () => {
        it('renders correctly when isLiveMatch = false', () => {
            // Act
            const container = shallow(<Match {...defaultProps} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('renders correctly when isLiveMatch = true', () => {
            // Arrange
            CommonFunctions.isLiveMatch = jest.fn(() => true);

            // Act
            const container = shallow(<Match {...defaultProps} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('renders correctly when isLiveMatch = true and isIntermission = true', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: { ...defaultProps.match, status: 20 }
            };
            CommonFunctions.isLiveMatch = jest.fn(() => true);

            // Act
            const container = shallow(<Match {...props} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });
    });
});