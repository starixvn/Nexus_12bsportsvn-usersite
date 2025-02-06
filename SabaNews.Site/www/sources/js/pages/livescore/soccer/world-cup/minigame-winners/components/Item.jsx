import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import DateTimeService from '@jsroot/common/dateTimeService';

export class Item extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            erroredUp: false,
            erroredLink: false
        };
    }

    handleClick = (winnerLength, number, selectedStage) =>{
        if(selectedStage === 4){
            for(let num = 0; num < winnerLength ; num ++){
                if(num !== number){
                    document.getElementsByClassName('detailWinners')[num].style.display = 'none';
                }
            }
            const display = document.getElementsByClassName('detailWinners')[number].style.display;
            if(display === 'block'){
                document.getElementsByClassName('detailWinners')[number].style.display = 'none';
            }else{
                document.getElementsByClassName('detailWinners')[number].style.display = 'block';
            }
        }
    };

    checkUploadLink(Winner){
        let result = false;
        const http = 'http://';
        const https = 'https://';
        if(Winner.icon != null && (Winner.icon.toLowerCase().includes(https) || Winner.icon.toLowerCase().includes(http))){
            result = true;
        }
        return result;
    }

    checkUploadImg(Winner){
        let result = false;
        const http = 'http://';
        const https = 'https://';
        if(Winner.icon != null && !Winner.icon.toLowerCase().includes(https) && !Winner.icon.toLowerCase().includes(http)){
            result = true;
        }
        return result;
    }

    render() {
        const { Winner, number, winnerLength, selectedStage } = this.props;
        const updatedDate = Winner.updatedDate != null ? Winner.updatedDate : Winner.createdDate;
        const dateShow = DateTimeService.formatDateTime(updatedDate, 'DD/MM/YYYY, HH:mm:ss');
        return (
            <>
                {
                    number < 10 &&
                        <div className= {`minigame-table-items ${selectedStage === 4 ? 'cursor-items' : ''}`}
                        onClick={() => this.handleClick(winnerLength, number, selectedStage)}>
                            <div className="minigame-table-flex ">
                                <div className="table-row table-row-index">{number + 1}</div>
                                <div className="table-row table-row-name table-user">
                                    <div className="user-avatar">
                                        {
                                            Winner.icon === null && <span className="non-image">{Winner.userName.slice(0,1)}</span>
                                        }
                                        {
                                            (this.checkUploadLink(Winner)) &&
                                            <img src={Winner.icon} alt={Winner.userName.slice(0,1)} />
                                        }
                                        {
                                            this.checkUploadImg(Winner) &&
                                            <img src={'/uploads/' + Winner.icon}  alt={Winner.userName.slice(0,1)} />
                                        }
                                    </div>
                                    <div className="user-name">
                                        {Winner.userName}
                                    </div>
                                </div>
                                <div className="table-row table-row-score">{Winner.point}</div>
                                <div className="table-row table-row-time">
                                    {dateShow}
                                </div>
                            </div>
                        </div>
                }
                {
                    (number < 10 && selectedStage === 4) &&
                    <div className="table-dropdown detailWinners" style={{display:'none'}}>
                        <div className="table-dropdown-header">
                            <div className="table-dropdown-row">
                                <div className="table-dropdown-column round header-column">Vòng</div>
                                <div className="table-dropdown-column score header-column">Điểm</div>
                            </div>
                        </div>
                        <div className="table-dropdown-body">
                            <div className="table-dropdown-row">
                                <div className="table-dropdown-column round">Vòng 1/8</div>
                                <div className="table-dropdown-column score">{Winner.detail.pointEightTeamStage}</div>
                            </div>
                            <div className="table-dropdown-row">
                                <div className="table-dropdown-column round">Tứ Kết</div>
                                <div className="table-dropdown-column score">{Winner.detail.pointQuarterfinalsStage}</div>
                            </div>

                            <div className="table-dropdown-row">
                                <div className="table-dropdown-column round">Bán Kết</div>
                                <div className="table-dropdown-column score">{Winner.detail.pointSemifinalsStage}</div>
                            </div>
                            <div className="table-dropdown-row">
                                <div className="table-dropdown-column round">Tranh Hạng 3</div>
                                <div className="table-dropdown-column score">{Winner.detail.pointThirdPlace}</div>
                            </div>
                            <div className="table-dropdown-row">
                                <div className="table-dropdown-column round">Chung Kết</div>
                                <div className="table-dropdown-column score">{Winner.detail.pointFinalStage}</div>
                            </div>
                        </div>
                    </div>
                }
            </>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { matches, stages, league, votes } = state;
    return { matches, stages, league, votes };
};

export default connect(mapStateToProps, mapDispatchToProps)(Item);