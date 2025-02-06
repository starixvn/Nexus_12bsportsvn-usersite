import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import League from '../League';
import CommonFunctions from '@jsroot/common/common-functions';

describe('League', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        // Arrange
        const league = {
            leagueId: 1,
            leagueNameEN: 'Champions League',
            leagueNameVN: 'Champions League',
            icon: ''
        };
        CommonFunctions.getLeagueName = jest.fn(() => 'Champions League');

        // Act
        const container = shallow(<League league={league} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });
});