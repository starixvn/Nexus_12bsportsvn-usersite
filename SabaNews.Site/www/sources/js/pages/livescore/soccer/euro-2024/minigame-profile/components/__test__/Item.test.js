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
        stage: 1,
        status: {stage: 1, isActive: true, status: "Đang diễn ra"}
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
        it('return correctly status when stage "Đang diễn ra"', () => {
             // Arrange
             const props = {
                ...defaultProps,
                votes: [{matchId: 1, stage: 1}, {matchId: 2, stage: 2}],
                matches: [{matchId: 1}, {matchId: 2}, {matchId : 3, startTime: '2022-11-30'}],
                stage: 2,
                status: { stage: 1, isActive: true, status: "Đang diễn ra" }
            }
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getStageStatus();

            // Assert
            expect(result.status).toEqual(props.status.status);
            expect(result.isActive).toEqual(props.status.isActive);
        });

        it('return correctly status when stage "Đã kết thúc"', () => {
            // Arrange
            const props = {
               ...defaultProps,
               votes: [{matchId: 1, stage: 1}, {matchId: 2, stage: 2}],
               matches: [{matchId: 1}, {matchId: 2}, {matchId : 3, startTime: '2022-11-30'}],
               stage: 2,
               status: { stage: 1, isActive: false, status:  'Đã kết thúc'}
           }
           const container = shallow(<Item {...props} />);
           const instance = container.instance();

           // Act
           const result = instance.getStageStatus();

           // Assert
           expect(result.status).toEqual(props.status.status);
           expect(result.isActive).toEqual(true);
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
           expect(window.open).toHaveBeenCalledWith('/euro-2024/minigame/du-doan-cua-toi/giai-doan/1', '_blank');
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
            expect(window.location).toEqual('/euro-2024/minigame/du-doan-cua-toi/giai-doan/1');
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