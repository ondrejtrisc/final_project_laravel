const server = {
  getStateOfGame: (object) => {
      fetch('./initialize/9')
        .then(promise => promise.json())
        .then(data => {
          object.setState({territories: data.territories})
        })
  },

  sendAttackToServer: (attacking, defending, blitz, object) => {
    let toSend = {
      attackingTerritory: attacking,
      defendingTerritory: defending,
      blitz: blitz
    }
    console.log(toSend)
    fetch('./attack/8', 
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
        object.setState({territories: data.territories})
      });
  }

}

export default server