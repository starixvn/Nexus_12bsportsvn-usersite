import React from 'react';
import { shallow } from 'enzyme';
import Grid  from '../Grid';

describe('Grid', () => {
    const defaultProps = {
        matches: [
            {
                key: 1, stage: {stageId:1, isFinished: true},
                matches:[
                    {matchId: 1, stage: {stageNameVN: 'stageNameVN'}},
                    {matchId: 2, stage: {stageNameVN: 'stageNameVN'}}
                ]
            },
            {
                key: 2, stage: {stageId:2, isFinished: false},
                matches:[
                    {matchId: 3, stage: {stageNameVN: 'stageNameVN'}},
                    {matchId: 4, stage: {stageNameVN: 'stageNameVN'}}
                ]
            }
        ],
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('handleActiveTab', () => {
        it('setState correctly when isNext = true', () => {
            // Arrange
            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ activeIndex: 0 });

            // Act
            instance.handleActiveTab(true);

            // Assert
            expect(instance.state.activeIndex).toEqual(1);
        });

        it('setState correctly when isNext = false', () => {
            // Arrange
            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ activeIndex: 1 });

            // Act
            instance.handleActiveTab(false);

            // Assert
            expect(instance.state.activeIndex).toEqual(0);
        });

        it('setState correctly when isNext = false && currentIndex = 0', () => {
            // Arrange
            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ activeIndex: -1 });

            // Act
            instance.handleActiveTab(false);

            // Assert
            expect(instance.state.activeIndex).toEqual(-1);
        });
    });

    describe('renders', () => {
        it('render correctly when isMobile is true', () => {
            // Arrange
            const props = {
                ...defaultProps,
                isMobile: true
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();
            instance.setState({ activeIndex: 1 });

            // Act
            const result = instance.render();
            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when isMobile is false', () => {
            // Arrange
            const props = {
                ...defaultProps,
                isMobile: false
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();
            instance.setState({ activeIndex: 1 });

            // Act
            const result = shallow(instance.render());

            // Assert
            expect(result).toMatchSnapshot();
        })

        it('render correctly when league is finished', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [
                    {
                        key: 1, stage: {stageId:1, isFinished: true},
                        matches:[
                            {matchId: 1, stage: {stageNameVN: 'stageNameVN'}},
                            {matchId: 2, stage: {stageNameVN: 'stageNameVN'}}
                        ]
                    },
                    {
                        key: 2, stage: {stageId:2, isFinished: true},
                        matches:[
                            {matchId: 3, stage: {stageNameVN: 'stageNameVN'}},
                            {matchId: 4, stage: {stageNameVN: 'stageNameVN'}}
                        ]
                    }
                ],
                isMobile: false
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();
            instance.setState({ activeIndex: 1 });

            // Act
            const result = shallow(instance.render());

            // Assert
            expect(result).toMatchSnapshot();
        })
    });
});