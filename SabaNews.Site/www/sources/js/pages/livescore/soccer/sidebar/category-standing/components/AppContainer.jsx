import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import Grid from './Grid';
export class AppContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getStanding();
    }
    render() {
        const { standing, league } = this.props;
        return (
            <div className="livescore-home livescore-standing sidebar-standing">
                {
                    standing !== null && league !== null  &&
                    <Grid league={league} standing={standing} />
                }
            </div>
        );
    }
}
const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { standing, league } = state;
    return { standing, league };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);