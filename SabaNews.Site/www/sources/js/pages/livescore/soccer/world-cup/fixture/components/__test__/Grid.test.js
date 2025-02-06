import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Grid from '../Grid';
import CommonFunctions from '@jsroot/common/common-functions';
import DateTimeService from '@jsroot/common/dateTimeService';
import Site from '@jsroot/common/site';

describe('Grid', () => {
    const defaultProps = {
        league: null,
        matches: [],
        isFinished: false
    };


    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('initSlide', () => {
        it('init state correctly when season finished', () => {
            // Arrange
            const initWindowWidth = 1026;
            window.innerWidth = 1026;
            const showItems = Math.ceil(initWindowWidth / 200) - 1;
            const props = {
                ...defaultProps,
                isFinished: true
            }
            const instance = shallow(<Grid {...props} />).instance();
            // Act
            const result = instance.initSlide();

            // Assert
            expect(result.start).toEqual(0);
            expect(result.showItems).toEqual(showItems);
        });

        it('init state correctly when season did not finish and last post-match is in last page index', () => {
            // Arrange
            const initWindowWidth = 500;
            window.innerWidth = initWindowWidth;
            const showItems = Math.ceil(initWindowWidth / 200) - 1;
            const matches = [
                { matchId: 1, status: 50 }, { matchId: 2, status: 50 }, { matchId: 3, status: 50 },
                { matchId: 2, status: 50 }, { matchId: 3, status: 50 },
                { matchId: 7, status: 50 }, { matchId: 8, status: 50 }, { matchId: 9, status: 50 }
            ];
            const props = {
                ...defaultProps,
                isFinished: false,
                matches: matches
            }
            const instance = shallow(<Grid {...props} />).instance();
            // Act
            const result = instance.initSlide();

            // Assert
            expect(result.start).toEqual(5);
            expect(result.showItems).toEqual(showItems);
        });

        it('init state correctly when season did not finish and last post-match is not in last page index', () => {
            // Arrange
            const initWindowWidth = 500;
            window.innerWidth = initWindowWidth;
            const showItems = Math.ceil(initWindowWidth / 200) - 1;
            const start = 1;
            const matches = [
                { matchId: 1, status: 50 }, { matchId: 2, status: 50 }, { matchId: 3, status: 50 },
                { matchId: 4, status: 50 }, { matchId: 2, status: 0 }, { matchId: 3, status: 0 },
                { matchId: 7, status: 0 }, { matchId: 8, status: 0 }, { matchId: 9, status: 0 }
            ];
            const props = {
                ...defaultProps,
                isFinished: false,
                matches: matches
            }
            const instance = shallow(<Grid {...props} />).instance();
            // Act
            const result = instance.initSlide();

            // Assert
            expect(result.start).toEqual(start);
            expect(result.showItems).toEqual(showItems);
        });
    });


    describe('renders', () => {
        it('render correctly when isMobile = false', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{matchId: 1}, {matchId: 2}],
                isMobile: false
            }
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when isMobile = true', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{matchId: 1}, {matchId: 2}],
                league: {leagueId: 1},
                isMobile: true
            }
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    })


});