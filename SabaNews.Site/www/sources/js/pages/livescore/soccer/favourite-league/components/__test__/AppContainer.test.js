import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AppContainer } from '../AppContainer';
import CommonFunctions from '@jsroot/common/common-functions';

describe('AppContainer', () => {
    const defaultProps = {
        posts: [],
        getFavLeagues: jest.fn(),
        getLeagues: jest.fn(),
        getLastestNews: jest.fn()
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('componentDidMount', () => {
        it(' call exacly functions', () => {
            // Arrange
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Act
            instance.componentDidMount();

            // Assert
            expect(defaultProps.getFavLeagues).toHaveBeenCalled();
            expect(defaultProps.getLeagues).toHaveBeenCalled();
            expect(defaultProps.getLastestNews).toHaveBeenCalled();
        });
    });

    describe('render correctly', () => {
        // Arrange
        const container = shallow(<AppContainer {...defaultProps} />);

        // Act & Assert
        expect(container).toMatchSnapshot();
        
    })
});