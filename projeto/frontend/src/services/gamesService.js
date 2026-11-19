const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path) {
    const response = await fetch(`${API_URL}${path}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.details || data.error || 'Erro ao consultar o servidor.');
    }
    return data;
}

export const getGames = (params = {}) => {
    const query = new URLSearchParams(
        Object.entries(params).filter(([, value]) => value !== '' && value != null)
    );
    return request(`/api/games?${query.toString()}`);
};

export const getGameById = (id) => request(`/api/games/${encodeURIComponent(id)}`);
export const getGenres = () => request('/api/genres');
export const getPlatforms = () => request('/api/platforms');
