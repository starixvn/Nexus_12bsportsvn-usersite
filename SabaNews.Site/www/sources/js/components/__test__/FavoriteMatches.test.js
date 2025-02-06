import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { FavoriteMatches } from '../FavoriteMatches';
import CommonFunctions from '@jsroot/common/common-functions'

describe('FavoriteMatches', () => {
    let defaultProps = {
        isMobile: false
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('render', () => {
        it('render correct ly when is desktop & match.length = 0', () => {
            // Act
            CommonFunctions.getFavouriteMatches = jest.fn().mockReturnValue([]);
            const container = shallow(<FavoriteMatches {...defaultProps} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('render correct ly when is desktop & match.length > 0', () => {
            // Act
            CommonFunctions.getFavouriteMatches = jest.fn().mockReturnValue([{matchId: 1}, {matchId: 2}]);
            const container = shallow(<FavoriteMatches {...defaultProps} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('render correct ly when is mobile', () => {
            // Act
            defaultProps.isMobile = true;
            CommonFunctions.getFavouriteMatches = jest.fn().mockReturnValue([]);
            const container = shallow(<FavoriteMatches {...defaultProps} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('render correct ly when is mobile & match.length > 0', () => {
            // Act
            defaultProps.isMobile = true;
            CommonFunctions.getFavouriteMatches = jest.fn().mockReturnValue([{matchId: 1}, {matchId: 2}]);
            const container = shallow(<FavoriteMatches {...defaultProps} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });
    });

    describe('handleClick', () => {
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
            window.open = jest.fn();
            const container = shallow(<FavoriteMatches {...defaultProps} />);


            // Act
            container.find('.livescore-like').first().simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledWith('/lich-thi-dau/bong-da/tran-dau-quan-tam', '_blank');
        });

        it('calls correctly when ctrlKey = false', () => {
            // Arrange
            const event = {
               ctrlKey: false
           };
           window.open = jest.fn();
           const container = shallow(<FavoriteMatches {...defaultProps} />);

           // Act
           container.find('.livescore-like').first().simulate('click', event);

           // Assert
           expect(window.open).toHaveBeenCalledTimes(0);
           expect(window.location).toEqual('/lich-thi-dau/bong-da/tran-dau-quan-tam');
       });
    });
});