import axios from 'axios';

const URL = 'https://rickandmortyapi.com/api';

export const fetchCharacters = async () => {
  const response = await axios.get(`${URL}/character`);
  return response.data.results;
};

export const fetchEpisodes = async () => {
  const response = await axios.get(`${URL}/episode`);
  return response.data.results;
};