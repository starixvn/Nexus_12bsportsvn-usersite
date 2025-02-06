import React from 'react';
import { shallow } from 'enzyme';
import {Item} from '../Item';

describe('Item', () => {
    beforeAll(() => {
        const appContainer = document.createElement('div');
        appContainer.setAttribute('class', 'detailWinners');
        document.body.appendChild(appContainer);

        const appContainer2 = document.createElement('div');
        appContainer2.setAttribute('class', 'detailWinners');
        document.body.appendChild(appContainer2);
    });

    afterAll(() => {
        const appContainer = document.getElementsByClassName('detailWinners');
        if (appContainer) {
            document.body.removeChild(appContainer);
        }
        jest.clearAllMocks();
    });

    describe('handleClick row number one', () => {
        it('return correctly when call function', () => {
            // Arrange           
            const defaultProps = {
                Winner: {userName: 'test', icon: '', point: 0, createdDate: "", updatedDate: null},
                number: 0,
                winnerLength: 1
            };
            const container = shallow(<Item {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.handleClick(defaultProps.winnerLength, defaultProps.number, 4);

            // Assert 
            expect(document.getElementsByClassName('detailWinners')[0].style.display).toEqual("block");

        });
    });

    describe('handleClick row number two', () => {
        it('return correctly when call function', () => {
            // Arrange           
            const defaultProps = {
                Winner: {userName: 'test', icon: 'https://', point: 0, createdDate: "", updatedDate: null},
                number: 0,
                winnerLength: 2
            };
            const container = shallow(<Item {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.handleClick(defaultProps.winnerLength, defaultProps.number, 3);

            // Assert 
            expect(document.getElementsByClassName('detailWinners')[0].style.display).toEqual("block");
        });
    });

    describe('show detail stage 4', () => {
        it('return correctly when call function', () => {
            // Arrange           
            const defaultProps = {
                Winner: {userName: 'test', icon: '', point: 0, createdDate: "", updatedDate: null,
                    detail:{
                        pointThirdPlace: 0,
                        pointEightTeamStage: 0,
                        pointSemifinalsStage: 0,
                        pointQuarterfinalsStage: 0,
                        pointFinalStage: 0
                }},
                number: 0,
                winnerLength: 2,
                selectedStage: 4
            };
            const container = shallow(<Item {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.handleClick(defaultProps.winnerLength, defaultProps.number, defaultProps.selectedStage);

            // Assert 
            expect(document.getElementsByClassName('detailWinners')[0].style.display).toEqual("none");
            expect(document.getElementsByClassName('detailWinners')[1].style.display).toEqual("none");

        });

        it('should call correct function when click detail show', () => {
            // Arrange           
            const defaultProps = {
                Winner: {userName: 'test', icon: null, point: 0, createdDate: "", updatedDate: "",
                    detail:{
                        pointThirdPlace: 0,
                        pointEightTeamStage: 0,
                        pointSemifinalsStage: 0,
                        pointQuarterfinalsStage: 0,
                        pointFinalStage: 0
                }},
                number: 1,
                winnerLength: 2,
                selectedStage: 4,
                handleClick: jest.fn()
            };
            window.stage = 4;
            const container = shallow(<Item {...defaultProps} />);

            // Act
            container.find('.minigame-table-items').first().simulate('click');

            // Assert 
            expect(defaultProps.handleClick).toHaveBeenCalledTimes(0);
        });
    });
});