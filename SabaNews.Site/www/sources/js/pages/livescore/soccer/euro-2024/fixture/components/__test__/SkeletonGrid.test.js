import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import SkeletonGrid from '../SkeletonGrid';


describe('SkeletonGrid', () => {
    it('renders correctly when isMobile = true', () => {
        // Act
        const props = {
            isMobile: true
        }
        const container = shallow(<SkeletonGrid {...props}/>);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when isMobile = false', () => {
        // Act
        const props = {
            isMobile: false
        }
        const container = shallow(<SkeletonGrid {...props}/>);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });
});