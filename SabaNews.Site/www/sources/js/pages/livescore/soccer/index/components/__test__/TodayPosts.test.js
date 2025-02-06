import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { TodayPost } from '../TodayPost';

describe('TodayPosts', () => {
    let defaultProps = {
        todayFixturePosts: null,
        getTodayFixturePosts: jest.fn()
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('componentDidMount', () => {
        it('calls correctly functions', () => {
            // Arrange
            window.addEventListener = jest.fn();

            const container = shallow(<TodayPost {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.componentDidMount();

            // Assert
            expect(defaultProps.getTodayFixturePosts).toHaveBeenCalledTimes(2);
        });
    });

    describe('renders', () => {
        it('return null when data is null', () => {
            // Act
            const container = shallow(<TodayPost {...defaultProps} />);
            const instance = container.instance();
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('render correctly when have data', () => {
            //Assign
            const props = {
                ...defaultProps,
                todayFixturePosts: [{postId: 1}, {postId: 2}]
            }
            // Act
            const container = shallow(<TodayPost {...props} />);
            const instance = container.instance();
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });


});