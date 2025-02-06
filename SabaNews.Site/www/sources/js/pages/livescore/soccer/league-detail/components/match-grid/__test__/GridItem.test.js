import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import GridItem from '../GridItem';

describe('GridItem', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        // Arrange
        const props = {
            searchKey: 'searchKey',
            league: { leagueId: 1 },
            item: {
                key: 'key',
                text: 'text',
                childs: [
                    { key: '1', matchId: 1 },
                    { key: '2', matchId: 2 }
                ]
            }
        };

        // Act
        const container = shallow(<GridItem {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });
});