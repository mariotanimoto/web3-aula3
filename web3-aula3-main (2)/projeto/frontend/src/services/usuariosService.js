import api from './api';

export const getUsuarios = async () => {
    const response = await api.get("/usuarios");
    return response.data;
}