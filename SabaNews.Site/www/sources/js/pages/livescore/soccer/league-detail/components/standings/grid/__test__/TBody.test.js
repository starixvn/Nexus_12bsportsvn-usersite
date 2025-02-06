import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import TBody from '../TBody';

describe('TBody', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        // Arrange
        const props = {
            teams: [
                { teamId: 1, nameEN: 'Belgium' },
                { teamId: 2, nameEN: 'Croatia' }
            ],
            isMobile: false
        };

        // Act
        const container = shallow(<TBody {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });
});