import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Item from '../Item';

describe('Item', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('renders correctly when key is invalid', () => {
        // Arrange
        const props = {
            searchKey: 'searchKey',
            league: { leagueId: 1 },
            child: { matchId: 1 }
        };

        // Act
        const container = shallow(<Item {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when key is valid', () => {
        // Arrange
        const props = {
            searchKey: 'searchKey',
            league: { leagueId: 1 },
            child: {
                key: 'key',
                text: 'text',
                childs: [
                    { matchId: 1 },
                    { matchId: 2 }
                ]
            }
        };

        // Act
        const container = shallow(<Item {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });
});