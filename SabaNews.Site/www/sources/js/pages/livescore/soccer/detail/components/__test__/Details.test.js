import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Details } from '../Details';

describe('Details', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('componentDidMount', () => {
        let location;
        const mockLocation = new URL("https://example.com");
        beforeEach(() => {
            location = window.location;
            mockLocation.replace = jest.fn();
            delete window.location;
            window.location = mockLocation;
            const appContainer = document.createElement('div');
            appContainer.setAttribute('id', 'dien-bien');
            document.body.appendChild(appContainer);
        });
        afterEach(() => {
            window.location = location;
        });
        it('work correctly when has not default tab', () => {
            // Arrange
            const container = shallow(<Details />);
            const instance = container.instance();
            window.scroll = jest.fn()

            // Act
            instance.componentDidMount();

            //Assert
            expect(window.scroll).toHaveBeenCalledTimes(0);

        });

        it('work correctly when has default tab', () => {
            // Arrange
            const container = shallow(<Details />);
            const instance = container.instance();
            window.scroll = jest.fn();
            window.location.search = 'tab=dien-bien';
            global.innerWidth = 768;

            const mHeader = { getBoundingClientRect: jest.fn().mockReturnValueOnce({ offsetHeight: 100 }) };
            const mMobileHeader = { getBoundingClientRect: jest.fn().mockReturnValueOnce({ offsetHeight: 100 }) };
            const spyFunc = jest.fn();
            Object.defineProperty(global.document, 'querySelector', { value: spyFunc, configurable: true });
            jest.spyOn(document, 'querySelector').mockImplementation((selector) => {
                switch (selector) {
                    case '.detail-fixed':
                    return mHeader;
                    case '.header':
                    return mMobileHeader;
                }
            });

            // Act
            instance.componentDidMount();

            //Assert
            expect(window.innerWidth).toBe(768);
            expect(document.querySelector).toHaveBeenCalledTimes(2);
            expect(window.scroll).toHaveBeenCalled();

        });

        it('work correctly when is mobile', () => {
            // Arrange
            const container = shallow(<Details />);
            const instance = container.instance();
            window.scroll = jest.fn();
            window.location.search = 'tab=dien-bien';
            global.innerWidth = 480;

            const mHeader = { getBoundingClientRect: jest.fn().mockReturnValueOnce({ offsetHeight: 100 }) };
            const mMobileHeader = { getBoundingClientRect: jest.fn().mockReturnValueOnce({ offsetHeight: 100 }) };
            const spyFunc = jest.fn();
            Object.defineProperty(global.document, 'querySelector', { value: spyFunc, configurable: true });
            jest.spyOn(document, 'querySelector').mockImplementation((selector) => {
                switch (selector) {
                    case '.detail-fixed':
                        return mHeader;
                    case '.header':
                        return mMobileHeader;
                    case '.block-line-up-title':
                        return mMobileHeader;
                }
            });
            // Act
            instance.componentDidMount();

            //Assert
            expect(window.innerWidth).toBe(480);
            expect(document.querySelector).toHaveBeenCalledTimes(3);
            expect(window.scroll).toHaveBeenCalled();

        });
    });

    describe('render', () => {
        it('render correctly when call function', () => {
            // Arrange
            const container = shallow(<Details />);
            const instance = container.instance();

            // Act
            const result = shallow(instance.render());

            //Assert
            expect(toJson(result)).toMatchSnapshot();
        })
    });
});