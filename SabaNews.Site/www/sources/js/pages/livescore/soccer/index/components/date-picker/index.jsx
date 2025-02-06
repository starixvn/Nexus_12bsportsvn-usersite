import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import dayjs from 'dayjs';
import { ActionCreators } from '../../actions';
import DatePicker, { registerLocale } from 'react-datepicker';
import vi from 'date-fns/locale/vi';
import Input from './Input';
import Site from '@jsroot/common/site';
registerLocale('vi', vi);

export class Index extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    handleToggle = () => {
        this.setState(prevState => {
            return { ...prevState, open: !prevState.open };
        });
    };

    closeOnScroll = () => {
        if (this.state.open) {
            this.setState({ open: false });
        }
    };

    onChange = date => {
        this.handleToggle();
        date = dayjs(date).format('YYYY-MM-DD');
        window.isLivePage = false;
        this.props.setSelectedDate(date);

        if (this.props.dateRanges.findIndex(x => x === date) === -1) {
            this.props.setDateRanges(this.props.getDateRanges(date));
        }

        this.props.onChange(date);
        this.props.navigate(Site.resolveClientUrl(`lich-thi-dau/bong-da/${date}`));
    };

    render() {
        const { selectedDate, minDate, maxDate } = this.props;
        const open = this.state.open;

        return (
            <div className="date-picker">
                <DatePicker
                    className={`datetime-picker`}
                    dateFormat={'MMM dd, yyyy'}
                    locale="vi"
                    customInput={<Input onToggle={this.handleToggle} />}
                    selected={new Date(selectedDate)}
                    minDate={new Date(minDate)}
                    maxDate={new Date(maxDate)}
                    onChange={this.onChange}
                    open={open}
                    closeOnScroll={this.closeOnScroll}
                />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { minDate, maxDate, selectedDate, dateRanges } = state;
    return { minDate, maxDate, selectedDate, dateRanges };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);