import React, { Component } from 'react';
import Map from './Map'
import validate from '../Functions/validate'
import update from '../Functions/update'
import server from '../Functions/server'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      territories: [],
      activePlayer: 1,
      firstTerritory: '',
      secondTerritory: '',
      blitz: 'false',
    }
  }

  componentDidMount() {
    update.getInitialStateOfGame(this)

  }

  handleClick = (event) => {
    // validates if the click is on a territory
    if(validate.territoryClick(event, this.state.territories) === false) {
      console.log('this is not a territory')
      return;
    } 
    // validates if a territory is selected or not
    if(validate.isTerritorySelected(this.state.firstTerritory) === false) 
    {

      //validates if the player owns this territory
      if(validate.canPlayerSelectTerritory(event, this.state.territories, this.state.activePlayer) === true) {

        //selects the territory
        validate.selectTerritory(event)
        this.setState({firstTerritory: event.target.id})
        return;
      } else {
        console.log('player doesnt own this territory')
        return;
      }
    }

    //validates if the click is not on the same territory
    else if(validate.thisTerritoryAlreadySelected(event, this.state) === true) {
      validate.deselectSameTerritory(event)
      this.setState({firstTerritory: ''})
      return;
    } 

    // validates if the click is not on a different territory the player owns
    else if(validate.differentTerritoryAlreadySelected(event, this.state.territories, this.state.firstTerritory) === true) {
      console.log('player has chosen a different territory already')
      validate.deselectOldTerritory(this.state.firstTerritory)
      validate.selectTerritory(event)
      this.setState({firstTerritory: event.target.id})
      return;
    }

    // finds the two territory objects
    const attackingTerritory = validate.findFirstSelectedObject(this.state.territories, this.state.firstTerritory)
    const defendingTerritory = validate.findSecondSelectedObject(event, this.state.territories)

    //validates if the objects are neighbours
    if(validate.areNeighbours(attackingTerritory, defendingTerritory) === false) {
      console.log('not neighbours')
      return
    }

    //checks if second territory is an enemy territory
    if(validate.isEnemyTerritory(attackingTerritory, defendingTerritory) === false) {
      return
    } else {
      //sends attack to server
      update.sendAttackToServer(attackingTerritory.name, defendingTerritory.name, this.state.blitz, this)
      update.colorTerritories(this.state)
      update.addNumberOfUnits(this.state)
  

    }

    

  }

  render() {
    return (
      <div className="App">
        <Map  handleClick={this.handleClick}        
        />
      </div>
    );
  }
}

export default App;
