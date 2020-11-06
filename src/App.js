import './App.css';
import React from 'react';
import SearchPokemon from './SearchPokemon';
import ListAllPokemonNames from './ListAllPokemonNames';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      inputName:'',
      pokemonObj:{},
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
    let newPokemonObj = {name: json.name, type: json.types[0].type.name, baseXP: json.base_experience, statsFlag: false}
    this.setState({
                    pokemonObj: newPokemonObj,
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
    let pokemonObj = this.state.pokemonObj;
    if(pokemonObj.name === this.state.inputName){
      const response = await fetch(`https://pokeapi.co/api/v2/type/${pokemonObj.type}`)
      const json = await response.json();
      this.setState({similarPokemonNames: json.pokemon.map(element => element.pokemon.name)})
    }
  }

  onCollectPokemon = () =>
  {
    alert(`You caught ${this.state.pokemonObj.name}!`)
    this.setState(
      {pokemonCollection: this.state.pokemonCollection.concat(this.state.pokemonObj)}
    )
  }

  onClickHome = () =>{
    let newPokemonCollection = this.state.pokemonCollection;
    for(let i = 0; i < this.state.pokemonCollection.length; i++)
    {
        newPokemonCollection[i].statsFlag = false;
    }
    this.setState(
      {
        searchFlag: false,
        pokemonObj: {},
        allPokemonNames: [],
        similarPokemonNames: [],
        viewCollectionFlag: false,
        showStatsFlag: false,
        pokemonCollection: newPokemonCollection
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

  onShowStats = (pokemon) =>{
    let newPokemonCollection = this.state.pokemonCollection;
    for(let i = 0; i < this.state.pokemonCollection.length; i++)
    {
      //let newPokemonCollection = oldPokemonCollection
      //newPokemonCollection[i] = newPokemonCollection[i].flag= true
      //this.setState({pokemonCollection: newPokemonCollection})
        if(this.state.pokemonCollection[i].name === pokemon.name)
        {
          //let newPokemonCollection = this.state.pokemonCollection;
          newPokemonCollection[i].statsFlag = true;
        }
    }
    this.setState(
      {
        pokemonCollection: newPokemonCollection
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
              <div>
                <li>{this.state.pokemonObj.name} <button onClick={() => this.onCollectPokemon()}>Catch {this.state.pokemonObj.name}</button>
                </li>
                <li>{this.state.pokemonObj.type}</li>
              </div>
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
                <li> <b>{pokemon.name}</b> {pokemon.statsFlag ? 
                                            pokemon.baseXP 
                                            : <button onClick={() => this.onShowStats(pokemon)}>Show Stats</button>}</li>
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
