let neighbours =  {
  "alaska":["northwest_territory","alberta","kamchatka"],"northwest_territory":["alaska","alberta","ontario","greenland"],"greenland":["northwest_territory","ontario","quebec","iceland"],"alberta":["alaska","northwest_territory","ontario","western_united_states"],"ontario":["northwest_territory","greenland","alberta","quebec","western_united_states","eastern_united_states"],"quebec":["greenland","ontario","eastern_united_states"],"western_united_states":["alberta","ontario","eastern_united_states","central_america"],"eastern_united_states":["ontario","quebec","western_united_states","central_america"],"central_america":["western_united_states","eastern_united_states","venezuela"],"venezuela":["brazil","peru","central_america"],"peru":["brazil","argentina","venezuela"],"brazil":["argentina","peru","venezuela","north_africa"],"argentina":["brazil","peru"],"iceland":["greenland","scandinavia","great_britain"],"scandinavia":["iceland","great_britain","northern_europe","russia"],"great_britain":["iceland","scandinavia","northern_europe","western_europe"],"northern_europe":["scandinavia","great_britain","western_europe","southern_europe","russia"],"western_europe":["great_britain","northern_europe","southern_europe","north_africa"],"southern_europe":["northern_europe","western_europe","russia","north_africa","egypt","middle_east"],"russia":["scandinavia","northern_europe","southern_europe","ural","afghanistan","middle_east"],"north_africa":["brazil","western_europe","southern_europe","egypt","east_africa","central_africa"],"egypt":["southern_europe","north_africa","middle_east","east_africa"],"east_africa":["north_africa","egypt","middle_east","central_africa","south_africa","madagascar"],"central_africa":["north_africa","east_africa","south_africa"],"south_africa":["central_africa","east_africa","madagascar"],"madagascar":["east_africa","south_africa"],"ural":["russia","siberia","afghanistan","china"],"siberia":["ural","yakursk","irkutsk","china","mongolia"],"yakursk":["siberia","irkutsk","kamchatka"],"irkutsk":["siberia","yakursk","kamchatka","mongolia"],"kamchatka":["alaska","yakursk","irkutsk","mongolia","japan"],"afghanistan":["russia","ural","china","middle_east","india"],"china":["ural","siberia","afghanistan","mongolia","india","southeast_asia"],"mongolia":["siberia","irkutsk","kamchatka","china","japan"],"japan":["kamchatka","mongolia"],"middle_east":["southern_europe","russia","egypt","east_africa","afghanistan","india"],"india":["afghanistan","china","middle_east","southeast_asia"],"southeast_asia":["china","india","indonesia"],"indonesia":["southeast_asia","new_guinea","western_australia"],"new_guinea":["indonesia","western_australia","eastern_australia"],"western_australia":["indonesia","new_guinea","eastern_australia"],"eastern_australia":["new_guinea","western_australia"]
}

const validate = {
  territoryClick: (event, territories) => {
    let validClick = false
    territories.map(territory => {
      if(event.target.id === territory.name) {
        validClick = true
        return ''
      } else {
        return ''
      }
    })
    return validClick;
  },

  isTerritorySelected: function(firstTerritory) {
    if (firstTerritory === "") {
      return false;
      } else {
        return true;
       }
  },

  areNeighbours: function(firstTerritoryObject, secondTerritoryObject) {
    let isTrue = false
    Object.entries(neighbours).map(territory => {
      if(territory[0] === firstTerritoryObject.name) {
        territory[1].map(neighbour => {
          if(neighbour === secondTerritoryObject.name) {
            isTrue = true
            return ''
          } else {
            return ''
          }
        })
      } return ''
      })
    return isTrue;
  },
  
  canPlayerSelectTerritory: function(event, territories, activePlayer) {
    let canSelect = false
    let territorySelected = event.target.id
    territories.map(territory => {
      if(territory.name === territorySelected) {
        if(territory.player === activePlayer) {
          canSelect = true
          return ''
        } else {
          return ''
        }
      } else {
        return ''
      }
    })
    return canSelect;
  },
    
  selectTerritory(event, state) {
    event.target.classList.toggle("selected")
  },


  thisTerritoryAlreadySelected: function(event, state) {
    if (state.firstTerritory === event.target.id) {
      return true;
      } else {
        return false; 
      }
  },

  differentTerritoryAlreadySelected: function(event, territories, firstTerritory) {
    let newTerritoryObject = event.target.id
    let oldTerritoryObject = firstTerritory //this.state.firstTerritory
    territories.map(territory => {
      if(event.target.id === territory.name) {
        newTerritoryObject = territory
        return ''
      } else if (firstTerritory === territory.name) {
        oldTerritoryObject = territory
        return ''
      } else {
        return ''
      }
    })
    if(oldTerritoryObject.player === newTerritoryObject.player) {
      return true;
    } else {
      return false;
    }
  },

  deselectSameTerritory: function(event) {
    event.target.classList.toggle("selected");
  },

  deselectOldTerritory: function(firstTerritory) {
    document.getElementById(firstTerritory).classList.toggle('selected')
  },

  findFirstSelectedObject: function(territories, firstTerritory) {
    let firstTerritoryObject = "first territory not found"
    territories.map(territory => {
      if(firstTerritory === territory.name) {
        firstTerritoryObject = territory
        return ''
        } else {
          return ''
        }
      })
    return firstTerritoryObject;
  },

  findSecondSelectedObject: function(event, territories) {
    let secondTerritoryObject = "second territory not found";
        territories.map(territory => {
          if(event.target.id === territory.name) {
            secondTerritoryObject = territory
            return ''
          } else {
            return ''
          }
    })
    return secondTerritoryObject;
  },

  isEnemyTerritory: function (attacking, defending) {
    if(attacking.player === defending.player) {
      return false
    } else {
      return true
    }
  },
  
}

export default validate