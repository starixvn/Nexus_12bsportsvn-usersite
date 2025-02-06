import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AppContainer } from '../AppContainer';
import CommonFunctions from '@jsroot/common/common-functions';
import DateTimeService from '@jsroot/common/dateTimeService';
import Site from '@jsroot/common/site';

describe('AppContainer', () => {
    const defaultProps = {
        league: null,
        matches: null,
        getMatches: jest.fn()
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
            expect(defaultProps.getMatches).toHaveBeenCalledTimes(2);
        });
    });

    describe('groupMatchesByDate', () => {
        it('return as expected', () => {
            // Arrange
            const matches = [
                { matchId: 1, startTime: '2022-05-25' },
                { matchId: 2, startTime: '2022-05-25' },
                { matchId: 3, startTime: '2022-05-26' }
            ];
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.groupMatchesByDate(matches);

            // Assert
            expect(result).toEqual([
                {
                    key: '2022-05-25', text: 'Thứ tư, 25/05/2022',
                    childs: [
                        { matchId: 1, startTime: '2022-05-25' },
                        { matchId: 2, startTime: '2022-05-25' }
                    ]
                },
                {
                    key: '2022-05-26', text: 'Thứ năm, 26/05/2022',
                    childs: [
                        { matchId: 3, startTime: '2022-05-26' }
                    ]
                }
            ]);
        });
    });

    describe('groupMatchesByStage', () => {
        it('return as expected', () => {
            // Arrange
            const matches = [
                { matchId: 1, status: 0, stage: { stageId: 1 } },
                { matchId: 2, status: 0, stage: { stageId: 1 } },
                { matchId: 3, status: 0, stage: { stageId: 2 } },
                { matchId: 4, status: 50, stage: { stageId: 2 } },
            ];
            const groupDate = [
                {
                    key: '2022-05-25', text: 'Thứ tư, 25/05/2022',
                }
            ]
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            instance.groupMatchesByDate = jest.fn().mockReturnValueOnce(groupDate).mockReturnValueOnce(groupDate);

            // Act
            const result = instance.groupMatchesByStage(matches);

            // Assert
            expect(result).toEqual([
                {"key": 1, "isFinished": false, "stage": {"stageId": 1}, "childs": [
                    {"key": "2022-05-25", "text": "Thứ tư, 25/05/2022"}
                ]},
                {"key": 2, "isFinished": true, "stage": {"stageId": 2}, "childs": [{"key": "2022-05-25", "text": "Thứ tư, 25/05/2022"}
                ]}
            ]);
        });
    });

    describe('renders', () => {
        it('render empty when matches is null', () => {
            // Arrange
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('render empty when matches is empty', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: []
            }
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('render correctly when have matches data', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{matchId: 1}]
            }
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.groupMatchesByStage = jest.fn().mockReturnValueOnce(props.matches);

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
})