import { apiClient } from './api';
import type { CollectionItem, CollectionAddRequest, CollectionCountResponse } from '@/types/collection.types';

export const collectionService = {
    /**
     * Get user's Pokémon collection
     */
    async getCollection(): Promise<CollectionItem[]> {
        const response = await apiClient.get<CollectionItem[]>('/collection');
        return response.data;
    },

    /**
     * Add a Pokémon to collection
     */
    async addToCollection(data: CollectionAddRequest): Promise<CollectionItem> {
        const response = await apiClient.post<CollectionItem>('/collection', data);
        return response.data;
    },

    /**
     * Remove a Pokémon from collection
     */
    async removeFromCollection(collectionId: number): Promise<void> {
        await apiClient.delete(`/collection/${collectionId}`);
    },

    /**
     * Get collection count
     */
    async getCollectionCount(): Promise<CollectionCountResponse> {
        const response = await apiClient.get<CollectionCountResponse>('/collection/count');
        return response.data;
    },
};
