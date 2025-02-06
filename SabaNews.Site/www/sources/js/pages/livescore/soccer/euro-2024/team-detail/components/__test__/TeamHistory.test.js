import React from 'react';
import { shallow } from 'enzyme';
import TeamHistory from '../TeamHistory';
import toJson from 'enzyme-to-json';

describe('TeamHistory', () => {
    const defaultProps = {
        data: null,
    };

    describe('renders', () => {

        it('render correctly', () => {
            // Arrange
            const props = {
                ...defaultProps,
                data: {
                    featureImage: 'img',
                    postTitle: 'title',
                    postTime: 'time',
                    postExcerpt: 'description',
                    uri: 'uri'
                }
            }

            const container = shallow(<TeamHistory {...props} />);
            container.find('.team-history-image').first().simulate('click');

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        })
    })
})