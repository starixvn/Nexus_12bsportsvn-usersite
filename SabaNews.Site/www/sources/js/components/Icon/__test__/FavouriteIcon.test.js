import React from 'react';
import { shallow } from 'enzyme';
import FavouriteIcon from '../FavouriteIcon';
import CommonFunctions from '@jsroot/common/common-functions'

describe('FavouriteIcon', () => {
    let defaultProps = {
        matchId: 0
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('init correctly state isFavouriteMatch = false', () => {
            // Arrange && Act
            const instance = shallow(<FavouriteIcon {...defaultProps} />).instance();
            CommonFunctions.getFavouriteMatches = jest.fn().mockReturnValue([1,2]);

            // Assert
            expect(instance.state).toEqual({
                isFavourite: false,
                isShowTooltip: true
            });

        });

        it('init correctly state isFavouriteMatch = true', () => {
            // Arrange && Act
            const props = {
                ...defaultProps,
                matchId: 1
            };
            const instance = shallow(<FavouriteIcon {...props} />).instance();
            CommonFunctions.getFavouriteMatches = jest.fn().mockReturnValue([1,2]);

            // Assert
            expect(instance.state).toEqual({
                isFavourite: true,
                isShowTooltip: true
            });

        });
    });

    describe('componentDidUpdate', () => {
        it('update fav when flagToggle is change', () => {
            // Arrange
            const matches = [1, 2];
            const props = {
                ...defaultProps,
                flagToggle: false,
                matchId: 1
            }
            CommonFunctions.getFavouriteMatches = jest.fn().mockReturnValue(matches);
            const container = shallow(<FavouriteIcon {...props} />);
            const instance = container.instance();
            instance.state.isFavourite = false;

            // Act
            instance.componentDidUpdate({flagToggle:true});
            // Assert
            expect(instance.state.isFavourite).toEqual(true);
        });

        it('remain fav when flagToggle is change', () => {
            // Arrange
            const matches = [1, 2];
            const props = {
                ...defaultProps,
                flagToggle: false,
                matchId: 3
            }
            CommonFunctions.getFavouriteMatches = jest.fn().mockReturnValue(matches);
            const container = shallow(<FavouriteIcon {...props} />);
            const instance = container.instance();
            instance.state.isFavourite = false;

            // Act
            instance.componentDidUpdate({flagToggle:true});
            // Assert
            expect(instance.state.isFavourite).toEqual(false);
        });
    });

    describe('handleUpdateFavourite', () => {
        it('setState correctly when isFavouriteMatch = true', () => {
             // Arrange
            const instance = shallow(<FavouriteIcon {...defaultProps} />).instance();
            instance.onUpdateFavouriteMatch = jest.fn();
            CommonFunctions.updateFavouriteMatch = jest.fn().mockReturnValue(true);

            // Act
            const result = instance.handleUpdateFavourite();

            // Assert
            expect(instance.onUpdateFavouriteMatch).toHaveBeenCalled();
            expect(instance.state).toEqual({
                isFavourite: true,
                isShowTooltip: false
            });
        });

        it('setState correctly when isFavouriteMatch = false', () => {
            // Arrange
           const instance = shallow(<FavouriteIcon {...defaultProps} />).instance();
           instance.onUpdateFavouriteMatch = jest.fn();
           CommonFunctions.updateFavouriteMatch = jest.fn().mockReturnValue(false);

           // Act
           instance.handleUpdateFavourite();

           // Assert
           expect(instance.onUpdateFavouriteMatch).toHaveBeenCalled();
           expect(instance.state).toEqual({
               isFavourite: false,
               isShowTooltip: false
           });
       });
    });

    describe('renderTooltip', () => {
        it('return correctly when isFavourite = false', () => {
            // Arrange
           const instance = shallow(<FavouriteIcon {...defaultProps} />).instance();
            instance.setState({isFavourite: false})
           // Act
           const result = instance.handleUpdateFavourite();

           // Assert
           expect(result).toMatchSnapshot();
        });

        it('return correctly when isFavourite = true', () => {
            // Arrange
            const instance = shallow(<FavouriteIcon {...defaultProps} />).instance();
            instance.setState({isFavourite: true})
           // Act
           const result = instance.handleUpdateFavourite();

           // Assert
           expect(result).toMatchSnapshot();
        });
    });

    describe('onMouseOut', () => {
        it('setState correctly when isShowTooltip = false', () => {
            // Arrange
            const instance = shallow(<FavouriteIcon {...defaultProps} />).instance();
            instance.setState({isShowTooltip: false})
           // Act

           instance.onMouseOut();

           // Assert
           expect(instance.state.isShowTooltip).toEqual(true);
        });

        it('setState correctly when isShowTooltip = true', () => {
            // Arrange
            const instance = shallow(<FavouriteIcon {...defaultProps} />).instance();
            instance.setState({isShowTooltip: true, isFavourite:false})
           // Act

           instance.onMouseOut();

           // Assert
           expect(instance.state.isShowTooltip).toEqual(true);
        });
    });

    describe('onUpdateFavouriteMatch', () => {
        it('call correctly function with defaut props', () => {
            // Arrange
            const container = shallow(<FavouriteIcon {...defaultProps} />)

            // Act
            container.simulate('click');
        });

        it('call correctly function when props have function onUpdateFavouriteMatch', () => {
            // Arrange
            const props = {
                ...defaultProps,
                onUpdateFavouriteMatch: jest.fn()
            }
            const container = shallow(<FavouriteIcon {...props} />)
            const instance = container.instance();
            // Act
            instance.onUpdateFavouriteMatch();

           // Assert
           expect(props.onUpdateFavouriteMatch).toHaveBeenCalled();
        });
    });

    describe('renders', () => {
        it('render correctly when isFavourite = true', () => {
            // Arrange
            const container = shallow(<FavouriteIcon {...defaultProps} />)
            const instance = container.instance();
            instance.setState({isFavourite: true, isShowTooltip: true});
            // Act
            const result = container.render();

           // Assert
           expect(result).toMatchSnapshot();
        });

        it('render correctly when isFavourite = false', () => {
            // Arrange
            const props = {
                ...defaultProps,
                onUpdateFavouriteMatch: jest.fn()
            }
            const container = shallow(<FavouriteIcon {...props} />)
            const instance = container.instance();
            instance.setState({isFavourite: false, isShowTooltip: false});
            // Act
            const result = container.render();

           // Assert
           expect(result).toMatchSnapshot();
        });
    });
});