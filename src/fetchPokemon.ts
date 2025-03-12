import axios from "axios";

export const fetchPokemon = async (pokemonName: string) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

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
