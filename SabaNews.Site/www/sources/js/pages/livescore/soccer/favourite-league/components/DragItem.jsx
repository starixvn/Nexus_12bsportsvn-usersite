import React, { PureComponent } from 'react';
import TeamIcon from '@jsroot/components/Icon/TeamIcon';
import CommonFunctions from '@jsroot/common/common-functions';
import FavouriteLeagueIcon from '@jsroot/components/Icon/FavouriteLeagueIcon';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import LangHelper from '@jsroot/common/langHelper';

export default class DragItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            leagues: props.leagues,
            toggleIcon: false
        };
    }

    componentDidUpdate(prevProps) {
        if(prevProps.leagues !== this.props.leagues) {
            this.setState({leagues: this.props.leagues});
        }
    }

    onUpdateFavLeague = league => {
        this.props.onUpdateFavLeague(league);
    };

    onDrag = dragData => {
        const { source, destination } = dragData;
        if(!source || !destination || (source.index === destination.index))  {
            return;
        }
        const { leagues } = this.state;
        const orderNewLeagues = this.orderNewLeagues(source.index, destination.index, leagues);
        const currentFavLeagues = CommonFunctions.getFavLeagues();
        let favLeagueIds = currentFavLeagues.map(item => item.leagueId);
        favLeagueIds = favLeagueIds.join(',');
        const favLeague = orderNewLeagues.filter(item => favLeagueIds.includes(item.leagueId.toString()));
        localStorage.setItem('favourite-leagues', JSON.stringify(favLeague));
        this.props.onDrag(orderNewLeagues);
        this.setState({ toggleIcon: !this.state.toggleIcon});
    };

    orderNewLeagues = (source, destination, leagues) => {
        const itemToAdd = leagues.splice(source, 1)[0];
        leagues.splice(destination, 0, itemToAdd);
        let count = leagues.length;
        const tmpLeague = [];
        leagues.map(item => {
            const league = {...item};
            league.order = count;
            count--;
            tmpLeague.push(league);
        });
        return tmpLeague;
    };

    handleClickLeague = (event, league) => {
        const className = event.target.className;
        if (className.includes('icon-livescore')) {
            return;
        }
        const url = CommonFunctions.getLeaguePageUrl(league);
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };

    render() {
        const { leagues, toggleIcon } = this.state;
        if( this.props.leagues.length === 0) {
            return <div className="none-livescore">{LangHelper.getResource('EmptyFavLeague')}</div>;
        }
        return (
            <DragDropContext onDragEnd={this.onDrag}>
                <Droppable droppableId='my-league'>
                    {provided => (
                        <div className="my-league" {...provided.droppableProps} ref={provided.innerRef}>
                            {leagues.map((league, index) => {
                                return (
                                    <Draggable key={index} draggableId={`${index}`} index={index}>
                                    {provided => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            <div className="draggable-item my-league-item">
                                                <FavouriteLeagueIcon league={league}
                                                    order={league.order}
                                                    flagToggle={toggleIcon}
                                                    onUpdateFavLeague={() => this.onUpdateFavLeague(league)}
                                                    className='my-league-item-action'/>
                                                <TeamIcon className="my-league-item-img"
                                                    src={CommonFunctions.getLeagueIcon(league)}
                                                    onClick={event => this.handleClickLeague(event, league)}
                                                />
                                                <div className="my-league-item-name">
                                                    <span onClick={event => this.handleClickLeague(event, league)}>{CommonFunctions.getLeagueName(league)}</span>
                                                </div>
                                                <i className="my-league-item-drop icon-livescore icon-drop-drag"></i>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}