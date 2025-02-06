import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { FunctionBar } from '../FunctionBar';
import CommonFunctions from '@jsroot/common/common-functions';

describe('FunctionBar', () => {
    let defaultProps = {
        match: {
            generalInfo: {isLineup: false},
            incidents: [],
            lineup: null,
            headToHead: null,
            statistic: null
        },
        setActiveTab: jest.fn(() => '')
    };
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('componentDidMount', () => {
        it('calls correctly functions', () => {
            // Arrange
            const tabStatus = {
                enableTabSummary: true,
                enableTabStatistics: true,
                enableTabLineups: true,
                enableTabHeadtohead: true
            };
            const container = shallow(<FunctionBar {...defaultProps} />);
            const instance = container.instance();
            instance.updateTabStatus = jest.fn().mockReturnValue(tabStatus);
            instance.getDefaultActiveKey = jest.fn(() => '').mockReturnValue('');

            // Act
            instance.componentDidMount();

            // Assert
            expect(instance.updateTabStatus).toHaveBeenCalled();
            expect(instance.getDefaultActiveKey).toHaveBeenCalledWith(tabStatus);
            expect(defaultProps.setActiveTab).toHaveBeenCalledWith('');
        });
    });

    describe('updateTabStatus', () => {
        it('return correctly when called function', () => {
            // Arrange
            const container = shallow(<FunctionBar {...defaultProps}/>);
            const instance = container.instance();
            instance.checkEnableLineup = jest.fn().mockReturnValue(false);
            instance.checkEnableH2H = jest.fn().mockReturnValue(true);
            instance.checkEnableStatistics = jest.fn().mockReturnValue(false);
            instance.checkEnableIncident = jest.fn().mockReturnValue(true);

            // Act
            const result = instance.updateTabStatus();

            // Assert
            expect(result.enableTabSummary).toEqual(true);
            expect(result.enableTabStatistics).toEqual(false);
            expect(result.enableTabLineups).toEqual(false);
            expect(result.enableTabHeadtohead).toEqual(true);
        });
    });

    describe('checkEnableIncident', () => {
        it('return false when call function', () => {
            // Arrange
            const generalInfo = { status: 0 };
            const incident = null;
            const container = shallow(<FunctionBar {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.checkEnableIncident(generalInfo, incident);

            // Assert
            expect(result).toEqual(false);
        });

        it('return true when call function', () => {
            // Arrange
            const generalInfo = { status: 50 };
            const incident = [{ matchId: 1, type: 2 }, {matchId: 1, type: 15}];
            const container = shallow(<FunctionBar {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.checkEnableIncident(generalInfo, incident);

            // Assert
            expect(result).toEqual(true);
        });
    });

    describe('checkEnableStatistics', () => {
        it('return false when call function', () => {
            // Arrange
            const generalInfo = { status: 0 };
            const statistic = {homeStatistic: [], awayStatistic: []};
            const container = shallow(<FunctionBar {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.checkEnableStatistics(generalInfo, statistic);

            // Assert
            expect(result).toEqual(false);
        });

        it('return true when call function', () => {
            // Arrange
            const generalInfo = { status: 50 };
            const statistic = {homeStatistic: [{ onGoal: 3 }], awayStatistic: [{ onGoal: 2 }]};
            const container = shallow(<FunctionBar {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.checkEnableStatistics(generalInfo, statistic);

            // Assert
            expect(result).toEqual(true);
        });
    });

    describe('checkEnableLineup', () => {
        it('return false when dont have line up data', () => {
            // Arrange
            const generalInfo = { status: 0, isLineUp: null };
            const lineup = null;
            const container = shallow(<FunctionBar {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.checkEnableLineup(generalInfo, lineup);

            // Assert
            expect(result).toEqual(false);
        });


        it('return false when lineup home and away is empty ', () => {
            // Arrange
            const generalInfo = { status: 0, isLineUp: 1 };
            const lineup = {
                generalInfo: {homeFormation: '4-3-3', awayFormation: '5-5-2'},
                home: [],
                away: []
            };
            const container = shallow(<FunctionBar {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.checkEnableLineup(generalInfo, lineup);

            // Assert
            expect(result).toEqual(false);
        });

        it('return false when general lineup = 0', () => {
            // Arrange
            const generalInfo = { status: 0, isLineUp: 0 };
            const lineup = null;
            const container = shallow(<FunctionBar {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.checkEnableLineup(generalInfo, lineup);

            // Assert
            expect(result).toEqual(false);
        });

        it('return true when call function', () => {
            // Arrange
            const generalInfo = { status: 50, isLineUp: 1 };
            const lineup = {
                generalInfo: { homeFormation: "3-4-4", awayFormation: "1-2-3" },
                home: [{ playerId: 1, playerName: "name1" }],
                away: [{ playerId: 2, playerName: "name2" }]
            };
            const container = shallow(<FunctionBar {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.checkEnableLineup(generalInfo, lineup);

            // Assert
            expect(result).toEqual(true);
        });
    });


    describe('checkEnableH2H', () => {
        it('return false when call function', () => {
            // Arrange
            const h2h = {
                common: []
            };
            const container = shallow(<FunctionBar {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.checkEnableH2H(h2h);

            // Assert
            expect(result).toEqual(false);
        });

        it('return true when call function', () => {
            // Arrange
            const h2h = {
                common: [{ matchId: 1 }]
            };
            const container = shallow(<FunctionBar {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.checkEnableH2H(h2h);

            // Assert
            expect(result).toEqual(true);
        });
    });

    describe('getDefaultActiveKey', () => {
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
        it('return tab dien-bien when defaultTab is empty', () => {
            // Arrange
            //window.location.search = "bong-da/12345";
            const tabStatus = {
                enableTabSummary: true,
                enableTabStatistics: true,
                enableTabLineups: true,
                enableTabHeadtohead: true
            };
            const container = shallow(<FunctionBar {...defaultProps}/>);
            const instance = container.instance();

            //Act
            const result = instance.getDefaultActiveKey(tabStatus);

            //Assert
            expect(result).toEqual('dien-bien');
        });

        it('return tab thong-ke when tab summary is disabled', () => {
            // Arrange
            window.location.search = 'tab=dien-bien';
            const tabStatus = {
                enableTabSummary: false,
                enableTabStatistics: true,
                enableTabLineups: true,
                enableTabHeadtohead: true
            };
            const container = shallow(<FunctionBar {...defaultProps}/>);
            const instance = container.instance();

            //Act
            const result = instance.getDefaultActiveKey(tabStatus);

            //Assert
            expect(result).toEqual('thong-ke');
        });

        it('return tab lineup when when default tab is lineup', () => {
            // Arrange
            window.location.search = 'tab=doi-hinh';
            const tabStatus = {
                enableTabSummary: true,
                enableTabStatistics: true,
                enableTabLineups: true,
                enableTabHeadtohead: true
            };
            const container = shallow(<FunctionBar {...defaultProps}/>);
            const instance = container.instance();

            //Act
            const result = instance.getDefaultActiveKey(tabStatus);

            //Assert
            expect(result).toEqual('doi-hinh');
        });
    });

    describe('scrollToTab', () => {
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
        it('run correctly when tab is invalid', () => {
            // Arrange
            const container = shallow(<FunctionBar {...defaultProps}/>);
            const instance = container.instance();
            const tab = 'invalid';
            // Act
            instance.scrollToTab(tab);
        });

        it('run correctly when resolution is desktop', () => {
            // Arrange
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
            const tab = 'dien-bien';
            defaultProps.match.generalInfo = {matchId: 1}
            defaultProps.navigate = jest.fn(() => 'url');
            CommonFunctions.getTeamName = jest.fn().mockReturnValue("teamname");
            CommonFunctions.getLeagueName = jest.fn().mockReturnValue("leaguename");
            const container = shallow(<FunctionBar {...defaultProps}/>);
            const instance = container.instance();
            // Act
            instance.scrollToTab(tab);

            //Assert
            expect(window.innerWidth).toBe(768);
            expect(document.querySelector).toHaveBeenCalledTimes(2);
            expect(window.scroll).toHaveBeenCalled();
            expect(defaultProps.setActiveTab).toHaveBeenCalled();
        });

        it('run correctly when resolution is mobile', () => {
            // Arrange
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
                    case  '.block-line-up-title':
                        return mMobileHeader;
                }
            });
            const tab = 'dien-bien';
            defaultProps.match.generalInfo = {matchId: 1}
            defaultProps.navigate = jest.fn(() => 'url');
            CommonFunctions.getTeamName = jest.fn().mockReturnValue("teamname");
            CommonFunctions.getLeagueName = jest.fn().mockReturnValue("leaguename");
            const container = shallow(<FunctionBar {...defaultProps}/>);
            const instance = container.instance();
            // Act
            instance.scrollToTab(tab);

            //Assert
            expect(window.innerWidth).toBe(480);
            expect(document.querySelector).toHaveBeenCalledTimes(3);
            expect(window.scroll).toHaveBeenCalled();
            expect(defaultProps.setActiveTab).toHaveBeenCalled();
        });
    });

    describe('checkTabEnable', () => {
        it('return correctly when all tab is disabled', () => {
            // Arrange
            const tabStatus = {
                enableTabSummary: false,
                enableTabStatistics: false,
                enableTabLineups: false,
                enableTabHeadtohead: false
            };
            const container = shallow(<FunctionBar {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const  result = instance.checkTabEnable(tabStatus);

            // Assert
            expect(result).toEqual(false)
        });

        it('return correctly when have tab enabled', () => {
            // Arrange
            const tabStatus = {
                enableTabSummary: false,
                enableTabStatistics: true,
                enableTabLineups: false,
                enableTabHeadtohead: false
            };
            const container = shallow(<FunctionBar {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const  result = instance.checkTabEnable(tabStatus);

            // Assert
            expect(result).toEqual(true)
        });
    });
    describe('render', () => {
        it('renders correctly with default props', () => {
            // Arrange
            const tabStatus = {
                enableTabSummary: true,
                enableTabStatistics: true,
                enableTabLineups: true,
                enableTabHeadtohead: true
            }
            const container = shallow(<FunctionBar {...defaultProps} />);
            const instance = container.instance();
            instance.scrollToTab = jest.fn(() => '');
            instance.updateTabStatus = jest.fn().mockReturnValue(tabStatus);
            instance.checkTabEnable = jest.fn(() => '');

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('renders correctly when all tab disabled', () => {
            // Arrange
            const tabStatus = {
                enableTabSummary: false,
                enableTabStatistics: false,
                enableTabLineups: false,
                enableTabHeadtohead: false
            }
            const container = shallow(<FunctionBar {...defaultProps} />);
            const instance = container.instance();
            instance.scrollToTab = jest.fn(() => '');
            instance.updateTabStatus = jest.fn().mockReturnValue(tabStatus);
            instance.checkTabEnable = jest.fn(() => '');

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('renders correctly when active tab = dien-bien', () => {
            // Arrange
            const tabStatus = {
                enableTabSummary: false,
                enableTabStatistics: false,
                enableTabLineups: false,
                enableTabHeadtohead: false
            };
            const props = {
                ...defaultProps,
                activeTab: 'dien-bien'
            };
            const container = shallow(<FunctionBar {...props} />);
            const instance = container.instance();
            instance.scrollToTab = jest.fn(() => '');
            instance.updateTabStatus = jest.fn().mockReturnValue(tabStatus);
            instance.checkTabEnable = jest.fn(() => '');

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('renders correctly when active tab = thong-ke', () => {
            // Arrange
            const tabStatus = {
                enableTabSummary: false,
                enableTabStatistics: false,
                enableTabLineups: false,
                enableTabHeadtohead: false
            };
            const props = {
                ...defaultProps,
                activeTab: 'thong-ke'
            };
            const container = shallow(<FunctionBar {...props} />);
            const instance = container.instance();
            instance.scrollToTab = jest.fn(() => '');
            instance.updateTabStatus = jest.fn().mockReturnValue(tabStatus);
            instance.checkTabEnable = jest.fn(() => '');

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('renders correctly when active tab = doi-hinh', () => {
            // Arrange
            const tabStatus = {
                enableTabSummary: false,
                enableTabStatistics: false,
                enableTabLineups: false,
                enableTabHeadtohead: false
            };
            const props = {
                ...defaultProps,
                activeTab: 'doi-hinh'
            };
            const container = shallow(<FunctionBar {...props} />);
            const instance = container.instance();
            instance.scrollToTab = jest.fn(() => '');
            instance.updateTabStatus = jest.fn().mockReturnValue(tabStatus);
            instance.checkTabEnable = jest.fn(() => '');

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('renders correctly when active tab = doi-dau', () => {
            // Arrange
            const tabStatus = {
                enableTabSummary: false,
                enableTabStatistics: false,
                enableTabLineups: false,
                enableTabHeadtohead: false
            };
            const props = {
                ...defaultProps,
                activeTab: 'doi-dau'
            };
            const container = shallow(<FunctionBar {...props} />);
            const instance = container.instance();
            instance.scrollToTab = jest.fn(() => '');
            instance.updateTabStatus = jest.fn().mockReturnValue(tabStatus);
            instance.checkTabEnable = jest.fn(() => '');

            // Act
            const result = instance.render();

            // Assert
            container.find('ul li a').at(0).simulate('click');
            container.find('ul li a').at(1).simulate('click');
            container.find('ul li a').at(2).simulate('click');
            container.find('ul li a').at(3).simulate('click');
            expect(result).toMatchSnapshot();
        });

    });
});