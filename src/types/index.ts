import type { Database } from "./database";

export type Manuscript = Database['public']['Tables']['manuscript']['Row']
export type Chapter = Database['public']['Tables']['chapter']['Row']
export type Character = Database['public']['Tables']['characters']['Row']
export type Note = Database['public']['Tables']['note']['Row']

export type ManuscriptInsert = Database['public']['Tables']['manuscript']['Insert']
export type ManuscriptUpdate = Database['public']['Tables']['manuscript']['Update']

export type ChapterInsert = Database['public']['Tables']['chapter']['Insert']
export type ChapterUpdate = Database['public']['Tables']['chapter']['Update']

export type CharacterInsert = Database['public']['Tables']['characters']['Insert']
export type CharacterUpdate = Database['public']['Tables']['characters']['Update']

export type NoteInsert = Database['public']['Tables']['note']['Insert']
export type NoteUpdate = Database['public']['Tables']['note']['Update']