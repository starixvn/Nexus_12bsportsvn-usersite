import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import THead from '../THead';

describe('THead', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('renders correctly when isMobile = false', () => {
        // Arrange
        const props = {
            groupName: 'Group A',
            isMobile: false
        };

        // Act
        const container = shallow(<THead {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when isMobile = true', () => {
        // Arrange
        const props = {
            groupName: 'Group A',
            isMobile: true
        };

        // Act
        const container = shallow(<THead {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });
});