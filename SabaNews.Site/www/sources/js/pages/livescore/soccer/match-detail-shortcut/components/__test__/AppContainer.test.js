import React from 'react';
import { shallow } from 'enzyme';
import { AppContainer } from '../AppContainer';
import DateTimeService from '@jsroot/common/dateTimeService';

describe('AppContainer', () => {
    const defaultProps = {
        match: null,
        incident: [],
        getMatchDetail: jest.fn()
    };


    afterEach(() => {
        jest.clearAllMocks();
    });


    describe('componentDidMount', () => {
        it('calls correctly functions', () => {
            // Arrange
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.componentDidMount();

            // Assert
            expect(defaultProps.getMatchDetail).toHaveBeenCalledTimes(2);
        });
    })


    describe('renders', () => {
        it('render empty when match is null', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: null,
                incidents: null
            };

            // Act
            const container = shallow(<AppContainer {...props} />);

            // Assert
            expect(container).toMatchSnapshot();
        });

        it('render correctly when match have data', () => {
            // Arrange
            const match = { matchId: 1, status: 0, stage: { stageId: 30537 } };
            const props = {
                ...defaultProps,
                match: match,
                incidents: [{matchId: 1}]
            };
            // Act
            const container = shallow(<AppContainer {...props} />);

            // Assert
            expect(container).toMatchSnapshot();
        });
    });
})