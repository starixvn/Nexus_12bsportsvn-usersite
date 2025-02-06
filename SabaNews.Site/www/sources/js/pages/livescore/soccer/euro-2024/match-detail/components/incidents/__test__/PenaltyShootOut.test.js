import React from 'react';
import { shallow } from 'enzyme';
import PenaltyShootOut from '../PenaltyShootOut';

describe('Incident PenaltyShootOut', () => {
    let penaltyShootOutData = {
        incident: null
     };
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('render', () => {
        it('render correctly when home pen success, away pen fail', () => {
            // Arrange
            const props = {
                penaltyShootOutData: {
                    homeType: 8,
                    awayType: 16,
                    homePlayerName: 'homePlayerName',
                    awayPlayerName: 'awayPlayerName',
                    score: '1-1'
                }
            }
            const container = shallow(<PenaltyShootOut {...props}/>);
            const instance = container.instance();
            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when home pen fail, away pen success', () => {
            // Arrange
            const props = {
                penaltyShootOutData: {
                    homeType: 16,
                    awayType: 8,
                    homePlayerName: 'homePlayerName',
                    awayPlayerName: 'awayPlayerName',
                    score: '1-1'
                }
            }
            const container = shallow(<PenaltyShootOut {...props}/>);
            const instance = container.instance();
            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});