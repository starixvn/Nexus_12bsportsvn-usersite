import React from 'react';
import { shallow } from 'enzyme';
import { AppContainer } from '../AppContainer';

describe('AppContainer', () => {
    const defaultProps = {
        liveMatches: null,
        todayMatches: null,
        getLiveMatches : jest.fn(),
        getTodayMatches : jest.fn(),
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
            expect(defaultProps.getLiveMatches).toHaveBeenCalledTimes(2);
            expect(defaultProps.getTodayMatches).toHaveBeenCalledTimes(2);
        });
    })
});