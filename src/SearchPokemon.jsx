

function SearchPokemon(props){
    return(
        <div>
            <form>
                <input type="text" placeholder="Enter Pokemon Name" onChange={props.onInputNameChange}></input>
                <button onClick= {props.onSearch} >Search</button>
            </form>
        </div>
    )
}

export default SearchPokemon