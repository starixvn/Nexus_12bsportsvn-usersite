import React from 'react';
import { shallow } from 'enzyme';
import GeneralIncident from '../GeneralIncident';

describe('Incident GeneralIncident', () => {
    let defaultProps = {
       incident: null
    };
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('checkIncidentTypeToShowScore', () => {
        it('return false when incident type is finished', () => {
            // Arrange
            const container = shallow(<GeneralIncident {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.checkIncidentTypeToShowScore(12);

            // Assert
            expect(result).toEqual(false);
        });

        it('return true when incident type is Halftime', () => {
            // Arrange
            const container = shallow(<GeneralIncident {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.checkIncidentTypeToShowScore(11);

            // Assert
            expect(result).toEqual(true);
        });

        it('return true when incident type is Penalty', () => {
            // Arrange
            const container = shallow(<GeneralIncident {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.checkIncidentTypeToShowScore(8);

            // Assert
            expect(result).toEqual(true);
        });

        it('return true when incident type is Goal', () => {
            // Arrange
            const container = shallow(<GeneralIncident {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.checkIncidentTypeToShowScore(1);

            // Assert
            expect(result).toEqual(true);
        });

        it('return true when incident type is OwnGoal', () => {
            // Arrange
            const container = shallow(<GeneralIncident {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.checkIncidentTypeToShowScore(17);

            // Assert
            expect(result).toEqual(true);
        });
    });

    describe('getBorder', () => {
        it('return correctly when check home team', () => {
            // Arrange
            const incident = {position: 2}
            const container = shallow(<GeneralIncident {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getBorder(incident, 1);

            // Assert
            expect(result.borderRight).toEqual('none');
        });

        it('return correctly when check home team', () => {
            // Arrange
            const incident = {position: 1}
            const container = shallow(<GeneralIncident {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getBorder(incident, 2);

            // Assert
            expect(result.borderLeft).toEqual('none');
        });

        it('return null when check home team', () => {
            // Arrange
            const incident = {position: 1}
            const container = shallow(<GeneralIncident {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getBorder(incident, 1);

            // Assert
            expect(result).toEqual(null);
        });
    });

    describe('renderSubsitution', () => {
        it('render correctly when incident is home team', () => {
            // Arrange
            const props = {
                incident: {
                    position: 1,
                    timeShow: 12,
                    inPlayer: "inPlayer",
                    outPlayer: "outPlayer",
                }
            }
            const container = shallow(<GeneralIncident {...props}/>);
            const instance = container.instance();
            instance.getBorder = jest.fn();

            // Act
            const result = instance.renderSubsitution();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when incident is home team and time show is empty', () => {
            // Arrange
            const props = {
                incident: {
                    position: 1,
                    timeShow: '',
                    inPlayer: "inPlayer",
                    outPlayer: "outPlayer",
                }
            }
            const container = shallow(<GeneralIncident {...props}/>);
            const instance = container.instance();
            instance.getBorder = jest.fn();

            // Act
            const result = instance.renderSubsitution();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when incident is away team', () => {
            // Arrange
            const props = {
                incident: {
                    position: 2,
                    timeShow: 12,
                    inPlayer: "inPlayer",
                    outPlayer: "outPlayer",
                }
            }
            const container = shallow(<GeneralIncident {...props}/>);
            const instance = container.instance();
            instance.getBorder = jest.fn();

            // Act
            const result = instance.renderSubsitution();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when incident is away team and timeshow is empty', () => {
            // Arrange
            const props = {
                incident: {
                    position: 2,
                    timeShow: '',
                    inPlayer: "inPlayer",
                    outPlayer: "outPlayer",
                }
            }
            const container = shallow(<GeneralIncident {...props}/>);
            const instance = container.instance();
            instance.getBorder = jest.fn();

            // Act
            const result = instance.renderSubsitution();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
    describe('renderGeneral', () => {
        it('render correctly when incident position is home team', () => {
            // Arrange
            const props = {
                incident: {
                    position: 1,
                    timeShow: 12,
                    playerName: "playerName",
                    type: 1,
                    varResult: 0
                }
            }
            const container = shallow(<GeneralIncident {...props}/>);
            const instance = container.instance();
            instance.getBorder = jest.fn();

            // Act
            const result = instance.renderGeneral();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when incident position is home team & is VAR event', () => {
            // Arrange
            const props = {
                incident: {
                    position: 1,
                    timeShow: '',
                    playerName: "playerName",
                    varResult: 1,
                    type: 28
                }
            }
            const container = shallow(<GeneralIncident {...props}/>);
            const instance = container.instance();
            instance.getBorder = jest.fn();

            // Act
            const result = instance.renderGeneral();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when incident position is home team & have assist player', () => {
            // Arrange
            const props = {
                incident: {
                    position: 1,
                    timeShow: 12,
                    playerName: 'playerName',
                    assistName: 'assistName',
                    type: 1

                }
            }
            const container = shallow(<GeneralIncident {...props}/>);
            const instance = container.instance();
            instance.getBorder = jest.fn();

            // Act
            const result = instance.renderGeneral();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when incident position is away team', () => {
            // Arrange
            const props = {
                incident: {
                    position: 2,
                    timeShow: '',
                    playerName: "playerName",
                    varResult: 0
                }
            }
            const container = shallow(<GeneralIncident {...props}/>);
            const instance = container.instance();
            instance.getBorder = jest.fn();

            // Act
            const result = instance.renderGeneral();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when incident position is home team & is VAR event', () => {
            // Arrange
            const props = {
                incident: {
                    position: 2,
                    timeShow: 12,
                    playerName: "playerName",
                    varResult: 1
                }
            }
            const container = shallow(<GeneralIncident {...props}/>);
            const instance = container.instance();
            instance.getBorder = jest.fn();

            // Act
            const result = instance.renderGeneral();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when incident position is home team & have assist player', () => {
            // Arrange
            const props = {
                incident: {
                    position: 2,
                    timeShow: 12,
                    playerName: 'playerName',
                    assistName: 'assistName',
                    type: 1

                }
            }
            const container = shallow(<GeneralIncident {...props}/>);
            const instance = container.instance();
            instance.getBorder = jest.fn();

            // Act
            const result = instance.renderGeneral();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('render', () => {
        it('render nothing when incident is null', () => {
            // Arrange
            const container = shallow(<GeneralIncident {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('render correctly when incident type is subsitution', () => {
            // Arrange
            const props = {
                incident: {
                    type: 9
                }
            }
            const container = shallow(<GeneralIncident {...props}/>);
            const instance = container.instance();
            instance.renderSubsitution = jest.fn().mockReturnValue('Subsitution');
            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when incident type is general ', () => {
            // Arrange
            const props = {
                incident: {
                    type: 1
                }
            }
            const container = shallow(<GeneralIncident {...props}/>);
            const instance = container.instance();
            instance.renderGeneral = jest.fn().mockReturnValue('goal');
            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
})