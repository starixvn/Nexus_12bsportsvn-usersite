import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import SkeletonLeague from '../SkeletonLeague';

describe('SkeletonLeague', () => {
    it('renders correctly', () => {
        // Act
        const container = shallow(<SkeletonLeague />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });
});