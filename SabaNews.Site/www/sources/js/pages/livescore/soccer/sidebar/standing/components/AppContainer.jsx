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
        this.props.getStandings();
    }
    render() {
        const { standings } = this.props;
        return (
            <div className="livescore-home livescore-standing">
                {
                    standings !== null && standings.length > 0 &&
                    <Grid standings={standings} />
                }
            </div>
        );
    }
}
const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { standings } = state;
    return { standings };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);