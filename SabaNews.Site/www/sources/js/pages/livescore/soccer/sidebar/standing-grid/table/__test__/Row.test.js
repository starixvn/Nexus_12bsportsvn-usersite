import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Row from '../Row';
import CommonFunctions from '@jsroot/common/common-functions';

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

        // Act
        const container = shallow(<Row {...defaultProps} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
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

        // Act
        const container = shallow(<Row {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when isMobile = false', () => {
        // Arrange
        const props = {
            ...defaultProps,
            isMobile: false
        };

        // Act
        const container = shallow(<Row {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });


    it('renders correctly when isMobile = true', () => {
        // Arrange
        const props = {
            ...defaultProps,
            isMobile: true
        };

        // Act
        const container = shallow(<Row {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });
});