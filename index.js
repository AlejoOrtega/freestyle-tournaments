let tournament = {}
let contenders = []
let dbSize = 300 //temp, need real size

let stock_image = 'https://pic.onlinewebfonts.com/svg/img_30754.png'

const URL_BASE = 'https://pokeapi.co/api/v2/pokemon/'

document.addEventListener('DOMContentLoaded', async() => {
    await checkExistingTournament()
    
    if(tournament.hasOwnProperty('fight1')){
        retrieveContenders()
        uploadSavedTornament()
        
    }else{
        generateTournament() // Wait until tournament is generated
    }
    
    //generateTournament()
    addResetFunctionality()
    //tournamentResult()
})

const tournamentStructure = () => { // Generate tournament structure
    let roundIndex, fightingFor;
    for (let index  = 0; index < 15; index++) {
        switch(index){
            case 0: 
                roundIndex = 8    
                fightingFor = 'home'  
                break
            case 1:
                roundIndex = 8
                fightingFor = 'away'
                break;
            case 2: 
                roundIndex = 9
                fightingFor = 'home'
                break;
            case 3:
                roundIndex = 9
                fightingFor = 'away'
                break;
            case 4: 
                roundIndex = 10
                fightingFor = 'home'
                break;
            case 5:
                roundIndex = 10
                fightingFor = 'away'
                break;
            case 6: 
                roundIndex = 11
                fightingFor = 'home'
                break;
            case 7:
                roundIndex = 11
                fightingFor = 'away'
                break;
            case 8:
                roundIndex = 12
                fightingFor = 'home'
                break;
            case 9:
                roundIndex = 12
                fightingFor = 'away'
                break;
            case 10: 
                roundIndex = 13
                fightingFor = 'home'
                break;
            case 11:
                roundIndex = 13
                fightingFor = 'away'
                break;
            case 12: 
                fightingFor = 'home'
                roundIndex = 14
                break;
            case 13:
                fightingFor = 'away'
                roundIndex = 14
                break;
            default:
                roundIndex = -1
                break;    
        }
        tournament[`fight${index}`]= {
            home: '',
            away: '',
            status: 'open',
            nextFight: roundIndex,
            placement: fightingFor,
            clickable : true,
        }
    }
}

const generateTournament = async() => { // Main function: generates tournament structure and gets random pokemons as fighters
     tournamentStructure()

    while(contenders.length < 16){
        let id = Math.ceil(Math.random() * dbSize)
        if(!contenders.find(contender => contender.id == id)){

            await fetch(`${URL_BASE}${id}`)
            .then(res => res.json())
            .then(fighter => contenders.push(serializePokemon(fighter)))
        }
    } 
    
    saveContenders()
    generateTournamentBracket(contenders)
}

const serializePokemon = (apiPokemon) => {

    return {
        id: apiPokemon.id,
        name: capitalizeString(apiPokemon.species.name),
        img: apiPokemon.sprites.front_default,
        stats: apiPokemon.stats
    }
}

const capitalizeString = (str) => str.charAt(0).toUpperCase() + str.slice(1)

const generateTournamentBracket = (contenders) => {  // Generates the tournament bracket and fills the object tournament
    let round = 0;
    for (let index = 0; index < contenders.length; index=index+2) {
        tournament[`fight${round}`].home = contenders[index]
        tournament[`fight${round}`].away = contenders[index+1]
        tournament[`fight${round}`].status = 'closed'
        round++;
    }
    fillTournamentHTML()
}

const fillTournamentHTML = () => {
    let round, roundHTML, names, images;
    for (let index = 0; index < 8; index++) {
        round = tournament[`fight${index}`]
        roundHTML = document.getElementById(`round${index}`)
        names = roundHTML.getElementsByClassName('name')
        images = roundHTML.getElementsByTagName('img')

        //home contender
        names[0].textContent = round.home.name
        images[0].src = round.home.img
        images[0].id = round.home.id
        addShowStatsListener(images[0], round.home.stats)

        //Away contender
        names[1].textContent = round.away.name
        images[1].src = round.away.img
        images[1].id = round.away.id
        addShowStatsListener(images[1], round.away.stats)
        
        for (const oneimage of images) {
            oneimage.addEventListener('click', winnerSelected)
        }
    }
    
    saveTornament()
}

