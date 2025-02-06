import React , { Fragment } from 'react';
import { shallow } from 'enzyme';
import dayjs from 'dayjs';
import toJson from 'enzyme-to-json';
import FavouriteLeagueIcon from '../FavouriteLeagueIcon';
import DateTimeService from '@jsroot/common/dateTimeService';
import CommonFunctions from '@jsroot/common/common-functions';


describe('FavouriteLeagueIcon', () => {
    const defaultProps = {
        league: {},
        flagToggle: false
    }
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('init state correctly when league is fav', () => {
            // Arrange && Act
            const leagues = [{leagueId: 1}, {leagueId: 2}];
            const props = {
            ...defaultProps,
            league: {leagueId: 1}
            }
            CommonFunctions.getFavLeagues = jest.fn().mockReturnValue(leagues);
            const instance = shallow(<FavouriteLeagueIcon {...props} />).instance();

            // Assert
            expect(instance.state.isFavourite).toEqual(true);
            expect(instance.state.isShowTooltip).toEqual(true);
        });

        it('init state correctly when league is not fav', () => {
            // Arrange && Act
            const leagues = [{leagueId: 1}, {leagueId: 2}];
            const props = {
                ...defaultProps,
                league: {leagueId: 3}
            };
            CommonFunctions.getFavLeagues = jest.fn().mockReturnValue(leagues);
            const instance = shallow(<FavouriteLeagueIcon {...props} />).instance();

            // Assert
            expect(instance.state.isFavourite).toEqual(false);
            expect(instance.state.isShowTooltip).toEqual(true);
        });
    });

    describe('componentDidUpdate', () => {
        it('update fav when flagToggle is change', () => {
            // Arrange
            const leagues = [{leagueId: 1}, {leagueId: 2}];
            const props = {
                ...defaultProps,
                flagToggle: false,
                league: {leagueId: 1}
            }
            CommonFunctions.getFavLeagues = jest.fn().mockReturnValue(leagues);
            const container = shallow(<FavouriteLeagueIcon {...props} />);
            const instance = container.instance();
            instance.state.isFavourite = false;

            // Act
            instance.componentDidUpdate({flagToggle:true});
            // Assert
            expect(instance.state.isFavourite).toEqual(true);
        });

        it('remain fav when flagToggle is change', () => {
            // Arrange
            const leagues = [{leagueId: 1}, {leagueId: 2}];
            const props = {
                ...defaultProps,
                flagToggle: false,
                league: {leagueId: 3}
            }
            CommonFunctions.getFavLeagues = jest.fn().mockReturnValue(leagues);
            const container = shallow(<FavouriteLeagueIcon {...props} />);
            const instance = container.instance();
            instance.state.isFavourite = false;

            // Act
            instance.componentDidUpdate({flagToggle:true});
            // Assert
            expect(instance.state.isFavourite).toEqual(false);
        });
    });

    describe('handleUpdateFavourite', () => {
        it('set state correctly when move fav', () => {
            // Arrange
            const leagues = [{leagueId: 1}, {leagueId: 2}];
            const props = {
                ...defaultProps,
                league: {leagueId: 1}
            }
            CommonFunctions.getFavLeagues = jest.fn().mockReturnValue(leagues);
            const container = shallow(<FavouriteLeagueIcon {...props} />);
            const instance = container.instance();
            instance.onUpdateFavLeague = jest.fn();

            // Act
            instance.handleUpdateFavourite();
            // Assert
            expect(instance.state.isFavourite).toEqual(false);
            expect(instance.state.isShowTooltip).toEqual(false);
        });

        it('set state correctly when add fav', () => {
            // Arrange
            const leagues = [{leagueId: 1}, {leagueId: 2}];
            const props = {
                ...defaultProps,
                league: {leagueId: 3}
            }
            CommonFunctions.getFavLeagues = jest.fn().mockReturnValue(leagues);
            const container = shallow(<FavouriteLeagueIcon {...props} />);
            const instance = container.instance();
            instance.onUpdateFavLeague = jest.fn();

            // Act
            instance.handleUpdateFavourite();
            // Assert
            expect(instance.state.isFavourite).toEqual(true);
            expect(instance.state.isShowTooltip).toEqual(false);
        });

        it('set state correctly when add fav league have season', () => {
            // Arrange
            const leagues = [{leagueId: 1}, {leagueId: 2}];
            const props = {
                ...defaultProps,
                league: {leagueId: 3, season: 1},
                order: 1
            }
            CommonFunctions.getFavLeagues = jest.fn().mockReturnValue(leagues);
            const container = shallow(<FavouriteLeagueIcon {...props} />);
            const instance = container.instance();
            instance.onUpdateFavLeague = jest.fn();

            // Act
            instance.handleUpdateFavourite();
            // Assert
            expect(instance.state.isFavourite).toEqual(true);
            expect(instance.state.isShowTooltip).toEqual(false);
        });

        it('set state correctly when add first fav', () => {
            // Arrange
            const leagues = [];
            const props = {
                ...defaultProps,
                league: {leagueId: 3}
            }
            CommonFunctions.getFavLeagues = jest.fn().mockReturnValue(leagues);
            const container = shallow(<FavouriteLeagueIcon {...props} />);
            const instance = container.instance();
            instance.onUpdateFavLeague = jest.fn();

            // Act
            instance.handleUpdateFavourite();
            // Assert
            expect(instance.state.isFavourite).toEqual(true);
            expect(instance.state.isShowTooltip).toEqual(false);
        });
    });

    describe('renderTooltip', () => {
        it('return correctly when isFavourite = false', () => {
            // Arrange
            const instance = shallow(<FavouriteLeagueIcon {...defaultProps} />).instance();
            instance.setState({isFavourite: false})
            // Act
            const result = instance.renderTooltip();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when isFavourite = true', () => {
            // Arrange
            const instance = shallow(<FavouriteLeagueIcon {...defaultProps} />).instance();
            instance.setState({isFavourite: true})
           // Act
           const result = instance.renderTooltip();

           // Assert
           expect(result).toMatchSnapshot();
        });
    });

    describe('onMouseOut', () => {
        it('setState correctly when isShowTooltip = false', () => {
            // Arrange
            const instance = shallow(<FavouriteLeagueIcon {...defaultProps} />).instance();
            instance.setState({isShowTooltip: false})
           // Act

           instance.onMouseOut();

           // Assert
           expect(instance.state.isShowTooltip).toEqual(true);
        });

        it('setState correctly when isShowTooltip = true', () => {
            // Arrange
            const instance = shallow(<FavouriteLeagueIcon {...defaultProps} />).instance();
            instance.setState({isShowTooltip: true, isFavourite:false})
           // Act

           instance.onMouseOut();

           // Assert
           expect(instance.state.isShowTooltip).toEqual(true);
        });
    });

    describe('onUpdateFavLeague', () => {
        it('call correctly action with defaut props', () => {
            // Arrange
            const container = shallow(<FavouriteLeagueIcon {...defaultProps} />)

            // Act
            container.simulate('click');
        });

        it('call correctly function with defaut props', () => {
             // Arrange
            const container = shallow(<FavouriteLeagueIcon {...defaultProps} />)
            const instance = container.instance();
            // Act
            instance.onUpdateFavLeague();

           // Assert
        });

        it('call correctly function when props have function onUpdateFavLeague', () => {
            // Arrange
            const props = {
                ...defaultProps,
                onUpdateFavLeague: jest.fn()
            }
            const container = shallow(<FavouriteLeagueIcon {...props} />)
            const instance = container.instance();
            // Act && Act
            instance.onUpdateFavLeague();
        });
    });

    describe('renders', () => {
        it('render correctly when fav = true', () => {
            // Arrange
            const container = shallow(<FavouriteLeagueIcon {...defaultProps} />)
            const instance = container.instance();
            instance.state.isFavourite = true;
            instance.state.isShowTooltip = true;
            // Act
            const result = container.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when fav = false', () => {
            // Arrange
            const props = {
                ...defaultProps,
                className: 'class'
            }
            const container = shallow(<FavouriteLeagueIcon {...props} />)
            const instance = container.instance();
            instance.state.isFavourite = false;
            instance.state.isShowTooltip = false;
            // Act
            const result = container.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});