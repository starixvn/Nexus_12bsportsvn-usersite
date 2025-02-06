import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Input from '../Input';

describe('Input', () => {
    const defaultProps = {
        open: false,
        onClick: jest.fn(),
        onToggle: jest.fn()
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly when open = false', () => {
        // Act
        const container = shallow(<Input {...defaultProps} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when open = true', () => {
        // Arrange
        const props = { ...defaultProps, open: true };

        // Act
        const container = shallow(<Input {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('calls correctly function when click on element', () => {
        // Arrange
        const container = shallow(<Input {...defaultProps} />);

        // Act
        container.find('i').simulate('click');

        // Assert
        expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
        expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
    });
});