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
      allPokemonNames: []
    }
  }

  handleOnInputNameChange = (event) => {
      //grabs input
      event.preventDefault();
      this.setState({inputName: event.target.value})
  }

  handleOnSearch = async (event) => {
      //This takes the input and searches api
      event.preventDefault();
      
      let pokemonInputName = this.state.inputName;    
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonInputName}`)
      const json = await response.json()
      //some sort of error checking if json === "Not Found"
            ///let pokemonObj = {name: json.name, type: json.types[0].type.name}
      let pokemonProperties = [json.name, JSON.stringify(json.types)]
      //json.types.forEach(type => pokemonProperties.push(type.name))
      //let newPokemonArray = this.state.pokemonArray.slice()
      //newPokemonArray.push(pokemonProperties)
      this.setState({
                      pokemonArray: pokemonProperties,
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
      //https://pokeapi.co/api/v2/pokemon/1-1000/names

    onListClick(event)
    {
      let pokeName = event.target.value
      this.setState({inputName: pokeName})
      this.handleOnSearch(event);
    }
  render() {
    //render pokemonArray if we've searched the pokemon
    if(this.state.searchFlag){
      return(
        <div>
          Search Complete!
          <ul>
            {this.state.pokemonArray.map(pokeProps => 
              //pokeProps.map(prop =>
                <li> {pokeProps} </li>
              //)
            )}
          </ul>
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
              <button value={pokeName} onClick= {() => this.onListClick()}>{pokeName}</button> 
            )}
        </ul>
      </div>
    );
  }
}

export default App;
