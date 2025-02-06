import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Index from '../Index';

describe('index', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('renders correctly when standings.length <= 1', () => {
        // Arrange
        const props = {
            standings: [{}],
            isMobile: false
        };

        // Act
        const container = shallow(<Index {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when standings.length > 1', () => {
        // Arrange
        const props = {
            standings: [{ key: 'A' }, { key: 'B' }],
            isMobile: true
        };

        // Act
        const container = shallow(<Index {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });
});