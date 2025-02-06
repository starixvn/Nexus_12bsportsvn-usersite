import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import MultipleGroupStanding  from '../MultipleGroupStanding';

describe('GridItem', () => {
    const defaultProps = {
        standings:[{key: 'A', stage: 1, promotion: null}]
    };

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('componentDidUpdate', () => {
        it('set correctly state function when standings is change', () => {
            // Arrange
            const prevProps = {
                standings:[{key: 1, stage: 2, promotion: null}]
            }

            const container = shallow(<MultipleGroupStanding {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.componentDidUpdate(prevProps);

            // Assert
            expect(instance.state.selectedKey).toEqual('A');
        });
    });

    describe('handleSelectedGroup', () => {
        it('setState correctly when call function', () => {
            // Arrange
            const container = shallow(<MultipleGroupStanding {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.handleSelectedGroup('B');

            // Assert
            expect(instance.state.selectedKey).toEqual('B');
        });
    });


    describe('handleNextTab', () => {
        it('setState correctly when totalGroup < 6', () => {
            // Arrange
            const container = shallow(<MultipleGroupStanding {...defaultProps} />);
            const instance = container.instance();
            instance.state = {endItem : 6, startItem: 1};

            // Act
            instance.handleNextTab();

            // Assert
            expect(instance.state.endItem).toEqual(6);
            expect(instance.state.startItem).toEqual(1);
        });

        it('setState correctly when totalGroup > 6', () => {
            // Arrange
            const props = {
                ...defaultProps,
                standings: [
                    {key: 'A', stage: 1, promotion: null},
                    {key: 'B', stage: 1, promotion: null},
                    {key: 'C', stage: 1, promotion: null},
                    {key: 'D', stage: 1, promotion: null},
                    {key: 'E', stage: 1, promotion: null},
                    {key: 'F', stage: 1, promotion: null},
                    {key: 'G', stage: 1, promotion: null}
                ]
            }
            const container = shallow(<MultipleGroupStanding {...props} />);
            const instance = container.instance();
            instance.state = {endItem : 6, startItem: 1};

            // Act
            instance.handleNextTab();

            // Assert
            expect(instance.state.endItem).toEqual(7);
            expect(instance.state.startItem).toEqual(2);
        });
    });

    describe('handlePrevTab', () => {
        it('setState correctly when startItem = 0', () => {
            // Arrange
            const container = shallow(<MultipleGroupStanding {...defaultProps} />);
            const instance = container.instance();
            instance.state = {endItem : 6, startItem: 0};

            // Act
            instance.handlePrevTab();

            // Assert
            expect(instance.state.endItem).toEqual(6);
            expect(instance.state.startItem).toEqual(0);
        });

        it('setState correctly when startItem > 0', () => {
            // Arrange
            const container = shallow(<MultipleGroupStanding {...defaultProps} />);
            const instance = container.instance();
            instance.state = {endItem : 6, startItem: 1};

            // Act
            instance.handlePrevTab();

            // Assert
            expect(instance.state.endItem).toEqual(5);
            expect(instance.state.startItem).toEqual(0);
        });
    });

    describe('renders', () => {
        it('return null when selectedGroup is null', () => {
            // Arrange
            const container = shallow(<MultipleGroupStanding {...defaultProps} />);
            const instance = container.instance();
            instance.state = {endItem : 6, startItem: 1, selectedKey: 'L'};

            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('return null when selectedGroup is null', () => {
            // Arrange
            const props = {
                ...defaultProps,
                standings: [
                    {key: 'A', stage: 1, promotion: null},
                    {key: 'B', stage: 1, promotion: null},
                    {key: 'C', stage: 1, promotion: null},
                    {key: 'D', stage: 1, promotion: null},
                    {key: 'E', stage: 1, promotion: null},
                    {key: 'F', stage: 1, promotion: null},
                    {key: 'G', stage: 1, promotion: null}
                ]
            }
            // Act
            const container = shallow(<MultipleGroupStanding {...props} />);

            // Assert
            container.find('.homepage-group-standing li').at(1).simulate('click', 'A');
            expect(container).toMatchSnapshot(container);
        });
    })


});