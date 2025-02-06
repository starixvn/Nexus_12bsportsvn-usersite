import React from 'react';
import { shallow } from 'enzyme';
import TeamIcon from '../TeamIcon';
import CommonFunctions from '@jsroot/common/common-functions'

describe('TeamIcon', () => {
    let defaultProps = {
        className: 'class',
        src: null
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('render correctly when src is null', () => {
        // Arrange & Act
        const container = shallow(<TeamIcon {...defaultProps} />)

       // Assert
       expect(container).toMatchSnapshot();
    });

    it('render correctly when have src', () => {
        // Arrange & Act
        const props = {
            ...defaultProps,
            src: 'src'
        }
        const container = shallow(<TeamIcon {...props} />)

        // Assert
        expect(container).toMatchSnapshot();
    });

    describe('handleClick', () => {
        it('call correctly function', () => {
            // Arrange
            const props = {
                ...defaultProps,
                src: 'src',
                onClick: jest.fn()
            }
            const container = shallow(<TeamIcon {...props} />);

            //Act
            container.simulate('click', {});

            // Assert
            expect(props.onClick).toHaveBeenCalled();
        });

        it('do nothing when onClick function is not exitst', () => {
            // Arrange
            const props = {
                ...defaultProps,
                src: 'src',
            }
            const container = shallow(<TeamIcon {...props} />);

            //Act & Act
            container.simulate('click', {});
        });
    })
})