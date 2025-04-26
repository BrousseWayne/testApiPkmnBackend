import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2/"

const logIfAxiosError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
        console.error('Axios error:', err.response?.data);
        console.error('Axios status:', err.response?.status);
    } else {
        console.error('Unknown error:', err);
    }
}

export const fetchPokemon = async (pokemonName: string) => {
    const url = BASE_URL + "pokemon/" + pokemonName
    try {
        const response = await axios.get(url);

        // Axios automatically parses the response as JSON, so we can access the data directly
        return response.data;

    } catch (err) {
        // logIfAxiosError(err)
        throw err;
    }
};

export const fetchByType = async (typeName: string) => {
    const url = BASE_URL + "type/" + typeName
    // console.log(url)

    try {
        const response = await axios.get(url);

        return response.data;

    } catch (err) {
        // logIfAxiosError(err)
        throw err;
    }
}

export const fetchByMove = async (moveName: string) => {
    const url = BASE_URL + "move/" + moveName

    try {
        const response = await axios.get(url);

        return response.data;

    } catch (err) {
        // logIfAxiosError(err)
        throw err;
    }
}

export const fetchPokemonSpecies = async (pokemonName: string) => {
    const url = BASE_URL + "pokemon-species/" + pokemonName

    try {
        const response = await axios.get(url);

        return response.data;

    } catch (err) {
        // logIfAxiosError(err)
        throw err;
    }
}