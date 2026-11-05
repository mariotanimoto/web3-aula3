import api from './api';

export async function getClima(cidade) {
    const response = await api.get('/clima', { params: { cidade } });
    return response.data;
}
