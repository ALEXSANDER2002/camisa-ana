export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      shirts: {
        Row: {
          id: string
          name: string
          size: string
          color: string
          material: string
          quantity: number
          price: number
          description: string | null
          paid: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          size: string
          color: string
          material: string
          quantity: number
          price: number
          description?: string | null
          paid?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          size?: string
          color?: string
          material?: string
          quantity?: number
          price?: number
          description?: string | null
          paid?: boolean | null
          created_at?: string
        }
      }
    }
  }
}

