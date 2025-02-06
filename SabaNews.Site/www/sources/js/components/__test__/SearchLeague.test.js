import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import SearchLeague from '../SearchLeague';
import CommonFunctions from '@jsroot/common/common-functions';
import DateTimeService from '@jsroot/common/dateTimeService';

describe('SearchLeague', () => {
    const defaultProps = {
        searchLeagues: [],
        onUpdateFavLeague: jest.fn(),
        onClose: jest.fn()
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('handleChange', () => {
        it('call exacly function', () => {
            // Arrange
            const event = {
                target: {value: 'value'}
            };

            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();
            instance.debounceSearchKeyInputChange = jest.fn();

            // Act
            const result = instance.handleChange(event);

            // Assert
            expect(instance.debounceSearchKeyInputChange).toHaveBeenCalled();
        });
    });

    describe('resetSearchBox', () => {
        it('set correctly state when call function', () => {
            // Arrange
            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();
            instance.searchInput = {value: 'value'};

            // Act
            instance.resetSearchBox();

            // Assert
            expect(instance.state.searchKey).toEqual('');
            expect(instance.state.leagues).toEqual([]);
            expect(instance.state.toggleIcon).toEqual(true);
        });
    });

    describe('checkSearchLeague', () => {
        it('return correctly when search has value', () => {
            // Arrange
            const fieldName = 'LeagueName';
            const searchKey = 'Name';
            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.checkSearchLeague(fieldName, searchKey);

            // Assert
            expect(result).toEqual(true);
        });

        it('return correctly when fieldName is null', () => {
            // Arrange
            const fieldName = null;
            const searchKey = 'Name';
            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.checkSearchLeague(fieldName, searchKey);

            // Assert
            expect(result).toEqual(null);
        });

        it('return correctly when search dont have value', () => {
            // Arrange
            const fieldName = 'league';
            const searchKey = 'Name';
            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.checkSearchLeague(fieldName, searchKey);

            // Assert
            expect(result).toEqual(false);
        });
    });

    describe('debounceSearchKeyInputChange', () => {
        jest.useFakeTimers();
        it('search correctly when searcKey.length > 2 & search result has value', () => {
            // Arrange
            const searchKey = 'league';
            const leagues = [
                {leagueId: 1, leagueNameEN: 'leagueName'},
                {leagueId: 2, leagueFullNameEN: 'leagueName'},
                {leagueId: 3, leagueNameVN: 'leagueName'}
            ];
            const props = {
                ...defaultProps,
                searchLeagues: leagues
            };
            const container = shallow(<SearchLeague {...props} />);
            const instance = container.instance();

            // Act
            instance.debounceSearchKeyInputChange(searchKey);
            jest.runAllTimers();

            // Assert
            expect(instance.state.searchKey).toEqual(searchKey);
            expect(instance.state.leagues).toEqual(leagues);
            expect(instance.state.toggleIcon).toEqual(true);
        });

        it('search correctly when searcKey.length > 2 & search result has no value', () => {
            // Arrange
            const searchKey = 'league1';
            const leagues = [
                {leagueId: 1, leagueNameEN: 'leagueName'},
                {leagueId: 2, leagueFullNameEN: 'leagueName'},
                {leagueId: 3, leagueNameVN: 'leagueName'}
            ];
            const props = {
                ...defaultProps,
                searchLeagues: leagues
            };
            const container = shallow(<SearchLeague {...props} />);
            const instance = container.instance();

            // Act
            instance.debounceSearchKeyInputChange(searchKey);
            jest.runAllTimers();

            // Assert
            expect(instance.state.searchKey).toEqual(searchKey);
            expect(instance.state.leagues).toEqual([]);
            expect(instance.state.toggleIcon).toEqual(true);
        });

        it('search correctly when searcKey.length == 0', () => {
            // Arrange
            const searchKey = '';
            const leagues = [
                {leagueId: 1, leagueNameEN: 'leagueName'},
                {leagueId: 2, leagueFullNameEN: 'leagueName'},
                {leagueId: 3, leagueNameVN: 'leagueName'}
            ];
            const props = {
                ...defaultProps,
                searchLeagues: leagues
            };
            const container = shallow(<SearchLeague {...props} />);
            const instance = container.instance();

            // Act
            instance.debounceSearchKeyInputChange(searchKey);
            jest.runAllTimers();

            // Assert
            expect(instance.state.searchKey).toEqual(searchKey);
            expect(instance.state.leagues).toEqual([]);
            expect(instance.state.toggleIcon).toEqual(true);
        });
    });

    describe('handleClose set correctly state when called', () => {
        // Arrange
        const container = shallow(<SearchLeague {...defaultProps} />);
        const instance = container.instance();

        // Act
        instance.handleClose();

        // Assert
        expect(instance.state.searchKey).toEqual('');
        expect(instance.state.leagues).toEqual([]);
        expect(instance.state.favLeagues).toEqual([]);
        expect(defaultProps.onClose).toHaveBeenCalled();
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

        it('redirect correctly when click into icon', () => {
            // Arrange
            const event = {
                target: { className: 'icon-livescore' },
                ctrlKey: false
            };
            window.open = jest.fn();
            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();
            // Act
            instance.handleClick(event);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
        });

        it('redirect correctly when ctrlKey = false', () => {
            // Arrange
            const event = {
                target: { className: '' },
                ctrlKey: false
            };

            window.open = jest.fn();
            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();
            CommonFunctions.getLeaguePageUrl = jest.fn().mockReturnValue('/lich-thi-dau/bong-da');
            // Act
            instance.handleClick(event);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('/lich-thi-dau/bong-da');
        });

        it('calls correctly when ctrlKey = true', () => {
           // Arrange
           const event = {
                target: { className: '' },
                ctrlKey: true
            };
            window.open = jest.fn();
            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();
            CommonFunctions.getLeaguePageUrl = jest.fn().mockReturnValue('/lich-thi-dau/bong-da');

            // Act
            instance.handleClick(event);

            // Assert
            expect(window.open).toHaveBeenCalledWith('/lich-thi-dau/bong-da', '_blank');
        });
    });

    describe('isDefault', () => {
        it('return true when call function', () => {
             // Arrange
            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();
            instance.state.searchKey = 'le';
            instance.state.leagues = [];

            // Act
            const result = instance.isDefault();

            // Assert
            expect(result).toEqual(true);
        });

        it('return false when call function', () => {
            // Arrange
           const container = shallow(<SearchLeague {...defaultProps} />);
           const instance = container.instance();
           instance.state.searchKey = 'league';
           instance.state.leagues = [{leagueId: 1}];

           // Act
           const result = instance.isDefault();

           // Assert
           expect(result).toEqual(false);
        });
    });
    describe('onUpdateFavLeague', () => {
        it('set correctly state when league is not fav', () => {
            // Arrange
            const league = {leagueId: 3, leagueNameEN:'name'};
            const favLeague = [{leagueId: 1, leagueNameEN:'name'}, {leagueId: 2, leagueNameEN:'name'}];

            CommonFunctions.getFavLeagues = jest.fn().mockReturnValue(favLeague);
            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();
            instance.state.favLeagues = favLeague;

            // Act
            instance.onUpdateFavLeague(league);

            // Assert
            expect(instance.state.favLeagues).toEqual(favLeague);
            expect(instance.state.toggleIcon).toEqual(true);
            expect(defaultProps.onUpdateFavLeague).toHaveBeenCalled();
        });

        it('set correctly state when league is fav & is fav before', () => {
            // Arrange
            const league = {leagueId: 1, leagueNameEN:'name'};
            const favLeague = [{leagueId: 1, leagueNameEN:'name'}, {leagueId: 2, leagueNameEN:'name'}];

            CommonFunctions.getFavLeagues = jest.fn().mockReturnValue(favLeague);
            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();
            instance.state.favLeagues = favLeague;

            // Act
            instance.onUpdateFavLeague(league);

            // Assert
            expect(instance.state.favLeagues).toEqual(favLeague);
            expect(instance.state.toggleIcon).toEqual(true);
            expect(defaultProps.onUpdateFavLeague).toHaveBeenCalled();
        });

        it('set correctly state when league is just fav recently', () => {
            // Arrange
            const league = {leagueId: 1, leagueNameEN:'name'};
            const favLeague = [{leagueId: 1, leagueNameEN:'name'}, {leagueId: 2, leagueNameEN:'name'}];

            CommonFunctions.getFavLeagues = jest.fn().mockReturnValue(favLeague);
            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();
            instance.state.favLeagues = [];

            // Act
            instance.onUpdateFavLeague(league);

            // Assert
            expect(instance.state.favLeagues).toEqual([league]);
            expect(instance.state.toggleIcon).toEqual(true);
            expect(defaultProps.onUpdateFavLeague).toHaveBeenCalled();
        });
    });

    describe('getMajorLeagues return correctly list', () => {
        it('return empty when leagues data is empty', () => {
            // Arrange
            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getMajorLeagues();

            // Assert
            expect(result).toEqual([]);
        });

        it('return empty when have leagues data', () => {
            // Arrange
            const leagues = [{leagueId: 1, leagueNameEN:'name', priority: 1}, {leagueId: 2, leagueNameEN:'name', priority: 0}];
            const props = {
                ...defaultProps,
                searchLeagues: leagues
            }

            const container = shallow(<SearchLeague {...props} />);
            const instance = container.instance();

            // Act
            const result =  instance.getMajorLeagues();

            // Assert
            expect(result).toEqual([{leagueId: 1, leagueNameEN:'name', priority: 1}]);
        });
    });

    describe('renderLeagues', () => {
        it('return null when leagues data is empty', () => {
            // Arrange
            const leagues = [];
            const title = 'title';

            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result =  instance.renderLeagues(leagues, title);

            // Assert
            expect(result).toEqual(null);
        });

        it('return null when leagues data is empty', () => {
            // Arrange
            const leagues = [{leagueId: 1, leagueNameEN:'name', priority: 1}, {leagueId: 2, leagueNameEN:'name', priority: 0}];;
            const title = 'title';

            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result =  instance.renderLeagues(leagues, title);

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('renders', () => {
        it('render correctly when isDefault', () => {
            // Arrange
            const leagues = [{leagueId: 1, leagueNameEN:'name', priority: 1}, {leagueId: 2, leagueNameEN:'name', priority: 0}];;
            const title = 'title';

            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();
            instance.state.searchKey = '';
            instance.state.leagues = leagues;
            instance.state.favLeagues = leagues;
            instance.isDefault = jest.fn().mockReturnValue(true);
            instance.state.getMajorLeagues = jest.fn().mockReturnValue(leagues);

            // Act
            const result =  instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when !isDefault', () => {
            // Arrange
            const leagues = [{leagueId: 1, leagueNameEN:'name', priority: 1}, {leagueId: 2, leagueNameEN:'name', priority: 0}];;
            const event = {
                target: { className: '' },
                ctrlKey: false
            };

            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();
            instance.state.searchKey = '';
            instance.state.leagues = leagues;
            instance.state.favLeagues = leagues;
            instance.isDefault = jest.fn().mockReturnValue(false);
            instance.state.getMajorLeagues = jest.fn().mockReturnValue(leagues);

            // Act
            const result =  instance.render();

            // Assert
            // result.find('.leagues-item').first().simulate('click', event);
            expect(result).toMatchSnapshot();
        });

        it('render correctly when search leagues data is empty', () => {
            // Arrange
            const leagues = [{leagueId: 1, leagueNameEN:'name', priority: 1}, {leagueId: 2, leagueNameEN:'name', priority: 0}];

            const container = shallow(<SearchLeague {...defaultProps} />);
            const instance = container.instance();
            instance.state.searchKey = 'league';
            instance.state.leagues = [];
            instance.state.favLeagues = leagues;
            instance.isDefault = jest.fn().mockReturnValue(false);
            instance.state.getMajorLeagues = jest.fn().mockReturnValue(leagues);
            instance.searchInput = {value: 'value'};
            // Act
            const result =  shallow(instance.render());

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});