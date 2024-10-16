import Image from "next/image";
import { PokemonGrid } from "@/components/pokemon-grid";
import { getPokemonList } from "@/lib/pokemonAPI";
import { useEffect } from "react";

//const PER_PAGE = 50

// Define the type for searchParams
interface SearchParams {
  page?: string; // Make it optional since it might not be provided
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {

  const page = searchParams.page ? Number(searchParams.page) : 0; // Read the current page from the URL
  
  const pokemonList = await getPokemonList()

  // Calculate the Pokémon to display based on the current page
//  const startIndex = page * PER_PAGE;
//  const paginatedPokemonList = pokemonList.slice(startIndex, startIndex + PER_PAGE);
  
  // Calculate total pages
//  const totalPages = Math.ceil(pokemonList.length / PER_PAGE);

  return (
    <>
      <header>
      </header>
      <main>
      <PokemonGrid
          pokemonList={/*paginatedP*/pokemonList}
          currentPage={page}
  //        totalPages={totalPages}
      /> {/* Pass the paginated list and pagination info */}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://pokeapi.co/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
            alt="File icon"
            width={30}
            height={30}
          />
          PokeAPI
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.hive.fi/en"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="data:image/png;base64,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"
            alt="Window icon"
            width={20}
            height={20}
          />
          Hive Helsinki
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/toagne"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="data:image/png;base64,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"
            alt="Globe icon"
            width={50}
            height={50}
          />
          GitHub
        </a>
      </footer>
    </>
  );
}
