export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
    public: {
        Tables: {
            games: {
                Row: {
                    black_id: string | null
                    code: string
                    created_at: string
                    fen: string
                    id: string
                    pgn: string
                    updated_at: string
                    white_id: string | null
                }
                Insert: {
                    black_id?: string | null
                    code?: string
                    created_at?: string
                    fen?: string
                    id?: string
                    pgn?: string
                    updated_at?: string
                    white_id?: string | null
                }
                Update: {
                    black_id?: string | null
                    code?: string
                    created_at?: string
                    fen?: string
                    id?: string
                    pgn?: string
                    updated_at?: string
                    white_id?: string | null
                }
                Relationships: []
            }
            messages: {
                Row: {
                    content: string | null
                    created_at: string | null
                    game_id: string
                    id: string
                    user_id: string
                }
                Insert: {
                    content?: string | null
                    created_at?: string | null
                    game_id?: string
                    id?: string
                    user_id?: string
                }
                Update: {
                    content?: string | null
                    created_at?: string | null
                    game_id?: string
                    id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'messages_game_id_fkey'
                        columns: ['game_id']
                        referencedRelation: 'games'
                        referencedColumns: ['id']
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
