import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2/pokemon/"

export const fetchPokemon = async (pokemonName: string) => {
    const url = BASE_URL + pokemonName
    try {
        const response = await axios.get(url);

        // Axios automatically parses the response as JSON, so we can access the data directly
        return response.data;

    } catch (err) {
        //This check help us differentiate between general errors and Axios-specific ones
        if (axios.isAxiosError(err)) {
            console.error('Axios error:', err.response?.data);
            console.error('Axios status:', err.response?.status);
        } else {
            console.error('Unknown error:', err);
        }
        throw err;
    }
};
