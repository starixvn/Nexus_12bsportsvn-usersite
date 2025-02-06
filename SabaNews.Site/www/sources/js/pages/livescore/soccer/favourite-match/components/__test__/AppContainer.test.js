import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AppContainer } from '../AppContainer';
import CommonFunctions from '@jsroot/common/common-functions';

describe('AppContainer', () => {
    const defaultProps = {
        majorLeagues: [],
        matches: [],
        postMatches: [],
        preMatches: [],
        liveMatches: [],
        getFavLeagues: jest.fn(),
        getMatches: jest.fn(),
        getLeagues: jest.fn(),
        getLastestNews: jest.fn(),
        navigate: jest.fn(),
        setFavouriteMatches: jest.fn(),
        setFlagToggleIcon: jest.fn(),
        setFavLeagues: jest.fn()
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        let location;
        const mockLocation = new URL("https://example.com");
        beforeEach(() => {
            location = window.location;
            mockLocation.replace = jest.fn();
            delete window.location;
            window.location = mockLocation;
        });
        afterEach(() => {
            window.location = location;
        });
        it('init correctly state when url dont have tab param', () => {
            // Arrange & Act
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Assert
            expect(instance.state).toEqual({
                selectedTab: 'tat-ca',
                selectedAllTab: false,
                selectedLiveTab: false,
                selectedPreTab: false,
                selectedPostTab: false
            });
        });

        it('init correctly state when url have tab param = tat-ca', () => {
            // Arrange
            window.location.search = 'tab=tat-ca';

            // Act
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Assert
            expect(instance.state).toEqual({
                selectedTab: 'tat-ca',
                selectedAllTab: false,
                selectedLiveTab: false,
                selectedPreTab: false,
                selectedPostTab: false
            });
        });

        it('init correctly state when url have tab param = truc-tiep', () => {
            // Arrange
            window.location.search = 'tab=truc-tiep';

            // Act
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Assert
            expect(instance.state).toEqual({
                selectedTab: 'truc-tiep',
                selectedAllTab: false,
                selectedLiveTab: true,
                selectedPreTab: false,
                selectedPostTab: false
            });
        });

        it('init correctly state when url have tab param = chua-dien-ra', () => {
            // Arrange
            window.location.search = 'tab=chua-dien-ra';

            // Act
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Assert
            expect(instance.state).toEqual({
                selectedTab: 'chua-dien-ra',
                selectedAllTab: false,
                selectedLiveTab: false,
                selectedPreTab: true,
                selectedPostTab: false
            });
        });

        it('init correctly state when url have tab param = da-dien-ra', () => {
            // Arrange
            window.location.search = 'tab=da-dien-ra';

            // Act
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Assert
            expect(instance.state).toEqual({
                selectedTab: 'da-dien-ra',
                selectedAllTab: false,
                selectedLiveTab: false,
                selectedPreTab: false,
                selectedPostTab: true
            });
        });
    });
    describe('componentDidMount', () => {
        it('call correctly functions', () =>  {
            // Arrange
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Act
            instance.componentDidMount();

            // Assert
            expect(defaultProps.getFavLeagues).toHaveBeenCalled();
            expect(defaultProps.getMatches).toHaveBeenCalled();
            expect(defaultProps.getLeagues).toHaveBeenCalled();
            expect(defaultProps.getLastestNews).toHaveBeenCalled();
        });
    });

    describe('handleSelectTab', () => {
        it('set correctly state when SelectTab is empty', () => {
            // Arrange
            const instance = shallow(<AppContainer {...defaultProps} />).instance();
            instance.setState({
                selectedTab: '',
                selectedAllTab: false,
                selectedLiveTab: false,
                selectedPreTab: false,
                selectedPostTab: false
            });
            // Act
            instance.handleSelectTab('');

            // Assert
            expect(instance.state).toEqual({
                selectedTab: '',
                selectedAllTab: false,
                selectedLiveTab: false,
                selectedPreTab: false,
                selectedPostTab: false
            });
            expect(defaultProps.navigate).toHaveBeenCalledWith('/lich-thi-dau/bong-da/tran-dau-quan-tam?tab=');
        });


        it('set correctly state when SelectTab is tat-ca & current state is false', () => {
            // Arrange
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Act
            instance.handleSelectTab('tat-ca');

            // Assert
            expect(instance.state).toEqual({
                selectedTab: 'tat-ca',
                selectedAllTab: true,
                selectedLiveTab: false,
                selectedPreTab: false,
                selectedPostTab: false
            });
            expect(defaultProps.navigate).toHaveBeenCalledWith('/lich-thi-dau/bong-da/tran-dau-quan-tam?tab=tat-ca');
        });

        it('set correctly state when SelectTab is tat-ca & current state is true', () => {
            // Arrange
            const instance = shallow(<AppContainer {...defaultProps} />).instance();
            instance.setState({
                selectedTab: '',
                selectedAllTab: true,
                selectedLiveTab: false,
                selectedPreTab: false,
                selectedPostTab: false
            });
            // Act
            instance.handleSelectTab('tat-ca');

            // Assert
            expect(instance.state).toEqual({
                selectedTab: 'tat-ca',
                selectedAllTab: true,
                selectedLiveTab: false,
                selectedPreTab: false,
                selectedPostTab: false
            });
            expect(defaultProps.navigate).toHaveBeenCalledWith('/lich-thi-dau/bong-da/tran-dau-quan-tam?tab=tat-ca');
        });

        it('set correctly state when SelectTab is truc-tiep & current state is false', () => {
            // Arrange
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Act
            instance.handleSelectTab('truc-tiep');

            // Assert
            expect(instance.state).toEqual({
                selectedTab: 'truc-tiep',
                selectedAllTab: false,
                selectedLiveTab: true,
                selectedPreTab: false,
                selectedPostTab: false
            });
            expect(defaultProps.navigate).toHaveBeenCalledWith('/lich-thi-dau/bong-da/tran-dau-quan-tam?tab=truc-tiep');
        });

        it('set correctly state when SelectTab is truc-tiep & current state is true', () => {
            // Arrange
            const instance = shallow(<AppContainer {...defaultProps} />).instance();
            instance.setState({
                selectedTab: '',
                selectedAllTab: true,
                selectedLiveTab: true,
                selectedPreTab: true,
                selectedPostTab: true
            });
            // Act
            instance.handleSelectTab('truc-tiep');

            // Assert
            expect(instance.state).toEqual({
                selectedTab: 'truc-tiep',
                selectedAllTab: true,
                selectedLiveTab: true,
                selectedPreTab: true,
                selectedPostTab: true
            });
            expect(defaultProps.navigate).toHaveBeenCalledWith('/lich-thi-dau/bong-da/tran-dau-quan-tam?tab=truc-tiep');
        });

        it('set correctly state when SelectTab is chua-dien-ra & current state is false', () => {
            // Arrange
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Act
            instance.handleSelectTab('chua-dien-ra');

            // Assert
            expect(instance.state).toEqual({
                selectedTab: 'chua-dien-ra',
                selectedAllTab: false,
                selectedLiveTab: false,
                selectedPreTab: true,
                selectedPostTab: false
            });
            expect(defaultProps.navigate).toHaveBeenCalledWith('/lich-thi-dau/bong-da/tran-dau-quan-tam?tab=chua-dien-ra');
        });

        it('set correctly state when SelectTab is chua-dien-ra & current state is true', () => {
            // Arrange
            const instance = shallow(<AppContainer {...defaultProps} />).instance();
            instance.setState({
                selectedTab: '',
                selectedAllTab: true,
                selectedLiveTab: true,
                selectedPreTab: true,
                selectedPostTab: true
            });
            // Act
            instance.handleSelectTab('chua-dien-ra');

            // Assert
            expect(instance.state).toEqual({
                selectedTab: 'chua-dien-ra',
                selectedAllTab: true,
                selectedLiveTab: true,
                selectedPreTab: true,
                selectedPostTab: true
            });
            expect(defaultProps.navigate).toHaveBeenCalledWith('/lich-thi-dau/bong-da/tran-dau-quan-tam?tab=chua-dien-ra');
        });

        it('set correctly state when SelectTab is da-dien-ra & current state is false', () => {
            // Arrange
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Act
            instance.handleSelectTab('da-dien-ra');

            // Assert
            expect(instance.state).toEqual({
                selectedTab: 'da-dien-ra',
                selectedAllTab: false,
                selectedLiveTab: false,
                selectedPreTab: false,
                selectedPostTab: true
            });
            expect(defaultProps.navigate).toHaveBeenCalledWith('/lich-thi-dau/bong-da/tran-dau-quan-tam?tab=da-dien-ra');
        });

        it('set correctly state when SelectTab is da-dien-ra & current state is true', () => {
            // Arrange
            const instance = shallow(<AppContainer {...defaultProps} />).instance();
            instance.setState({
                selectedTab: '',
                selectedAllTab: true,
                selectedLiveTab: true,
                selectedPreTab: true,
                selectedPostTab: true
            });
            // Act
            instance.handleSelectTab('da-dien-ra');

            // Assert
            expect(instance.state).toEqual({
                selectedTab: 'da-dien-ra',
                selectedAllTab: true,
                selectedLiveTab: true,
                selectedPreTab: true,
                selectedPostTab: true
            });
            expect(defaultProps.navigate).toHaveBeenCalledWith('/lich-thi-dau/bong-da/tran-dau-quan-tam?tab=da-dien-ra');
        });
    });

    describe('onToggleIcon call correctly function', () => {
        // Arrange
        const instance = shallow(<AppContainer {...defaultProps} />).instance();

        // Act
        instance.onToggleIcon();

        // Assert
        expect(defaultProps.setFlagToggleIcon).toHaveBeenCalled();
    });

    describe('onUpdateFavLeague call correctly function', () => {
        // Arrange
        const instance = shallow(<AppContainer {...defaultProps} />).instance();

        // Act
        instance.onUpdateFavLeague();

        // Assert
        expect(defaultProps.setFavLeagues).toHaveBeenCalled();
        expect(defaultProps.setFlagToggleIcon).toHaveBeenCalled();
    });


    describe('render', () => {
        it('render correctly with default props', () => {
            // Arrange
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Act
            const result = shallow(instance.render());

            // Assert
            expect(toJson(result)).toMatchSnapshot();
        });

        it('render correctly when have data in all matches', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{matchId: 1}],
                liveMatches: [{matchId: 1}],
                preMatches: [{matchId: 1}],
                postMatches: [{matchId: 1}]
            }
            const instance = shallow(<AppContainer {...defaultProps} />).instance();
            instance.handleSelectTab = jest.fn();
            instance.onUpdateFavouriteMatch = jest.fn();
            // Act
            const result = shallow(instance.render());

            // Assert
            expect(toJson(result)).toMatchSnapshot();
        });
    });
});