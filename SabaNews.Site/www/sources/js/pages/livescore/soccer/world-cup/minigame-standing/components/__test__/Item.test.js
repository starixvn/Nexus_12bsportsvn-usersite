import React from 'react';
import { shallow } from 'enzyme';
import {Item} from '../Item';

describe('Item', () => {
    beforeAll(() => {
        const appContainer = document.createElement('div');
        appContainer.setAttribute('class', 'detailStandings');
        document.body.appendChild(appContainer);

        const appContainer2 = document.createElement('div');
        appContainer2.setAttribute('class', 'detailStandings');
        document.body.appendChild(appContainer2);
    });

    afterAll(() => {
        const appContainer = document.getElementsByClassName('detailStandings');
        if (appContainer) {
            document.body.removeChild(appContainer);
        }
        jest.clearAllMocks();
    });

    describe('handleClick 1 row', () => {
        it('return correctly when call function', () => {
            // Arrange           
            const defaultProps = {
                standing: {userName: 'test', icon: '', point: 0, createdDate: "", updatedDate: null},
                number: 0,
                standingLength: 1
            };
            const container = shallow(<Item {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.handleClick(defaultProps.standingLength, defaultProps.number, 1);

            // Assert 
            expect(document.getElementsByClassName('detailStandings')[0].style.display).toEqual("");
        });
    });

    describe('handleClick 2 row', () => {
        it('return correctly when call function', () => {
            // Arrange           
            const defaultProps = {
                standing: {userName: 'test', icon: null, point: 0, createdDate: "", updatedDate: null},
                number: 0,
                standingLength: 2
            };
            const container = shallow(<Item {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.handleClick(defaultProps.standingLength, defaultProps.number, 4);

            // Assert 
            expect(document.getElementsByClassName('detailStandings')[0].style.display).toEqual("block");
            expect(document.getElementsByClassName('detailStandings')[1].style.display).toEqual("none");
        });
    });

    describe('double handleClick 2 row', () => {
        it('return correctly when call function', () => {
            // Arrange           
            const defaultProps = {
                standing: {userName: 'test', icon: 'https://', point: 0, createdDate: "", updatedDate: null},
                number: 0,
                standingLength: 2,
                rank:2
            };
            const container = shallow(<Item {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.handleClick(defaultProps.standingLength, defaultProps.number, 4);
            instance.handleClick(defaultProps.standingLength, defaultProps.number, 4);

            // Assert 
            expect(document.getElementsByClassName('detailStandings')[0].style.display).toEqual("block");
            expect(document.getElementsByClassName('detailStandings')[1].style.display).toEqual("none");
        });
    });

    describe('show detail stage 4', () => {
        it('return correctly when call function', () => {
            // Arrange           
            const defaultProps = {
                standing: {userName: 'test', icon: '', point: 0, createdDate: "", updatedDate: "",
                    detail:{
                        pointThirdPlace: 0,
                        pointEightTeamStage: 0,
                        pointSemifinalsStage: 0,
                        pointQuarterfinalsStage: 0,
                        pointFinalStage: 0
                }},
                number: 1,
                standingLength: 2,
                stagesSelected: 4,
                rank:2
            };
            const container = shallow(<Item {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.handleClick(defaultProps.standingLength, defaultProps.number, 4);

            // Assert 
            expect(document.getElementsByClassName('detailStandings')[0].style.display).toEqual("none");
            expect(document.getElementsByClassName('detailStandings')[1].style.display).toEqual("block");
        });

        it('return correctly when call function', () => {
            // Arrange           
            const defaultProps = {
                standing: {userName: 'test', icon: null, point: 0, createdDate: "", updatedDate: "",
                    detail:{
                        pointThirdPlace: 0,
                        pointEightTeamStage: 0,
                        pointSemifinalsStage: 0,
                        pointQuarterfinalsStage: 0,
                        pointFinalStage: 0
                }},
                number: 1,
                standingLength: 2,
                stagesSelected: 4,
                handleClick: jest.fn()
            };
            const container = shallow(<Item {...defaultProps} />);

            // Act
            container.find('.minigame-table-items').first().simulate('click');

            // Assert 
            expect(defaultProps.handleClick).toHaveBeenCalledTimes(0);
        });
    });
});