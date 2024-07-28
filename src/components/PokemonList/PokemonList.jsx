import { useEffect,useState } from "react";
import axios from 'axios';
import Pokemon from "../Pokemon/Pokemon";
import './PokemonList.css'

function PokemonList(){

  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const POKEDEX_URL = 'https://pokeapi.co/api/v2/pokemon';

  async function downloadPokmons(){
    const response = await axios.get(POKEDEX_URL);//list of 20 pokemon
    const pokemonResults = response.data.results;//we get the array of pokemons from results
    console.log(pokemonResults);
    //iterating over the array of pokemons and using their url to create an array of promise that will download those 20 pokemon
    const pokemonResultPromise = pokemonResults.map((pokemon)=>axios.get(pokemon.url));

    //passing that promise array to axios .all
    const pokemonData = await axios.all(pokemonResultPromise);//array of 20 pokemon detailed data
    console.log(pokemonData);

    //iterate on the data of each pokemon and extract id,name,image,types 
    const res = pokemonData.map((pokeData)=>{
      const pokemon = pokeData.data;
      return {
        id: pokemon.id,
        name: pokemon.name,
         image :(pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
        types:pokemon.types}
    })
    console.log(res);
    setPokemonList(res)
    setIsLoading(false);

  }

  useEffect( ()=>{
    downloadPokmons();
  },[]);


  return (
    <div className="pokemon-list-wrapper">
      <div className="pokemon-wrapper">
        {(isLoading) ? 'Loading...' : pokemonList.map((p)=><Pokemon name={p.name} image={p.image} key={p.id}/>)}
      </div>
      <div className="controls">
        <button>Prev</button>
        <button>Next</button>
      </div>
    </div>
  )
}
export default PokemonList;

//useEffect expects 2 arguments (1) callback (2) dependancy array the content of callback will be execute when componennt is rendering 1 time if i don't write dependancy array when cpmonent reranders the whole logic of useEffect will be rander if we pass even empty array the whole logic of useEffect won't be rander

//(2) dependancy array:- keep tracks on state like if it changes or not

//in useEffect [x] means when x changes useEffect should be called

//i did install axios for data download which will be showed up at callback function of useEffect

//in response.data.results results means the which fetch through the other site in which there is a array named results