"use client"
import { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { PokemonCard } from "./pokemon-card";
import { getPokemonTypes } from "@/lib/pokemonAPI";

const PER_PAGE = 30

// Define the type for searchParams
interface SearchParams {
    page?: string; // Make it optional since it might not be provided
  }

interface PokemonGridProps {
    pokemonList: any
    currentPage: number;
//  totalPages: number;
}

export function PokemonGrid({ pokemonList, currentPage/*, totalPages*/ }: PokemonGridProps) {
    const [searchText, setSearchText] = useState("");
    const [types, setTypes] = useState<any[]>([]); // State for Pokémon types
    const [selectedType, setSelectedType] = useState<string>(""); // State for selected type
    const [isSorted, setIsSorted] = useState(false); // State to track if sorted
//    const [sortedList, setSortedList] = useState<any[]>(pokemonList); // State to store sorted list  

    useEffect(() => {
        const fetchTypes = async () => {
            const pokemonTypes = await getPokemonTypes();
            setTypes(pokemonTypes);
        };

        fetchTypes();
    }, []);

    console.log(pokemonList);

    const searchFilter = (pokemonList: any) => {
        return pokemonList.filter((pokemon: any) => {
            const matchesName = pokemon.name.toLowerCase().includes(searchText.toLowerCase())
            if (!selectedType){
                return matchesName
            }

            return matchesName && pokemon.types.some((type : { type: { name: string } }) => 
                type.type.name === selectedType)
        })
    }
    
  // Sort the Pokémon list alphabetically
  const sortList = () => {
    setIsSorted(true);
  };

  // Conditionally sort and filter the Pokémon list
  const getPokemonListToDisplay = () => {
    let listToDisplay = [...pokemonList];

    if (isSorted) {
      listToDisplay.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Apply search and filter based on types
    return searchFilter(listToDisplay);
  };

  const filteredPokemonList = getPokemonListToDisplay();

/*    const sortList = () => {
        const sortedItems = [...pokemonList].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setSortedList(sortedItems); // Update the sorted list in state
        setIsSorted(true); // Set sorting flag to true
      };*/
    
      // Filter the original list (or sorted list if sorting is applied)
//      const filteredPokemonList = searchFilter(sortedList);

    if (filteredPokemonList.length < PER_PAGE) {
        currentPage = 0
    }

    const startIndex = currentPage * PER_PAGE;
    const paginatedPokemonList = filteredPokemonList.slice(startIndex, startIndex + PER_PAGE);
    const totalPages = Math.ceil(filteredPokemonList.length / PER_PAGE);

    return (
        <>
        <div>
            <h3 className="text-2xl py-6 text-center"> Search for your pokemon</h3>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="pokemonName">Pokemon Name</Label>
                <Input 
                    type="text"
                    value={searchText}
                    id="pokemonName"
                    placeholder="Charizard, Pikachu, etc."
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>
            {/* Type Filter Dropdown */}
            <div className="grid w-full max-w-sm items-center gap-1.5 pt-4">
                <Label htmlFor="pokemonType">Pokémon Type</Label>
                <select
                    id="pokemonType"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="p-2 rounded border"
                >
                    <option value="">All Types</option>
                    {types.map((type) => (
                        <option key={type.name} value={type.name}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>
            {/* Button to sort the list */}
            <button onClick={sortList} style={{ marginBottom: '10px' }}>
                Sort Alphabetically
            </button>
            <h3 className="text-3xl pt-12 pb-6 text-center">Pokemon Collection</h3>
        </div>
        <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
            {paginatedPokemonList.map((pokemon : any) => {
                return (
                    <PokemonCard name={pokemon.name} key={pokemon.name + "Card"}/>
                )
            })}
        </div>
        {/* Pagination controls */}
        <div className="flex justify-between mt-6">
            <a
                href={`?page=${currentPage - 1}`}
                className={`px-4 py-2 bg-blue-500 text-white rounded ${currentPage === 0 ? 'disabled' : ''}`}
                style={{ pointerEvents: currentPage === 0 ? 'none' : 'auto' }}
            >
                Previous
            </a>
            <span>Page {currentPage + 1} of {totalPages}</span>
            <a
                href={`?page=${currentPage + 1}`}
                className={`px-4 py-2 bg-blue-500 text-white rounded ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}
                style={{ pointerEvents: currentPage >= totalPages - 1 ? 'none' : 'auto' }}
            >
                Next
            </a>
        </div>
        </>
    )
}