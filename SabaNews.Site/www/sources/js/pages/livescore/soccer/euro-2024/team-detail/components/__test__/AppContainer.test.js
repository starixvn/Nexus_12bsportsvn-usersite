import React from 'react';
import { shallow } from 'enzyme';
import { AppContainer } from '../AppContainer';
import CommonFunctions from '@jsroot/common/common-functions';



describe('AppContainer', () => {
    const defaultProps = {
        preMatches: [],
        postMatches: [],
        team: null,
        players: [],
        profile: null,
        getTeamData: jest.fn()
    };


    afterEach(() => {
        jest.clearAllMocks();
    });


    describe('componentDidMount', () => {
        it('calls correctly functions', () => {
            // Arrange

            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            instance.handleResize = jest.fn();

            // Act
            instance.componentDidMount();

            // Assert
            expect(defaultProps.getTeamData).toHaveBeenCalledTimes(2);
        });
    });


    describe('handleSelectTab', () => {
        it('render empty with default props', () => {
            // Arrange
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            // Act
            instance.handleSelectTab(1);

            // Assert
            expect(instance.state.active).toEqual(1);
        });
    });

    describe('groupPlayers', () => {

        it('return empty group when players is null ', () => {
            // Arrange
           
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.groupPlayers(null);

            // Assert
            expect(result).toEqual([]);
        });
        it('return collectly group when call function ', () => {
            // Arrange
            var players = [
                {playerId: 1, position: 1},
                {playerId: 2, position: 1},
                {playerId: 3, position: 2},
                {playerId: 4, position: 3},
                {playerId: 5, position: 3}
            ];
            var expectedPlayers = [
                { position: 'Huấn luyện viên', positionId: 1, players:[{playerId: 1, position: 1},{playerId: 2, position: 1}] },
                { position: 'Thủ môn', positionId: 2, players:[{playerId: 3, position: 2}] },
                { position: 'Hậu vệ', positionId: 3, players:[{playerId: 4, position: 3},{playerId: 5, position: 3}] }
            ]
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.groupPlayers(players);

            // Assert
            expect(result).toEqual(expectedPlayers);
        });
    })

    describe('renderContent', () => {
        it('render collectly Content when preMatches tab active with default props  ', () => {
            // Arrange
            var expectedPlayers = [
                { position: 'Huấn luyện viên', positionId: 1, players:[{playerId: 1, position: 1},{playerId: 2, position: 1}] },
                { position: 'Thủ môn', positionId: 2, players:[{playerId: 3, position: 2}] },
                { position: 'Hộ vệ', positionId: 3, players:[{playerId: 4, position: 3},{playerId: 5, position: 3}] }
            ]
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            instance.groupPlayers = jest.fn().mockReturnValue(expectedPlayers);
            instance.state.active = 1;
            // Act
            const result = instance.renderContent();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render collectly Content when preMatches tab active with preMatches list  ', () => {
            // Arrange
            var expectedPlayers = [
                { position: 'Huấn luyện viên', positionId: 1, players:[{playerId: 1, position: 1},{playerId: 2, position: 1}] },
                { position: 'Thủ môn', positionId: 2, players:[{playerId: 3, position: 2}] },
                { position: 'Hộ vệ', positionId: 3, players:[{playerId: 4, position: 3},{playerId: 5, position: 3}] }
            ];
            const props = {
                ...defaultProps,
                preMatches: [{matchId: 1}, {matchId: 2}]
            };
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.groupPlayers = jest.fn().mockReturnValue(expectedPlayers);
            instance.state.active = 1;
            // Act
            const result = instance.renderContent();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render collectly Content when postMatches tab active with default props  ', () => {
            // Arrange
            var expectedPlayers = [
                { position: 'Huấn luyện viên', positionId: 1, players:[{playerId: 1, position: 1},{playerId: 2, position: 1}] },
                { position: 'Thủ môn', positionId: 2, players:[{playerId: 3, position: 2}] },
                { position: 'Hộ vệ', positionId: 3, players:[{playerId: 4, position: 3},{playerId: 5, position: 3}] }
            ]
            const props = {
                ...defaultProps,
                postMatches: []
            };
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.groupPlayers = jest.fn().mockReturnValue(expectedPlayers);
            instance.state.active = 2;
            // Act
            const result = instance.renderContent();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render collectly Content when postMatches tab active with postMatches list  ', () => {
            // Arrange
            var expectedPlayers = [
                { position: 'Huấn luyện viên', positionId: 1, players:[{playerId: 1, position: 1},{playerId: 2, position: 1}] },
                { position: 'Thủ môn', positionId: 2, players:[{playerId: 3, position: 2}] },
                { position: 'Hộ vệ', positionId: 3, players:[{playerId: 4, position: 3},{playerId: 5, position: 3}] }
            ];
            const props = {
                ...defaultProps,
                postMatches: [{matchId: 1}, {matchId: 2}]
            };
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.groupPlayers = jest.fn().mockReturnValue(expectedPlayers);
            instance.state.active = 2;
            // Act
            const result = instance.renderContent();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render collectly Content when player tab active with default props  ', () => {
            // Arrange
            var expectedPlayers = [
                { position: 'Huấn luyện viên', positionId: 1, players:[{playerId: 1, position: 1},{playerId: 2, position: 1}] },
                { position: 'Thủ môn', positionId: 2, players:[{playerId: 3, position: 2}] },
                { position: 'Hộ vệ', positionId: 3, players:[{playerId: 4, position: 3},{playerId: 5, position: 3}] }
            ]
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            instance.groupPlayers = jest.fn().mockReturnValue([]);
            instance.state.active = 3;
            // Act
            const result = instance.renderContent();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render collectly Content when player tab active with players list  ', () => {
            // Arrange
            var expectedPlayers = [
                { position: 'Huấn luyện viên', positionId: 1, players:[{playerId: 1, position: 1},{playerId: 2, position: 1}] },
                { position: 'Thủ môn', positionId: 2, players:[{playerId: 3, position: 2}] },
                { position: 'Hộ vệ', positionId: 3, players:[{playerId: 4, position: 3},{playerId: 5, position: 3}] }
            ];
            const props = {
                ...defaultProps,
                players: [{playerId: 1}, {playerId: 2}]
            };
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.groupPlayers = jest.fn().mockReturnValue(expectedPlayers);
            instance.state.active = 3;
            // Act
            const result = instance.renderContent();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render collectly Content when profile tab active with default props  ', () => {
            // Arrange
            var expectedPlayers = [
                { position: 'Huấn luyện viên', positionId: 1, players:[{playerId: 1, position: 1},{playerId: 2, position: 1}] },
                { position: 'Thủ môn', positionId: 2, players:[{playerId: 3, position: 2}] },
                { position: 'Hộ vệ', positionId: 3, players:[{playerId: 4, position: 3},{playerId: 5, position: 3}] }
            ]
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            instance.groupPlayers = jest.fn().mockReturnValue(expectedPlayers);
            instance.state.active = 4;
            // Act
            const result = instance.renderContent();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render collectly Content when player tab active with profile data  ', () => {
            // Arrange
            var expectedPlayers = [
                { position: 'Huấn luyện viên', positionId: 1, players:[{playerId: 1, position: 1},{playerId: 2, position: 1}] },
                { position: 'Thủ môn', positionId: 2, players:[{playerId: 3, position: 2}] },
                { position: 'Hộ vệ', positionId: 3, players:[{playerId: 4, position: 3},{playerId: 5, position: 3}] }
            ];
            const props = {
                ...defaultProps,
                profile: {playerId: 1}
            };
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.groupPlayers = jest.fn().mockReturnValue(expectedPlayers);
            instance.state.active = 4;
            // Act
            const result = instance.renderContent();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render collectly Content when default tab active   ', () => {
            // Arrange
            var expectedPlayers = [
                { position: 'Huấn luyện viên', positionId: 1, players:[{playerId: 1, position: 1},{playerId: 2, position: 1}] },
                { position: 'Thủ môn', positionId: 2, players:[{playerId: 3, position: 2}] },
                { position: 'Hộ vệ', positionId: 3, players:[{playerId: 4, position: 3},{playerId: 5, position: 3}] }
            ];
            const props = {
                ...defaultProps,
                preMatches: [{matchId: 1}]
            };
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.groupPlayers = jest.fn().mockReturnValue(expectedPlayers);
            instance.state.active = 5;
            // Act
            const result = instance.renderContent();

            // Assert
            expect(result).toMatchSnapshot();
        });
    })

    describe('renders', () => {
        it('return null when team data is null', () => {
            // Arrange
            const props = {
                ...defaultProps,
                team: null
            };
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('render correctly when data is valid', () => {
            // Arrange
            const props = {
                ...defaultProps,
                team: {teamId : 1}
            };
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.renderContent = jest.fn().mockReturnValue(<h1>Render content</h1>)
            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    })
});