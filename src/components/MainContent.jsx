import React, { useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';

const MainContent = () => {
    const [loadingStates, setLoadingStates] = useState({});

    const fetchPokemon = async ({ pageParam = 0 }) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${pageParam}&limit=12`);
        return res.json();
    };

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery(
        'pokemon',
        fetchPokemon,
        {
            getNextPageParam: (lastPage) => {
                const nextOffset = lastPage.next ? new URL(lastPage.next).searchParams.get('offset') : null;
                return nextOffset ? parseInt(nextOffset) : undefined;
            },
        }
    );

    const { ref, inView } = useInView({
        threshold: 1.0,
        triggerOnce: false,
    });

    React.useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage]);

    if (isLoading) {
        return (
            <>
                <div className="spinner"></div>
                <p>Loading...</p>
            </>
        );
    }

    if (isError) return <p>Error loading Pokémon.</p>;


    return (
        <div className='main-content'>
            <ul className='pokemonList'>
                {data.pages.map((page, pageIndex) => (
                    page.results.map((pokemon, index) => {
                        // Extract the ID from the URL for the image
                        const pokemonId = pokemon.url.split('/').slice(-2, -1)[0];
                        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
                        const shinyUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`;
                        console.log(pokemon)

                        // Preload shiny image
                        const shinyImage = new Image();
                        shinyImage.src = shinyUrl;

                        // Check the loading state for this specific Pokémon
                        const isImgLoading = loadingStates[pokemonId] ?? true;

                        return (
                            <li key={pokemon.name} className='pokemon'>
                                <div className="pokemonDetails">

                                    <p className='pokemonNumber'>{pokemonId}. </p>
                                    <p className='pokemonName'>{pokemon.name}</p>
                                </div>

                                {isImgLoading && <div className="spinner"></div>}
                                <img src={imageUrl} alt={pokemon.name} onLoad={() =>
                                    setLoadingStates((prev) => ({
                                        ...prev,
                                        [pokemonId]: false,
                                    }))
                                } style={{ display: isImgLoading ? 'none' : 'block' }} onMouseEnter={(e) => e.currentTarget.src = shinyUrl} onMouseLeave={(e) => e.currentTarget.src = imageUrl} />
                            </li>
                        );
                    })
                ))}
            </ul>


            <div ref={ref} className='ref'>
                {isFetchingNextPage && <p className='loading'>Loading more Pokémon...</p>}
            </div>
        </div>
    );
};

export default MainContent;