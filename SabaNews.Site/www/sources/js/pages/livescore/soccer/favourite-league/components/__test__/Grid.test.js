import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Grid } from '../Grid';
import CommonFunctions from '@jsroot/common/common-functions';

describe('Grid', () =>{
    const defaultProps = {
        leagues: [],
        favLeagues: [],
        setFavLeagues: jest.fn()
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

            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();
            instance.debounceSearchKeyInputChange = jest.fn();

            // Act
            instance.handleChange(event);

            // Assert
            expect(instance.debounceSearchKeyInputChange).toHaveBeenCalled();
        });
    });

    describe('resetSearchBox', () => {
        it('set correctly state when call function', () => {
            // Arrange
            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();
            instance.searchInput = {value: 'value'};

            // Act
            instance.resetSearchBox();

            // Assert
            expect(instance.state.searchKey).toEqual('');
            expect(instance.state.searchLeagues).toEqual([]);
        });
    });

    describe('checkSearchLeague', () => {
        it('return correctly when search has value', () => {
            // Arrange
            const fieldName = 'LeagueName';
            const searchKey = 'Name';
            const container = shallow(<Grid {...defaultProps} />);
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
            const container = shallow(<Grid {...defaultProps} />);
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
            const container = shallow(<Grid {...defaultProps} />);
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
                leagues: leagues
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            instance.debounceSearchKeyInputChange(searchKey);
            jest.runAllTimers();

            // Assert
            expect(instance.state.searchKey).toEqual(searchKey);
            expect(instance.state.searchLeagues).toEqual(leagues);
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
                leagues: leagues
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            instance.debounceSearchKeyInputChange(searchKey);
            jest.runAllTimers();

            // Assert
            expect(instance.state.searchKey).toEqual(searchKey);
            expect(instance.state.searchLeagues).toEqual([]);
        });

        it('search correctly when searcKey.length === 1', () => {
            // Arrange
            const searchKey = '1';
            const leagues = [
                {leagueId: 1, leagueNameEN: 'leagueName'},
                {leagueId: 2, leagueFullNameEN: 'leagueName'},
                {leagueId: 3, leagueNameVN: 'leagueName'}
            ];
            const props = {
                ...defaultProps,
                leagues: leagues
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            instance.debounceSearchKeyInputChange(searchKey);
            jest.runAllTimers();

            // Assert
            expect(instance.state.searchKey).toEqual(searchKey);
            expect(instance.state.searchLeagues).toEqual([]);
        });

        it('search correctly when searcKey.length === 0', () => {
            // Arrange
            const searchKey = '';
            const leagues = [
                {leagueId: 1, leagueNameEN: 'leagueName'},
                {leagueId: 2, leagueFullNameEN: 'leagueName'},
                {leagueId: 3, leagueNameVN: 'leagueName'}
            ];
            const props = {
                ...defaultProps,
                leagues: leagues
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            instance.debounceSearchKeyInputChange(searchKey);
            jest.runAllTimers();

            // Assert
            expect(instance.state.searchKey).toEqual(searchKey);
            expect(instance.state.searchLeagues).toEqual([]);
        });
    });

    describe('onUpdateFavLeague', () => {
        it('set correctly state when league is not fav', () => {
            // Arrange
            const league = {leagueId: 3, leagueNameEN:'name'};
            const favLeague = [{leagueId: 1, leagueNameEN:'name'}, {leagueId: 2, leagueNameEN:'name'}];
            const props = {
                ...defaultProps,
                favLeagues: favLeague
            }
            CommonFunctions.getFavLeagues = jest.fn().mockReturnValue(favLeague);
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            instance.onUpdateFavLeague(league);

            // Assert
            expect(defaultProps.setFavLeagues).toHaveBeenCalledWith(favLeague);
        });

        it('set correctly state when league is fav & is fav before', () => {
            // Arrange
            const league = {leagueId: 1, leagueNameEN:'name'};
            const favLeague = [{leagueId: 1, leagueNameEN:'name'}, {leagueId: 2, leagueNameEN:'name'}];
            const props = {
                ...defaultProps,
                favLeagues: favLeague
            }
            CommonFunctions.getFavLeagues = jest.fn().mockReturnValue(favLeague);
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            instance.onUpdateFavLeague(league);

            // Assert
            expect(defaultProps.setFavLeagues).toHaveBeenCalledWith(favLeague);
        });

        it('set correctly state when league is just fav recently', () => {
            // Arrange
            const league = {leagueId: 1, leagueNameEN:'name'};
            const favLeague = [{leagueId: 1, leagueNameEN:'name'}, {leagueId: 2, leagueNameEN:'name'}];
            const props = {
                ...defaultProps,
                favLeagues: []
            }
            CommonFunctions.getFavLeagues = jest.fn().mockReturnValue(favLeague);
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            instance.onUpdateFavLeague(league);

            // Assert
            expect(defaultProps.setFavLeagues).toHaveBeenCalledWith([league]);
        });
    });

    describe('isDefault', () => {
        it('return true when call function', () => {
             // Arrange
            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();
            instance.state.searchKey = 'le';
            instance.state.searchLeagues = [];

            // Act
            const result = instance.isDefault();

            // Assert
            expect(result).toEqual(true);
        });

        it('return false when call function', () => {
            // Arrange
           const container = shallow(<Grid {...defaultProps} />);
           const instance = container.instance();
           instance.state.searchKey = 'league';
           instance.state.searchLeagues = [{leagueId: 1}];

           // Act
           const result = instance.isDefault();

           // Assert
           expect(result).toEqual(false);
        });
    });

    describe('sortLeagues', () => {
        it('return null when leagues is null', () => {
            // Arrange
            const leagues = null;
            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.sortLeagues(leagues);

            // Assert
            expect(result).toEqual(null);
        });

        it('return correctly when leagues have data', () => {
            // Arrange
            const leagues = [{leagueId: 1, order: 2}, {leagueId: 2, order: 1}];
            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.sortLeagues(leagues);

            // Assert
            expect(result).toEqual(leagues);
        });
    });

    describe('onDrag call exacly function', () => {
        // Arrange
        const league = {leagueId: 1, order: 2};
        const container = shallow(<Grid {...defaultProps} />);
        const instance = container.instance();

        // Act
        instance.onDrag(league);

        // Assert
        expect(defaultProps.setFavLeagues).toHaveBeenCalled();
    });

    describe('renders', () => {
        it('render correctly when isDefault = true', () => {
            // Arrange
            const leagues = [{leagueId: 1, leagueNameEN:'name', order: 2}, {leagueId: 2, leagueNameEN:'name', order: 1}];
            const props = {
                ...defaultProps,
                favLeagues: leagues
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();
            instance.isDefault = jest.fn().mockReturnValue(true);
            instance.state.searchKey = '';

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when isDefault = false', () => {
            // Arrange
            const leagues = [{leagueId: 1, leagueNameEN:'name', order: 2}, {leagueId: 2, leagueNameEN:'name', order: 1}];
            const props = {
                ...defaultProps,
                favLeagues: leagues
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();
            instance.isDefault = jest.fn().mockReturnValue(false);
            instance.state.searchKey = 'league';
            instance.searchInput = {value: 'value'};
            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when change search league', () => {
            // Arrange
            const leagues = [{leagueId: 1, leagueNameEN:'name', order: 2}, {leagueId: 2, leagueNameEN:'name', order: 1}];
            const props = {
                ...defaultProps,
                favLeagues: leagues
            };
            const container = shallow(<Grid {...props} />);


            // Assert
            const inputSearch = container.find('.livescore-soccer-search-bar').find('input');
            inputSearch.simulate('change', {target: {value: 'value'}});
            container.find('.livescore-soccer-search-bar').find('input').simulate('change', {target: {value: 'value'}});
            expect(container).toMatchSnapshot();
            expect(container.find('input')).toHaveLength(1)
        });
    });
});