const uploadSavedTornament = () => {
    let name
    for (let index = 0; index < 15; index++) {
        round = tournament[`fight${index}`]
        if(index == 14){
            if(round.home != ''){
                roundHTML = document.getElementById('home-finals')
                name = roundHTML.getElementsByTagName('h3')
                name[0].textContent = round.home.species.name
                image = roundHTML.getElementsByTagName('img')
                image[0].src = round.home.sprites.front_default
                image[0].id = round.home.id
                image[0].addEventListener('click', finalWinner)
                addShowStatsListener(image[0], round.home.stats)
            }

            if(round.away != ''){
                roundHTML = document.getElementById('away-finals')
                name = roundHTML.getElementsByTagName('h3')
                name[0].textContent = round.away.species.name
                image = roundHTML.getElementsByTagName('img')
                image[0].src = round.away.sprites.front_default
                image[0].id = round.away.id
                image[0].addEventListener('click', finalWinner)
                addShowStatsListener(image[0], round.away.stats)
            }
        }else{
            roundHTML = document.getElementById(`round${index}`)
            images = roundHTML.getElementsByTagName('img')
            switch(index){
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    names = roundHTML.getElementsByClassName('name')
                    names[0].textContent = round.home.species.name
                    names[1].textContent = round.away.species.name
                    break;
            }

            if(round.home != ''){
                //home contender
                images[0].src = round.home.sprites.front_default
                images[0].id = round.home.id
                addShowStatsListener(images[0], round.home.stats)
            }
            if(round.away != ''){
                //Away contender
                images[1].src = round.away.sprites.front_default
                images[1].id = round.away.id
                addShowStatsListener(images[1], round.away.stats)
            }
            if(round.clickable){
                for (const oneimage of images) {
                    oneimage.addEventListener('click', winnerSelected)
                }
            }
        }

    } 
}

const winnerSelected = (event) => {
    let winner, name, image;
    let selected = event.target.id

    let round = event.target.parentNode.parentNode.id.match(/\d+/)[0]
    let nextFight = tournament[`fight${round}`].nextFight

    if(tournament[`fight${round}`].status == 'closed'){

        tournament[`fight${round}`].home.id == selected ? winner = tournament[`fight${round}`].home : winner = tournament[`fight${round}`].away
        roundHTML = document.getElementById(`round${nextFight}`)
        
        if(tournament[`fight${round}`].placement == 'home'){
            tournament[`fight${nextFight}`].home = winner

            if(nextFight == 14){
                roundHTML = document.getElementById('home-finals')
                name = roundHTML.getElementsByTagName('h3')
                name[0].textContent = winner.name
                image = roundHTML.getElementsByTagName('img')
                image[0].src = winner.img
                image[0].id = winner.id
                image[0].addEventListener('click', finalWinner)
                addShowStatsListener(image[0], winner.stats)
            }else{
                image = roundHTML.getElementsByTagName('img')
                image[0].src = winner.img
                image[0].id = winner.id
                image[0].addEventListener('click', winnerSelected)
                addShowStatsListener(image[0], winner.stats)
            }
        }else{
            tournament[`fight${nextFight}`].away = winner

            if(nextFight == 14){
                roundHTML = document.getElementById('away-finals')
                name = roundHTML.getElementsByTagName('h3')
                name[0].textContent = winner.name
                image = roundHTML.getElementsByTagName('img')
                image[0].src = winner.img
                image[0].id = winner.id
                image[0].addEventListener('click', finalWinner)
                addShowStatsListener(image[0], winner.stats)
            }else{
                image = roundHTML.getElementsByTagName('img')
                image[1].src = winner.img
                image[1].id = winner.id
                image[1].addEventListener('click', winnerSelected)
                addShowStatsListener(image[1], winner.stats)
            }
        }

        if(tournament[`fight${nextFight}`].home != '' && tournament[`fight${nextFight}`].away != ''){
            tournament[`fight${nextFight}`].status = 'closed'
        }

        let images = event.target.parentNode.parentNode.getElementsByTagName('img')
        for (const oneImage of images) {
            oneImage.removeEventListener('click', winnerSelected)
        }
        tournament[`fight${round}`].clickable = false
        //console.log(tournament)
        saveTornament()
    }else{
        alert('Please select opponent before advancing')
    }

}

