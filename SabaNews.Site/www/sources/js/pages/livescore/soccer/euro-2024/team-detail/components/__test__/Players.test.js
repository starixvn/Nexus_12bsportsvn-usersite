import React from 'react';
import { shallow } from 'enzyme';
import Players from '../Players';
import toJson from 'enzyme-to-json';

describe('Players', () => {
    const defaultProps = {
        data: null,
    };

    describe('renders', () => {
        it('return null when data is null', () => {
            // Arrange

            const container = shallow(<Players {...defaultProps} />);


            // Assert
            expect(container).toEqual({});
        })

        it('render correctly', () => {
            // Arrange
            const players = [
                { playerId: 1, shirtNumber: 50, playerFullName: 'name', playerName: 'name', clubName: 'club', icon: 'icon' },
                { playerId: 2, shirtNumber: 50, playerFullName: 'name', playerName: 'name', clubName: 'club' }
            ];
            const props = {
                ...defaultProps,
                data: [
                    { position: 1, players:players }
                ]
            }

            const container = shallow(<Players {...props} />);


            // Assert
            expect(toJson(container)).toMatchSnapshot();
        })
    })
})