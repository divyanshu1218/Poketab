import { apiClient } from './api';
import type { Pokemon } from './pokemonService';

export const scanService = {
    /**
     * Scan an image to identify a Pokémon
     */
    async scanImage(file: File): Promise<Pokemon> {
        const formData = new FormData();
        formData.append('file', file);

        console.log('[DEBUG] Scanning image:', {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            url: '/pokemon/scan',
            token: localStorage.getItem('poketab_access_token') ? 'Present' : 'Missing'
        });

        try {
            const response = await apiClient.post<Pokemon>('/pokemon/scan', formData);

            console.log('[DEBUG] Scan response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('[DEBUG] Scan error:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    },

    /**
     * Search for a Pokémon by name
     */
    async searchPokemon(name: string): Promise<Pokemon> {
        const response = await apiClient.get<Pokemon>(`/pokemon/search/${name}`);
        return response.data;
    },
};
