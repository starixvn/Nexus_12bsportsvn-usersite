import React from 'react';
import { shallow } from 'enzyme';
import MatchGrid from '../MatchGrid';
import CommonFunctions from '@jsroot/common/common-functions';

describe('MatchGrid', () => {
    const defaultProps = {
        matches: [],
    };

    describe('OnClick', () => {
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
            const props = {
                ...defaultProps,
                matches: [{matchId: 1, status: 50, startTime: '2024-10-10', homeTeam: { teamId: 1 }, awayTeam: { teamId: 1 }}]
            }
            const event = {
                ctrlKey: true
            };
            CommonFunctions.getMatchDetailPageUrl = jest.fn().mockReturnValue('euro-url');
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('name');
            window.open = jest.fn();
            const container = shallow(<MatchGrid {...props} />);


            // Act
            container.find('.soccer-match-grid-item').first().simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledWith('euro-url', '_blank');
        });

        it('calls correctly when ctrlKey = false', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{matchId: 1, status: 50, startTime: '2024-10-10', homeTeam: { teamId: 1 }, awayTeam: { teamId: 1 }}]
            }
            const event = {
               ctrlKey: false
           };
           window.open = jest.fn();
           CommonFunctions.getMatchDetailPageUrl = jest.fn().mockReturnValue('euro-url');
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('name');
           const container = shallow(<MatchGrid {...props} />);

           // Act
           container.find('.soccer-match-grid-item').first().simulate('click', event);

           // Assert
           expect(window.open).toHaveBeenCalledTimes(0);
           expect(window.location).toEqual('euro-url');
       });
    });
})