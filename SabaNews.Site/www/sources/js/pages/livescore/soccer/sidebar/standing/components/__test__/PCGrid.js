import React from 'react';
import { shallow } from 'enzyme';
import CommonFunctions from '@jsroot/common/common-functions';
import PCGrid from '../PCGrid';

describe('MobileGrid', () => {
    const defaultProps = {
        standings: [],
        currentLeagueStanding: {
            league: {leagueId: 1}
        },
        handleSelectLeague: jest.fn()
    };

    describe('componentDidMount', () => {
        it('componentDidMount should run correctly', () => {
            const handleClickOutside = jest.fn();
            document.addEventListener = jest.fn();
            const container = shallow(<MobileGrid {...defaultProps} />);
            container.instance().handleClickOutside = handleClickOutside;

            // Action
            container.instance().componentDidMount();

            // Assert
            expect(document.addEventListener).toHaveBeenCalledWith('click', handleClickOutside);
        });
    });

    describe('componentWillUnmount', () => {
        it('componentWillUnmount should run correctly', () => {
            const handleClickOutside = jest.fn();
            document.removeEventListener = jest.fn();
            const container = shallow(<MobileGrid {...defaultProps} />);
            container.instance().handleClickOutside = handleClickOutside;

            // Action
            container.instance().componentWillUnmount();

            // Assert
            expect(document.removeEventListener).toHaveBeenCalledWith('click', handleClickOutside);
        });
    });

    describe('handleClickOutside', () => {
        it('should state display not change when not has wrapperRef', () => {
            const event = {
                target: {}
            };
            const expected = {
                isShowList: false,
            };
            const container = shallow(<MobileGrid {...defaultProps} />);
            container.instance().wrapperRef = null;
            container.instance().componentDidMount();
            // Action
            container.instance().handleClickOutside(event);

            // Assert
            expect(container.state()).toEqual(expected);
        });

        it('should state display change', () => {
            const mockRef = {
                event: {},
                contains: jest.fn().mockReturnValue(false)
            };
            const expected = {
                isShowList: true
            };
            const container = shallow(<MobileGrid {...defaultProps} />);
            container.instance().wrapperRef.current = mockRef;
            container.instance().setState(expected);
            // Action
            container.instance().handleClickOutside(mockRef.event);

            // Assert
            expect(container.instance().state.isShowList).toBeFalse;
        });
    });

    describe('handleSelectLeague', () => {
        it('return correct default stageId', () => {
            // Arrange
            const props = {
                ...defaultProps,
                standings:[
                    {
                        league:{leagueId: 1},
                        standing: []
                    },
                    {
                        league:{leagueId: 2},
                        standing: [{stageId: 1}]
                    }
                ]
            }
            const container = shallow(<MobileGrid {...props} />);
            const instance = container.instance();
            // Act
            instance.handleSelectLeague(1);

            // Assert
            expect(props.handleSelectLeague).toHaveBeenCalledWith(1);
        })
    });

    describe('renders', () => {
        it('render correct with defaultProps', () => {

            // Action
            const container = shallow(<MobileGrid {...defaultProps} />);
            container.find('span').first().simulate('click');

            // Assert
            expect(container).toMatchSnapshot();
        });

        it('render correct when have data standings', () => {
            const props = {
                ...defaultProps,
                standings:[
                    {
                        league:{leagueId: 1},
                        standing: []
                    },
                    {
                        league:{leagueId: 2},
                        standing: [{stageId: 1}, {stageId: 2}]
                    }
                ]
            }
            const container = shallow(<MobileGrid {...props} />);
            const instance = container.instance();
            instance.state.isShowList = true;

            // Action
            const result = instance.render();


            // Assert
            expect(result).toMatchSnapshot();
        });
    })
});