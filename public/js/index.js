let territories = []

let neighbours =  {
  "alaska":["northwest_territory","alberta","kamchatka"],"northwest_territory":["alaska","alberta","ontario","greenland"],"greenland":["northwest_territory","ontario","quebec","iceland"],"alberta":["alaska","northwest_territory","ontario","western_united_states"],"ontario":["northwest_territory","greenland","alberta","quebec","western_united_states","eastern_united_states"],"quebec":["greenland","ontario","eastern_united_states"],"western_united_states":["alberta","ontario","eastern_united_states","central_america"],"eastern_united_states":["ontario","quebec","western_united_states","central_america"],"central_america":["western_united_states","eastern_united_states","venezuela"],"venezuela":["brazil","peru","central_america"],"peru":["brazil","argentina","venezuela"],"brazil":["argentina","peru","venezuela","north_africa"],"argentina":["brazil","peru"],"iceland":["greenland","scandinavia","great_britain"],"scandinavia":["iceland","great_britain","northern_europe","russia"],"great_britain":["iceland","scandinavia","northern_europe","western_europe"],"northern_europe":["scandinavia","great_britain","western_europe","southern_europe","russia"],"western_europe":["great_britain","northern_europe","southern_europe","north_africa"],"southern_europe":["northern_europe","western_europe","russia","north_africa","egypt","middle_east"],"russia":["scandinavia","northern_europe","southern_europe","ural","afghanistan","middle_east"],"north_africa":["brazil","western_europe","southern_europe","egypt","east_africa","central_africa"],"egypt":["southern_europe","north_africa","middle_east","east_africa"],"east_africa":["north_africa","egypt","middle_east","central_africa","south_africa","madagascar"],"central_africa":["north_africa","east_africa","south_africa"],"south_africa":["central_africa","east_africa","madagascar"],"madagascar":["east_africa","south_africa"],"ural":["russia","siberia","afghanistan","china"],"siberia":["ural","yakursk","irkutsk","china","mongolia"],"yakursk":["siberia","irkutsk","kamchatka"],"irkutsk":["siberia","yakursk","kamchatka","mongolia"],"kamchatka":["alaska","yakursk","irkutsk","mongolia","japan"],"afghanistan":["russia","ural","china","middle_east","india"],"china":["ural","siberia","afghanistan","mongolia","india","southeast_asia"],"mongolia":["siberia","irkutsk","kamchatka","china","japan"],"japan":["kamchatka","mongolia"],"middle_east":["southern_europe","russia","egypt","east_africa","afghanistan","india"],"india":["afghanistan","china","middle_east","southeast_asia"],"southeast_asia":["china","india","indonesia"],"indonesia":["southeast_asia","new_guinea","western_australia"],"new_guinea":["indonesia","western_australia","eastern_australia"],"western_australia":["indonesia","new_guinea","eastern_australia"],"eastern_australia":["new_guinea","western_australia"]
}


const mapElement = document.getElementById('map');
let firstSelectedTerritory = '';
let secondSelectedTerritory = '';
let activePlayer = 1;
let greenPlayer = 1;
let bluePlayer = 2;


let toSend = {
  attackingTerritory: "",
  defendingTerritory: "",
  blitz: 'true'
}

const getStateOfGame = () => {
  fetch('./initialize/9')
    .then(promise => promise.json())
    .then(data => {
      territories = data.territories
      colorTerritories()
      addNumberOfUnits()    
    })
}

const colorTerritories = () => {
  territories.map(territory => {
    if(territory.player === greenPlayer) {
      document.getElementById(`${territory.name}`).classList.remove("ownedByPlayerBlue")
      document.getElementById(`${territory.name}`).classList.add("ownedByPlayerGreen")
    } else if (territory.player === bluePlayer) {
      document.getElementById(`${territory.name}`).classList.remove("ownedByPlayerGreen")
      document.getElementById(`${territory.name}`).classList.add(`ownedByPlayerBlue`)
    }
  })
}

const addNumberOfUnits = () => {
  territories.map(territory => {
    document.getElementById(`${territory.name}-units-text`).textContent = `${territory.units}`
  })
}

