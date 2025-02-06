import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import { ActionCreators } from '../actions';
import FavoriteLeagues from '@jsroot/components/FavoriteLeagues';
import FavoriteMatches from '@jsroot/components/FavoriteMatches';
import Banner from '@jsroot/components/Banner';
import DateBar from './DateBar';
import MatchGrid from './match-grid/index';
import SignalR from './SignalR';
import SkeletonGrid from './match-grid/SkeletonGrid';
import DateTimeService from '@jsroot/common/dateTimeService';
import { MobileMaxWidth, BannerType } from '@jsroot/common/constants';
import TodayPost from './TodayPost';
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
    weekdays: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
    weekdaysShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
});


export class AppContainer extends Component {
    static defaultProps = {
        selectedDate: '',
        searchKey: '',
        matches: null,
        majorLeagues: [],
        totalLiveMatches: 0,
        getFavLeagues: function () {
            // nothing
        },
        getMatchesByDate: function () {
            // nothing
        },
        getLiveMatches: function () {
            // nothing
        },
        getLeagues: function () {
            //nothing
        },
        setDateRanges: function () {
            // nothing
        },
        setMatches: function () {
            // nothing
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            isMobile: window.innerWidth <= MobileMaxWidth ? true : false
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);

        this.props.setDateRanges(this.getDateRanges(this.props.selectedDate));
        this.props.getFavLeagues();
        this.props.getLeagues();
        this.props.getBanner();
        this.getMatches(this.props.selectedDate);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const isMobile = this.state.isMobile;
        if (!isMobile && window.innerWidth <= MobileMaxWidth) {
            this.setState({ isMobile: true });
        } else {
            if (isMobile && window.innerWidth > MobileMaxWidth) {
                this.setState({ isMobile: false });
            }
        }
    };

    getDateRanges = selectedDate => {
        const dates = [];
        let totalItems = 5;
        selectedDate = dayjs(selectedDate);
        const minDate = dayjs(this.props.minDate);
        const maxDate = dayjs(this.props.maxDate);
        const shortDateFormat = 'YYYY-MM-DD';

        if (selectedDate.isSame(minDate) || selectedDate.isSame(minDate.clone().add(1, 'days'))) {
            for (let i = 0; i < totalItems; i++) {
                dates.push(DateTimeService.formatDateTime(minDate.clone().add(i, 'days'), shortDateFormat));
            }
        } else if (selectedDate.isSame(maxDate) || selectedDate.isSame(maxDate.clone().subtract(1, 'days'))) {
            for (let i = 0; i < totalItems; i++) {
                dates.unshift(DateTimeService.formatDateTime(maxDate.clone().subtract(i, 'days'), shortDateFormat));
            }
        } else {
            totalItems = 3;
            dates.push(DateTimeService.formatDateTime(selectedDate, shortDateFormat));
            for (let i = 1; i < totalItems; i++) {
                dates.push(DateTimeService.formatDateTime(selectedDate.clone().add(i, 'days'), shortDateFormat));
                dates.unshift(DateTimeService.formatDateTime(selectedDate.clone().subtract(i, 'days'), shortDateFormat));
            }
        }

        return dates;
    };

    getMatches = selectedDate => {
        if (this.props.searchKey.length > 0) {
            this.props.setSearchKey('');
        }

        this.props.setMatches(null);
        this.props.getLiveMatches();
        if (!window.isLivePage) {
            this.props.getMatchesByDate({
                eventDate: selectedDate,
                timezone: DateTimeService.getClientTimezone()
            });
        }
    };

    onToggleFavLeaguesIcon = () => {
        this.props.setFlagToggleFavLeagueIcon(!this.props.flagToggleFavLeagueIcon);
    };

