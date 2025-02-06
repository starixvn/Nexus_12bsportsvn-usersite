import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import IncidentIcon from '../IncidentIcon';
import CommonFunctions from '@jsroot/common/common-functions'

describe('IncidentIcon', () => {
    let defaultProps = {
        type: 0
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('render empty when type is not define', () => {
        // Act
        const container = shallow(<IncidentIcon {...defaultProps} />);

        // Assert
        expect(container.html()).toEqual(null);
    });

    it('render correctly when type is Goal', () => {
        // Arrange
        const props = {
            type: 1
        }

        // Act
        const container = shallow(<IncidentIcon {...props} />);

        // Assert
        expect(container).toMatchSnapshot();
    });

    it('render correctly when type is OwnGoal', () => {
        // Arrange
        const props = {
            type: 17
        }

        // Act
        const container = shallow(<IncidentIcon {...props} />);

        // Assert
        expect(container).toMatchSnapshot();
    });

    it('render correctly when type is Penalty', () => {
        // Arrange
        const props = {
            type: 8
        }

        // Act
        const container = shallow(<IncidentIcon {...props} />);

        // Assert
        expect(container).toMatchSnapshot();
    });

    it('render correctly when type is PenaltyMissed', () => {
        // Arrange
        const props = {
            type: 16
        }

        // Act
        const container = shallow(<IncidentIcon {...props} />);

        // Assert
        expect(container).toMatchSnapshot();
    });

    it('render correctly when type is PenaltyShootOutSuccess', () => {
        // Arrange
        const props = {
            type: 31
        }

        // Act
        const container = shallow(<IncidentIcon {...props} />);

        // Assert
        expect(container).toMatchSnapshot();
    });

    it('render correctly when type s RedCard', () => {
        // Arrange
        const props = {
            type: 4
        }

        // Act
        const container = shallow(<IncidentIcon {...props} />);

        // Assert
        expect(container).toMatchSnapshot();
    });

    it('render correctly when type is YellowCard', () => {
        // Arrange
        const props = {
            type: 3
        }

        // Act
        const container = shallow(<IncidentIcon {...props} />);

        // Assert
        expect(container).toMatchSnapshot();
    });

    it('render correctly when type is YellowTurnRedCard', () => {
        // Arrange
        const props = {
            type: 15
        }

        // Act
        const container = shallow(<IncidentIcon {...props} />);

        // Assert
        expect(container).toMatchSnapshot();
    });

    it('render correctly when type is VAR', () => {
        // Arrange
        const props = {
            type: 28
        }

        // Act
        const container = shallow(<IncidentIcon {...props} />);

        // Assert
        expect(container).toMatchSnapshot();
    });

    it('render correctly when type is outSubsitution', () => {
        // Arrange
        const props = {
            type: 32
        }

        // Act
        const container = shallow(<IncidentIcon {...props} />);

        // Assert
        expect(container).toMatchSnapshot();
    });

    it('render correctly when type is inSubsitution', () => {
        // Arrange
        const props = {
            type: 33
        }

        // Act
        const container = shallow(<IncidentIcon {...props} />);

        // Assert
        expect(container).toMatchSnapshot();
    });
});