const isValidClick = (event) => {
  let validClick = false
  territories.map(territory => {
    if(event.target.id === territory.name) {
      validClick = true
    }
  })
  return validClick;
}


const areNeighbours = (firstSelectedTerritoryObj, secondSelectedTerritoryObj) => {
  let isTrue = false
  Object.entries(neighbours).map(territory => {
    if(territory[0] === firstSelectedTerritoryObj.name) {
      territory[1].map(neighbour => {
        if(neighbour === secondSelectedTerritoryObj.name) {
          console.log('are neighbours')
          isTrue = true;
        }
      })
    }
    })
  return isTrue;
} 

function isTerritorySelected() {
  if (firstSelectedTerritory === "") {
    return false;
    } else {
      return true;
     }
  }

const canPlayerSelectTerritory = (event) => {
  let canSelect = false
  let territorySelected = event.target.id
  territories.map(territory => {
    if(territory.name === territorySelected) {
      if(territory.player === activePlayer) {
        canSelect = true
      }
    }
  })
  return canSelect;
}

function selectTerritory(event) {
  event.toElement.classList.toggle("selected");
  firstSelectedTerritory = event.target.id;    
  }


function thisTerritoryAlreadySelected(event) {
  if (firstSelectedTerritory === event.target.id) {
    return true;
    } else {
      return false };
  }

function differentTerritoryAlreadySelected(event) {
  let newTerritoryObject = event.target.id
  let oldTerritoryObject = firstSelectedTerritory
  territories.map(territory => {
    if(event.target.id === territory.name) {
      newTerritoryObject = territory
    } else if (firstSelectedTerritory === territory.name) {
      oldTerritoryObject = territory
    }
  })
  if(oldTerritoryObject.player === newTerritoryObject.player) {
    return true;
  } else {
    return false;
  }
  
}

function deselectSameTerritory(event) {
  event.toElement.classList.toggle("selected");
  firstSelectedTerritory = "";
  }


function findFirstSelectedObject() {
    let firstTerritoryObject = "first territory not found"
    territories.map(territory => {
      if(firstSelectedTerritory === territory.name) {
        firstTerritoryObject = territory
        }
      })
    return firstTerritoryObject;
    }


function findSecondSelectedObject(event) {
  let secondTerritoryObject = "second territory not found";
      territories.map(territory => {
        if(event.target.id === territory.name) {
          secondTerritoryObject = territory;
        }
  })
  return secondTerritoryObject;
}

function isEnemyTerritory(attacking, defending) {
  if(attacking.player === defending.player) {
    return false
  } else {
    return true
  }
}

async function sendAttackToServer (attacking, defending) {
  toSend.attackingTerritory = attacking
  toSend.defendingTerritory = defending
  fetch('./attack/9', 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify(toSend)
    }
      )
      .then(response => response.json())// parses response as JSON
      .then(data => {
        territories = data.territories
        colorTerritories()
        addNumberOfUnits()
      });
      }

document.addEventListener('DOMContentLoaded', () => {

  getStateOfGame()


  mapElement.addEventListener('click', () => {

    if (isValidClick(this.event) === false) {
      console.log('this is not a territory')
      return;
    }
    if (isTerritorySelected() === false) {
      if (canPlayerSelectTerritory(this.event) === true) {
        selectTerritory(this.event);
        return;
      } else {
        console.log('player doesnt own this territory')
        return;
      }
    } else if (thisTerritoryAlreadySelected(this.event) === true) {
      deselectSameTerritory(this.event);
      return;
    } else if (differentTerritoryAlreadySelected(this.event) === true) {
      console.log('player has chosen a different territory already')
      return;
    }
    const attackingTerritory = findFirstSelectedObject()
    const defendingTerritory = findSecondSelectedObject(this.event)
    if(areNeighbours(attackingTerritory, defendingTerritory) === false) {
      console.log('these territories are not neighbors')
      return;
    }
    if (isEnemyTerritory(attackingTerritory, defendingTerritory) === false) {
      console.log('this is not enemy territory')
      return;
    } else {
      console.log(attackingTerritory, defendingTerritory)
      console.log('attack is valid')
      sendAttackToServer(attackingTerritory.name, defendingTerritory.name)
    }
  });





})

