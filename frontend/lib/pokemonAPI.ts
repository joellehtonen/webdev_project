const POKEMON_API = "https://pokeapi.co/api/v2/"

export async function getPokemonList() {
    const response = await fetch(POKEMON_API + "pokemon?limit=151&offset=0")
    const data = await response.json()
 //   return data.results;

    // Fetch details for each Pokémon to get types
    const pokemonDetailsPromises = data.results.map(async (pokemon: { url: string }) => {
    const detailResponse = await fetch(pokemon.url);
    const detailData = await detailResponse.json();
    return {
        name: detailData.name,
        types: detailData.types, // Include the types
        url: pokemon.url
    };
});

    return Promise.all(pokemonDetailsPromises);
}

export async function getPokemon(name: string) {
    const response = await fetch(POKEMON_API + "pokemon/" + name);
    const data = await response.json();
    return data
}

export async function getPokemonTypes() {
    const response = await fetch(POKEMON_API + "type")
    const data = await response.json()
    return data.results;
}

export async function getPokemonByType(typeUrl: string) {
    const response = await fetch(typeUrl);
    const data = await response.json();
    return data.pokemon.map((p: { pokemon: { name: string; url: string } }) => p.pokemon); // Extract Pokémon list
}