import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import SkeletonGrid from '../SkeletonGrid';


describe('SkeletonGrid', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        // Act
       
        const container = shallow(<SkeletonGrid />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

});