const finalWinner = (event) =>{
    let winner;
    let selected = event.target.id
    if(tournament['fight14'].status == 'closed'){

        tournament[`fight14`].home.id == selected ? winner = tournament[`fight14`].home : winner = tournament[`fight14`].away
        winnerSpot = document.getElementById('winner')

        winnerSpot.getElementsByTagName('img')[0].src= winner.img;
        winnerSpot.getElementsByTagName('h2')[1].textContent = winner.name
        
        document.getElementById('away-finals').getElementsByTagName('img')[0].removeEventListener('click', finalWinner)
        document.getElementById('home-finals').getElementsByTagName('img')[0].removeEventListener('click', finalWinner)

        postNewChamp(winner)
    }else{
        alert('Please select opponent before advancing')
    }
}

const addShowStatsListener = (imgElm, stats) => {
    const statsList = document.createElement('ul')
    statsList.classList.add("stats")
    statsList.style.display = 'none'
    imgElm.parentElement.append(statsList)

    stats.forEach(stat => {
        const li = document.createElement('li')
        li.textContent = `${stat.stat.name}: ${stat.base_stat}`
        statsList.append(li)
    })
    
    imgElm.addEventListener('mouseover', () => {
        statsList.style.display = 'block'
    })
    imgElm.addEventListener('mouseout', () => {
        statsList.style.display = 'none'
    })
}

const addResetFunctionality = () => {
    const button = document.getElementById("reset-button")
    button.addEventListener('click', () => {
        tournament = {}
        contenders = []

        let images = document.getElementsByTagName('img')
        for (const img of images) {
            img.src = stock_image
        }

        generateTournament()
    })
}

//Test
/*
const tournamentResult = () => { // Randomizes the results of each fight and gives a final result
    let result, nextFight, winner, round, image, name
    for (let index = 0; index < 15; index++) {
        result =  Math.floor(Math.random() * 2 )

        nextFight = tournament[`fight${index}`].nextFight

        result == 0 ? winner = tournament[`fight${index}`].home : winner = tournament[`fight${index}`].away
        if(index == 14){
            console.log(`THE WINNER IS: ${winner.name}`)

            winnerSpot = document.getElementById('winner')

            winnerSpot.getElementsByTagName('img')[0].src= winner.img;
            winnerSpot.getElementsByTagName('h2')[0].textContent = winner.name
            break;
        }

        round = document.getElementById(`round${nextFight}`)
        

        if(tournament[`fight${nextFight}`].home == ''){
            tournament[`fight${nextFight}`].home = winner

            if(nextFight == 14){
                round = document.getElementById('home-finals')
                name = round.getElementsByTagName('h3')
                name[0].textContent = winner.name
                image = round.getElementsByTagName('img')
                image[0].src = winner.img
            }else{
                image = round.getElementsByTagName('img')
                image[0].src = winner.img
                image[0].id = winner.id
            }
        }else{
            tournament[`fight${nextFight}`].away = winner

            if(nextFight == 14){
                round = document.getElementById('away-finals')
                name = round.getElementsByTagName('h3')
                name[0].textContent = winner.name
                image = round.getElementsByTagName('img')
                image[0].src = winner.img
            }else{
                image = round.getElementsByTagName('img')
                image[1].src = winner.img
                image[1].id = winner.id
            }
        }

        if(tournament[`fight${nextFight}`].home != '' && tournament[`fight${nextFight}`].away != ''){
            tournament[`fight${nextFight}`].status = 'closed'
        }
        
    }
}
*/

// CRUD

const checkExistingTournament = () => { // Checks if there is an existing tournament
    return fetch('http://localhost:3000/tournament')
    .then((res)=>res.json())
    .then((data)=> tournament = data)
}

const retrieveContenders = () => { // Retrieves contenders if a tournament exists
    fetch('http://localhost:3000/contenders')
    .then((res)=>res.json())
    .then((data)=> contenders = data)
}

const saveContenders = () => {  // Saves contenders
    try{
        fetch('http://localhost:3000/contenders',{
        method: 'PATCH',
        headers:{
            "Accept" : "application/json",
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(contenders)
        })
    }catch(error){
        console.log(error)
    }
}

const saveTornament = () => { // Saves Tournament state
    try{
        fetch('http://localhost:3000/tournament',{
        method: 'PATCH',
        headers:{
            "Accept" : "application/json",
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(tournament)
        })
    }catch(error){
        console.log(error)
    }
}

const postNewChamp = (winner) => { // Saves a winner of a tournament in the podium
    let object = {
        name : winner.species.name
    }
    try{
        fetch('http://localhost:3000/podium',{
            method: 'POST',
            headers: {
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(object)
    
        })
    }catch(error){
        console.log(winner)
    }
}