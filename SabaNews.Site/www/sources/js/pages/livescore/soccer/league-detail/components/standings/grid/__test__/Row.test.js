import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Row from '../Row';
import CommonFunctions from '@jsroot/common/common-functions';
import * as funcs from '../functions';

describe('Row', () => {
    const defaultProps = {
        team: {
            teamId: 1,
            icon: '',
            position: 1,
            total: 5,
            won: 4,
            draw: 1,
            loss: 0,
            goals: 10,
            goalsAgainst: 9,
            goalDiff: 1,
            points: 30,
            matches: [{ matchId: 1 }, { matchId: 2 }, { matchId: 3 }, { matchId: 4 }, { matchId: 5 }, { matchId: 6 }]
        },
        isMobile: false
    };

    beforeAll(() => {
        CommonFunctions.getTeamName = jest.fn(() => 'Belgium');
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('renders correctly when promotion = null', () => {
        // Arrange
        funcs.getMatchResult = jest.fn(() => 'W');

        // Act
        const container = shallow(<Row {...defaultProps} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
        expect(funcs.getMatchResult).toHaveBeenCalledTimes(5);
    });

    it('renders correctly when promotion != null', () => {
        // Arrange
        const props = {
            ...defaultProps,
            team: {
                ...defaultProps.team,
                promotion: { Color: '#111' }
            }
        };
        funcs.getMatchResult = jest.fn(() => 'W');

        // Act
        const container = shallow(<Row {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
        expect(funcs.getMatchResult).toHaveBeenCalledTimes(5);
    });

    it('renders correctly when isMobile = true', () => {
        // Arrange
        const props = {
            ...defaultProps,
            isMobile: true
        };
        funcs.getMatchResult = jest.fn(() => 'W');

        // Act
        const container = shallow(<Row {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
        expect(funcs.getMatchResult).toHaveBeenCalledTimes(0);
    });
});