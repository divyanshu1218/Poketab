export interface CollectionItem {
    id: number;
    user_id: number;
    pokemon_name: string;
    pokemon_id: number;
    pokemon_data: any;
    created_at: string;
}

export interface CollectionAddRequest {
    pokemon_name: string;
    pokemon_id: number;
    pokemon_data?: any;
}

export interface CollectionCountResponse {
    count: number;
    max: number;
    remaining: number;
}
