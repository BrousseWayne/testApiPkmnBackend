import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2/"

// export type AxiosFetchErrorType = {
//     status: number;
//     message: string;
// }

export const fetchByName = async (pokemonName: string) => {
    const url = `${BASE_URL}pokemon/${pokemonName}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw {
                status: err.response?.status || 500,
                message: `Failed to fetch pokemon: ${pokemonName}`
            }
        }

        throw { status: 500, message: "Unknown error occurred" };
    }
};

export const fetchByType = async (typeName: string) => {
    const url = `${BASE_URL}type/${typeName}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw {
                status: err.response?.status || 500,
                message: `Failed to fetch type: ${typeName}`
            }
        }

        throw { status: 500, message: "Unknown error occurred" };
    }
};

export const fetchByMove = async (moveName: string) => {
    const url = `${BASE_URL}move/${moveName}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw {
                status: err.response?.status || 500,
                message: `Failed to fetch move for: ${moveName}`
            };
        }

        throw { status: 500, message: "Unknown error occurred" };
    }
};



export const fetchPokemonSpecies = async (pokemonName: string) => {
    const url = `${BASE_URL}pokemon-species/${pokemonName}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw {
                status: err.response?.status || 500,
                message: `Failed to fetch species for: ${pokemonName}`
            };
        }

        throw { status: 500, message: "Unknown error occurred" };
    }
};

export const fetchEvolutionChain = async (chainId: number) => {
    const url = `${BASE_URL}evolution-chain/${chainId}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw {
                status: err.response?.status || 500,
                message: `Failed to fetch chain for: ${chainId}`
            };
        }

        throw { status: 500, message: "Unknown error occurred" };
    }
};



