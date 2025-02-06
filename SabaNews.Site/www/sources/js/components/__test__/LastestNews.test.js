import React from 'react';
import { shallow } from 'enzyme';
import LastestNews from '../LastestNews';

describe('LastestNews', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('render correctly', () => {
        // Arrange
        const props = {
            posts: [{postId: 1, featureImage:'img', title:'title'},{postId: 2, featureImage:'img', title:'title'}]
        }

        // Act
        const container = shallow(<LastestNews {...props} />);

        // Assert
        expect(container).toMatchSnapshot();
    });
});