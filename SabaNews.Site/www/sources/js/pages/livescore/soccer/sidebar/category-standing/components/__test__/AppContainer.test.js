import React from 'react';
import { shallow } from 'enzyme';
import { AppContainer } from '../AppContainer';
import DateTimeService from '@jsroot/common/dateTimeService';

describe('AppContainer', () => {
    const defaultProps = {
        standing: null,
        league: null,
        getStanding: jest.fn()
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('componentDidMount', () => {
        it('calls correctly functions', () => {
            // Arrange
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.componentDidMount();

            // Assert
            expect(defaultProps.getStanding).toHaveBeenCalledTimes(2);
        });
    });

    describe('renders', () => {
        it('render correctly with standings props is empty', () => {
            // Arrange
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot(2);
        });

        it('render correctly with standings props is not empty', () => {
            // Arrange
            const props = {
                ...defaultProps,
                standing: [{teamId: 1}, {teamId: 2}],
                league: {leagueId: 1}
            }
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot(2);
        });
    });
});