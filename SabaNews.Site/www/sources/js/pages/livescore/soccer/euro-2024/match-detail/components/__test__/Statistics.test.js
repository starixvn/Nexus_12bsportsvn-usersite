import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Statistics } from '../Statistics';
import CommonFunctions from '@jsroot/common/common-functions';

describe('Statistics', () => {
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

    describe('render', () => {
        it('render nothing when dont have statistic data', () => {
            // Arrange
            const container = shallow(<Statistics {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('render nothing when statistic property data is null', () => {
            // Arrange
            const statistic = {
                homeStatistic: null,
                awayStatistic: null
            }
            const container = shallow(<Statistics {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('render correctly when statistic property data is null', () => {
            // Arrange
            const statistic = {
                homeStatistic: {
                    controlRate: 45,
                    dangerAttack: 10,
                    shoot: 15,
                    onGoal: 2,
                    foul: 0,
                    yellowCard: 1,
                    redCard: 0,
                    offSide: 0,
                    outBall: 5,
                    cornerKick: 5,
                    freeKick: 2,
                    penaltyKick: 1
                },
                awayStatistic: {
                    controlRate: 55,
                    dangerAttack: 12,
                    shoot: 15,
                    onGoal: 1,
                    foul: 2,
                    yellowCard: 0,
                    redCard: 1,
                    offSide: 2,
                    outBall: 4,
                    cornerKick: 5,
                    freeKick: 3,
                    penaltyKick: 0
                }
            };
            defaultProps.match.statistic  = statistic;
            const container = shallow(<Statistics {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});