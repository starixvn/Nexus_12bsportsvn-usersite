import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Breadscrum } from '../Breadscrum';

describe('Breadscrum', () => {
    let defaultProps = {
        currentPage: '',
        currentPageUrl: ''
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('render correctly', () => {
         // Act
         const container = shallow(<Breadscrum {...defaultProps} />);

         // Assert
         expect(toJson(container)).toMatchSnapshot();
    });

    describe('handleClick', () => {
        const { location } = window;

        beforeAll(() => {
            delete window.location;
            window.location = { href: '' };
        });

        afterAll(() => {
            window.location = location;
        });
        it('calls correctly when ctrlKey = true', () => {
             // Arrange
             const event = {
                ctrlKey: true
            };
            window.open = jest.fn();
            const container = shallow(<Breadscrum {...defaultProps} />);


            // Act
            container.find('.breadcrumb').find('li').first().simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledWith('/lich-thi-dau/bong-da', '_blank');
        });

        it('calls correctly when ctrlKey = false', () => {
            // Arrange
            const event = {
               ctrlKey: false
           };
           window.open = jest.fn();
           const container = shallow(<Breadscrum {...defaultProps} />);

           // Act
           container.find('.breadcrumb').find('li').first().simulate('click', event);

           // Assert
           expect(window.open).toHaveBeenCalledTimes(0);
           expect(window.location).toEqual('/lich-thi-dau/bong-da');
       });

       it('calls correctly when click into current page', () => {
            // Arrange
            const event = {
                ctrlKey: false
            };
            window.open = jest.fn();
            const props = {
                ...defaultProps,
                currentPageUrl: 'current'
            };
            const container = shallow(<Breadscrum {...props} />);
            const currentPageUrl = 'current';
            // Act
            container.find('.breadcrumb').find('li').last().simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual(currentPageUrl);
        });
    });
});