import React from 'react';
import { shallow } from 'enzyme';
import { AppContainer } from '../AppContainer';


describe('AppContainer', () => {
    const defaultProps = {
        matches: null,
        votes: null,
        getProfileData: jest.fn(),
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('renders', () => {
        it('return null when data is null', () => {
            // Arrange
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('return correctly when data is not null', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{matchId: 1}, {matchId: 2}],
                votes: [{matchId: 1 }, {matchId:2}]
            }
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});