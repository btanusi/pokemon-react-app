import './App.css';
import React from 'react';
import SearchPokemon from './SearchPokemon';
import ListAllPokemonNames from './ListAllPokemonNames';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      inputName:'',
      pokemonArray:[],
      searchFlag: false,
      viewCollectionFlag: false,
      allPokemonNames: [],
      similarPokemonNames: [],
      pokemonCollection: [],
      showStatsFlag: false,
    }
  }

  handleOnInputNameChange = (event) => {
      //grabs input
      event.preventDefault();
      this.setState({inputName: event.target.value})
  }

  handleOnSearch = (event) => {
      //This takes the input and searches api
      event.preventDefault();
      this.getPokemonInfo();
    }

  getPokemonInfo = async ()=> {
    let pokemonInputName = this.state.inputName;    
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonInputName}`)
    const json = await response.json()
    //some sort of error checking if json === "Not Found"
    let pokemonObj = {name: json.name, type: json.types[0].type.name, baseXP: json.base_experience}
    //let pokemonProperties = [json.name, JSON.stringify(json.types)]
    //json.types.forEach(type => pokemonProperties.push(type.name))
    //let newPokemonArray = this.state.pokemonArray.slice()
    //newPokemonArray.push(pokemonProperties)
    this.setState({
                    pokemonArray: this.state.pokemonArray.concat(pokemonObj),
                    searchFlag: true
                  })
  }


  handleOnListAllPokemonNames = async (event) => {
    event.preventDefault();
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`)
    const json = await response.json();

    let allPokemon = json.results.map(e => e.name);
    
    this.setState({
                    allPokemonNames: allPokemon
                  })

  }

  onListClickPokemon(pokeName)
  {
    this.setState({inputName: pokeName}, this.getPokemonInfo)
  }

  onListSimilarTypes = async () =>
  {
    for(let i = 0; i < this.state.pokemonArray.length; i++){
      let pokemonObj = this.state.pokemonArray[i];
      if(pokemonObj.name === this.state.inputName){
        const response = await fetch(`https://pokeapi.co/api/v2/type/${pokemonObj.type}`)
        const json = await response.json();
        this.setState({similarPokemonNames: json.pokemon.map(element => element.pokemon.name)})
      }
    }
  }

  onCollectPokemon = () =>
  {
    alert(`You caught ${this.state.pokemonArray[0].name}!`)
    this.setState(
      {pokemonCollection: this.state.pokemonCollection.concat(this.state.pokemonArray[0])}
    )
  }

  onClickHome = () =>{
    this.setState(
      {
        searchFlag: false,
        pokemonArray: [],
        allPokemonNames: [],
        similarPokemonNames: [],
        viewCollectionFlag: false,
        showStatsFlag: false,
      }
    )
  }

  onViewCollection = () => {
    this.setState(
      {
        viewCollectionFlag: true
      }
    )
  }

  onShowStats = () =>{
    this.setState(
      {
        showStatsFlag: true
      }
    )
  }
    
  render() {
    //render pokemonArray if we've searched the pokemon
    if(this.state.searchFlag){
      return(
        <div>
          Search Complete!
          <br>
          </br>
          <ul>
            {this.state.pokemonArray.map(pokeProps => 
              <div>
                <li>{pokeProps.name} <button onClick={() => this.onCollectPokemon()}>Catch {pokeProps.name}</button>
                </li>
                <li>{pokeProps.type}</li>
              </div>
            )}
          </ul>
          <button onClick={() => this.onListSimilarTypes()}>List Similar Types</button> 
          <ul>
            {this.state.similarPokemonNames.map(pokeName =>
              <li>{pokeName}</li>
            )}
          </ul>
          <button onClick={() => this.onClickHome()}>Go Home</button>
        </div>
      )
    } else if (this.state.viewCollectionFlag){
      return(
        <div>
          <ul>
            {this.state.pokemonCollection.map(pokemon =>
              <div>
                <li> <b>{pokemon.name}</b> {this.state.showStatsFlag ? 
                                            pokemon.baseXP 
                                            : <button onClick={() => this.onShowStats()}>Show Stats</button>}</li>
                <li>{pokemon.type}</li>
              </div>
            )}
          </ul>
          <button onClick={() => this.onClickHome()}>Go Home</button>
        </div>
      )
    }
    return (
      <div className="App">
        <SearchPokemon
          onInputNameChange={this.handleOnInputNameChange}
          onSearch={this.handleOnSearch}
        />
        <ListAllPokemonNames
          onListAllPokemonNames={this.handleOnListAllPokemonNames}
        />
        <ul>
          {this.state.allPokemonNames.map(pokeName => 
              <button onClick= {() => this.onListClickPokemon(pokeName)}>{pokeName}</button> 
            )}
        </ul>
        <button onClick={() => this.onViewCollection()}>View Collection</button>
      </div>
    );
  }
}

export default App;
