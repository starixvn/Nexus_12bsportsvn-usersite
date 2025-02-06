import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Promotion from '../Promotion';

describe('League', () => {
    it('renders correctly', () => {
        // Arrange
        const promotions = [
            { Id: 1, NameEN: 'UEFA CL group stage', Color: '#ff9966' },
            { Id: 2, NameEN: 'Relegation', Color: '#999' }
        ];

        // Act
        const container = shallow(<Promotion promotions={promotions} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });
});