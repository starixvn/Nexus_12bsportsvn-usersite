import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
    let defaultProps = {
        searchKey: '',
        setSearchKey: jest.fn()
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        // Act
        const container = shallow(<SearchBar {...defaultProps} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    describe('onChange', () => {
        it('calls correctly functions', () => {
            // Arrange
            const container = shallow(<SearchBar {...defaultProps} />);

            // Act
            container.find('#livescore-soccer-searchbox').simulate('change', { target: { value: 'key' } });

            // Assert
            expect(defaultProps.setSearchKey).toHaveBeenCalledWith('key');
        });
    });
});