import React from 'react';
import { shallow } from 'enzyme';
import GridItem from '../GridItem';

describe('GridItem', () => {
    const defaultProps = {
        items: [{ key: 1, childs: [{ matchId: 1 }] }]
    };


    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('render', () => {
        it('render correctly', () => {
            // Arrange
            const container = shallow(<GridItem {...defaultProps} />);
            //Act
            const instance = container.instance();


            // Assert
            expect(instance).toMatchSnapshot();
        })

    })
});