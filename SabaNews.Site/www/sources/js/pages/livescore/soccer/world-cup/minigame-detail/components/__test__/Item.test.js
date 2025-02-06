import React from 'react';
import { shallow } from 'enzyme';
import Item from '../Item';
import functions from '../../../common.functions';
import DateTimeService from '@jsroot/common/dateTimeService';
import LangHelper from '@jsroot/common/langHelper';
describe('Item', () => {
    const defaultProps = {
        matches: [],
        votes: [],
        stage: 1
    };

    beforeAll(() => {
        functions.getVoteResult = jest.fn().mockReturnValue({score: 2});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getTotalScore', () => {
        it('return correctly when call function', () => {
            // Arrange
            const props = {
                ...defaultProps,
                votes: [{matchId: 1, stage: 1}, {matchId: 2, stage: 2}],
                matches: [{matchId: 1}, {matchId: 2}, {matchId : 3, startTime: '2022-10-10'}]
            }
            functions.getVoteResult = jest.fn().mockReturnValueOnce({score: 2});
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getTotalScore();

            // Assert
            expect(result).toEqual(0);
        });
    });

    describe('getStageStatus', () => {
        it('return correctly status when stage not started', () => {
             // Arrange
             const props = {
                ...defaultProps,
                votes: [{matchId: 1, stage: 1}, {matchId: 2, stage: 2}],
                matches: [{matchId: 1}, {matchId: 2}, {matchId : 3, startTime: '2022-11-30'}],
                stage: 2
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-11-21 7:00:00');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getStageStatus();

            // Assert
            expect(result.status).toEqual(LangHelper.getResource("NotStarted"));
        });

        it('return correctly status when stage Upcomming', () => {
            // Arrange
            const props = {
               ...defaultProps,
               votes: [{matchId: 1, stage: 1}, {matchId: 2, stage: 2}],
               matches: [{matchId: 1}, {matchId: 2}, {matchId : 3, startTime: '2022-11-30'}],
               stage: 2
           }
           DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-11-22 7:15:00');
           const container = shallow(<Item {...props} />);
           const instance = container.instance();

           // Act
           const result = instance.getStageStatus();

           // Assert
           expect(result.status).toEqual(LangHelper.getResource("Upcomming"));
       });

       it('return correctly status when stage Inprogress', () => {
            // Arrange
            const props = {
                ...defaultProps,
                votes: [{matchId: 1, stage: 1}, {matchId: 2, stage: 2}],
                matches: [{matchId: 1}, {matchId: 2}, {matchId : 3, startTime: '2022-11-30'}],
                stage: 2
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-11-22 8:15:00');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getStageStatus();

            // Assert
            expect(result.status).toEqual(LangHelper.getResource("Inprogress"));
        });

        it('return correctly status when stage Finish', () => {
            // Arrange
            const props = {
                ...defaultProps,
                votes: [{matchId: 1, stage: 1}, {matchId: 2, stage: 2}],
                matches: [{matchId: 1}, {matchId: 2}, {matchId : 3, startTime: '2022-11-30 2:00:00'}],
                stage: 2
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-11-30 8:45:00');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getStageStatus();

            // Assert
            expect(result.status).toEqual(LangHelper.getResource("Finish"));
        });

        it('return correctly status when stage Ending', () => {
            // Arrange
            const props = {
                ...defaultProps,
                votes: [{matchId: 1, stage: 1}, {matchId: 2, stage: 2}],
                matches: [{matchId: 1}, {matchId: 2}, {matchId : 3, startTime: '2022-11-30 2:00:00'}],
                stage: 2
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-11-30 8:00:00');
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getStageStatus();

            // Assert
            expect(result.status).toEqual(LangHelper.getResource("Ending"));
        });
    });

    describe('handleViewDetail', () => {
        const { location } = window;

        beforeAll(() => {
            delete window.location;
            window.location = { href: '' };
        });

        afterAll(() => {
            window.location = location;
        });

        it('calls correctly when ctrlKey = true', () => {
            // Arrange
            const event = {
               ctrlKey: true
           };
           const props = {
                ...defaultProps,
                votes: [{matchId: 1, stage: 1}, {matchId: 2, stage: 2}],
                matches: [{matchId: 1}, {matchId: 2}, {matchId : 3, startTime: '2022-10-10'}]
            }
           window.open = jest.fn();
           const container = shallow(<Item {...props} />);


           // Act
           container.find('.view-minigame-detail').simulate('click', event);

           // Assert
           expect(window.open).toHaveBeenCalledWith('/world-cup-2022/su-kien-du-doan-sung-nhan-qua-khung/chi-tiet/giai-doan/1', '_blank');
       });

       it('calls correctly when ctrlKey = false', () => {
            // Arrange
            const event = {
                ctrlKey: false
            };
            const props = {
                ...defaultProps,
                votes: [{matchId: 1, stage: 1}, {matchId: 2, stage: 2}],
                matches: [{matchId: 1}, {matchId: 2}, {matchId : 3, startTime: '2022-10-10'}]
            }
            window.open = jest.fn();
            const container = shallow(<Item {...props} />);

            // Act
            container.find('.view-minigame-detail').simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('/world-cup-2022/su-kien-du-doan-sung-nhan-qua-khung/chi-tiet/giai-doan/1');
      });
    });

    describe('render', () => {
        it('render correctly', () => {
            // Arrange
            const props = {
                ...defaultProps,
                votes: [{matchId: 1, stage: 1}, {matchId: 2, stage: 2}],
                matches: [{matchId: 1}, {matchId: 2}, {matchId : 3, startTime: '2022-10-10'}]
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    })
});