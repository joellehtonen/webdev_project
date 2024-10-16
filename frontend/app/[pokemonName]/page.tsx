import { getPokemon } from "@/lib/pokemonAPI"
import Image from "next/image";
import { Progress } from "@/components/ui/progress"

export default async function PokemonPage({ params } : { params: { pokemonName: string } }) {
    const { pokemonName } = params

    const pokemonObject = await getPokemon(pokemonName)

    console.log(pokemonObject);

    return (
        <>
            <h1 className="text-4xl text-bold pt-4">{pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h1>
            <Image
                src={pokemonObject.sprites.other['official-artwork'].front_default}
                alt={"Picture of " + pokemonName}
                width="200"
                height="200"
            />
            <h3>Weight : {pokemonObject.weight}</h3>
            <div className="flex-col">
                {pokemonObject.stats.map( (statObject : any) => {
                    const statName = statObject.stat.name;
                    const statValue = statObject.base_stat;
                    
                    return (
                        <div className="flex items-stretch" style={{width: "500px"}} key={statName}>
                            <h3 className="p-3 w-2/4">{statName}: {statValue}</h3>
                            <Progress className="w-2/4 m-auto" value={statValue} />
                        </div>
                    )
                })}
            </div>
        </>
    )
}