    render() {
        const isMobile = this.state.isMobile;
        const { matches, favLeagues, totalLiveMatches, leagues, banner } = this.props;
        return (
            <div className="container livescore-container">
                <SignalR getMatches={this.getMatches} />
                <div className="livescore-soccer">
                    <div className="livescore-soccer-main">
                        <div className="block__title"><h2><a> { window.isLivePage ? "Trực tiếp bóng đá hôm nay " : "Lịch thi đấu bóng đá hôm nay" }</a></h2></div>
                        <div className="document-text">
                            *Thông tin của Lịch Thi Đấu là do bên thứ ba cung cấp và chỉ mang tính chất tham khảo.
                        </div>
                        <DateBar isMobile={isMobile} totalMatches={totalLiveMatches}
                            getDateRanges={this.getDateRanges}
                            onClick={this.getMatches}
                        />
                        {
                            matches === null && <SkeletonGrid />
                        }
                        {
                            matches !== null && <MatchGrid matches={matches} />
                        }
                        { window.isLivePage ? (
                            <div className="about-livescore">
                                <h3 className="heading-about-livescore">Xem TRỰC TIẾP BÓNG ĐÁ HÔM NAY nhanh nhất trên SABAVN</h3>
                                <div className="about-livescore-text">
                                    Website XEM trực tiếp bóng đá hôm nay, cập nhật link xem trực tiếp bóng đá các trận đấu nhanh nhất trên Internet. Người xem có thể xem được diễn biến tất cả các trận đấu mà không cần cài đặt app hay ứng dụng xem TV nào.
                                </div>
                                <div className="about-livescore-text">
                                    Chuyên trang 'TRỰC TIẾP BÓNG ĐÁ' được thiết kế hiện đại, giúp bạn có trải nghiệm tiện ích nhất. Chỉ cần 1 cú click, bạn có thể dễ dàng tìm kiếm link xem, thành tích đối đầu, đội hình ra sân và các thông số chi tiết của trận đấu.
                                </div>
                                <h3 className="heading-about-livescore">VÌ SAO NÊN XEM TRỰC TIẾP BÓNG ĐÁ TRÊN SABAVN</h3>
                                <div className="about-livescore-text">
                                    TẤT CẢ link xem trực tiếp đều được SABAVN cập nhật 24h và liên tục 2 TIẾNG/1 lần trước khi trận đấu diễn ra. Ngoài ra, website sẽ cung cấp đầy đủ chỉ số thống kê của 2 đội bóng : đội hình, lịch sử đối đầu, diễn biến trận đấu, số lượng thẻ đỏ, thẻ vàn, phạt góc v.v…..
                                </div>
                                <div className="about-livescore-text">
                                    Lịch xem bóng đá trực tuyến và phát sóng trực tiếp các trận đấu của ĐTVN, các giải EURO 2024, VL World Cup 2026, V League, Ngoại hạng Anh, C1, C2, …. đều được cung cấp đầy đủ và chính xác
                                </div>
                                <h3 className="heading-about-livescore">HƯỚNG DẪN XEM TRỰC TIẾP BÓNG ĐÁ TRÊN SABAVN</h3>
                                <div className="about-livescore-text">
                                    Bạn có thể xem bóng đá trực tiếp tại SABAVN mà không cần tạo tài khoản. Tuy nhiên, để tận hưởng dịch vụ một cách trọn vẹn nhất. Bạn có thể làm đăng ký làm thành viên của kênh SABAVN qua các bước cực kỳ đơn giản sau:
                                </div>
                                <div className="about-livescore-text">
                                    Bước 1: Người dùng phải cần có điện thoại thông minh, dễ dàng kết nối Internet như máy tính bàn, laptop, máy tính bảng…<br />
                                    Bước 2: Người dùng truy cập trình duyệt web rồi gõ ” SABAVN” để tìm kiếm  <br />
                                    Bước 3: Khi website SABAVN.NET hiện ra thì bạn có thể thoải mái truy cập các thông tin hay các trận đấu bóng mà bạn muốn xem.<br />
                                    Ngoài ra bạn có thể đăng ký thành viên để lựa chọn thêm các giải đấu mà bạn quan tâm. SABAVN sẽ gửi thông tin cho bạn khi có các trận TRỰC TIẾP MỚI NHẤT.
                                </div>
                                <div className="about-livescore-text">
                                    Các bạn hãy nhanh tay truy cập SABAVN.NET kênh xem trực tiếp bóng đá hot nhất hiện này để hòa mình vào không khí bóng đá sôi động, hình ảnh chân thực, sắc nét. Sự ủng hộ và đồng hành của các bạn sẽ luôn là động lực to lớn để kênh của chúng tôi ngày càng phát triển mạnh mẽ và có cơ hội để người dùng trải nghiệm những dịch vụ tuyệt vời nhất mà kênh của chúng tôi đem lại. Sự hài lòng của các bạn là món quà vô giá đối với chúng tôi.
                                </div>
                            </div>
                        )  :  (
                            <div className="about-livescore">
                                <div className="about-livescore-text">
                                    SABAVN, một chuyên trang thể thao hàng đầu tại Việt Nam, cam kết mang đến cho quý độc giả những thông tin mới nhất về lịch thi đấu 
                                    bóng đá hôm nay và rạng sáng mai của hàng trăm giải đấu bóng đá trên khắp thế giới. Chúng tôi hiểu rằng LTĐ bóng đá là món ăn tinh 
                                    thần không thể thiếu đối với người Việt.
                                </div>
                                <div className="about-livescore-text">
                                    Tại SABAVN.net, quý độc giả sẽ tìm thấy lịch thi đấu bóng đá hôm nay của các giải đấu hàng đầu trên toàn cầu như 
                                    Ngoại hạng Anh, FA Cup, C1, C2, C3, La Liga, Serie A, Cup Liên đoàn, Bundesliga, UEFA Nations League, cùng nhiều giải giao hữu quan trọng khác.
                                </div>
                                <div className="about-livescore-text">
                                    Chúng tôi cũng cung cấp lịch thi đấu bóng đá theo ngày của AFF Cup, K.League, J.League, U22 Đông Nam Á, SEA Games, Asiad; LTĐ Olympic, Asian Cup,
                                    U23 Châu Á, V-League, Cup Quốc gia, Thai League.
                                </div>
                                <div className="about-livescore-text">
                                    Ngoài ra, SABAVN còn đem đến cho độc giả lịch thi đấu bóng đá chi tiết
                                    theo từng vòng đấu, lượt trận của các đội bóng lớn như MU, Man City, Real Madrid, AC Milan, Chelsea, Barcelona, Arsenal, Liverpool, Dortmund, Bayern Munich.
                                </div>
                                <div className="about-livescore-text">
                                    Bạn sẽ tìm thấy lịch bóng đá hôm nay của Juventus, PSG, Tottenham, và cả lịch thi đấu U19 Việt Nam, U23 Việt Nam, ĐT Việt Nam, lịch trực tiếp bóng đá V-League của HAGL, 
                                    Hà Nội, SLNA, Thanh Hóa, Công An Hà Nội tại SABAVN.net.
                                </div>
                                <div className="about-livescore-text">
                                    SABAVN không chỉ cập nhật lịch trực tiếp và lịch phát sóng bóng đá hôm nay trên các 
                                    kênh nổi tiếng như K+1, K+PM, K+NS, K+PC, On Sports, FOX Sports, VTV6, VTC3, THVL2, VTC Now, Thể Thao TV, Bóng Đá TV, SCTV, TTTT, mà còn liên tục cập nhật trên 
                                    các nền tảng mạng xã hội như Youtube, Facebook của Next Media, VFF Channel, Thethao360...
                                </div>
                            </div>
                        ) }
                        
                        <TodayPost />
                    </div>
                    <div className="livescore-soccer-extension">
                        <FavoriteMatches />
                        <FavoriteLeagues searchLeagues={leagues} leagues={favLeagues} onToggleIcon={this.onToggleFavLeaguesIcon}/>
                        <Banner banner={banner} type={BannerType.DesktopRight}  />
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const {
        minDate, maxDate, selectedDate, dateRanges,
        searchKey, favLeagues, matches, totalLiveMatches,
        flagToggleFavLeagueIcon, leagues, banner
    } = state;
    return {
        minDate, maxDate, selectedDate, dateRanges,
        searchKey, favLeagues, matches, totalLiveMatches,
        flagToggleFavLeagueIcon, leagues, banner
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);