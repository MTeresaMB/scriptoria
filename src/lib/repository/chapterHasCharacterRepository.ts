import { supabase } from '../supabase'

const TABLE = 'chapter_has_character' as const

export async function getCharactersByChapterId(id_chapter: number) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], error: null }
  const { data: chapter } = await supabase
    .from('chapter')
    .select('id_chapter, id_user')
    .eq('id_chapter', id_chapter)
    .single()
  if (!chapter || chapter.id_user !== user.id) return { data: [], error: null }
  const { data, error } = await supabase
    .from(TABLE)
    .select('id_character')
    .eq('id_chapter', id_chapter)
  return { data: data ?? [], error }
}

export async function getChapterIdsByCharacterId(id_character: number) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], error: null }
  const { data: character } = await supabase
    .from('characters')
    .select('id_character, id_manuscript')
    .eq('id_character', id_character)
    .single()
  if (!character) return { data: [], error: null }
  if (character.id_manuscript) {
    const { data: manuscript } = await supabase
      .from('manuscript')
      .select('id_user')
      .eq('id_manuscript', character.id_manuscript)
      .single()
    if (!manuscript || manuscript.id_user !== user.id) return { data: [], error: null }
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select('id_chapter')
    .eq('id_character', id_character)
  return { data: data ?? [], error }
}

export async function addCharacterToChapter(id_chapter: number, id_character: number) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } as Error }
  const { data: chapter } = await supabase
    .from('chapter')
    .select('id_user')
    .eq('id_chapter', id_chapter)
    .single()
  if (!chapter || chapter.id_user !== user.id) return { data: null, error: { message: 'Not found' } as Error }
  return await supabase
    .from(TABLE)
    .insert({ id_chapter, id_character })
    .select()
    .single()
}

export async function removeCharacterFromChapter(id_chapter: number, id_character: number) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { message: 'Not authenticated' } as Error }
  const { data: chapter } = await supabase
    .from('chapter')
    .select('id_user')
    .eq('id_chapter', id_chapter)
    .single()
  if (!chapter || chapter.id_user !== user.id) return { error: { message: 'Not found' } as Error }
  return await supabase
    .from(TABLE)
    .delete()
    .eq('id_chapter', id_chapter)
    .eq('id_character', id_character)
}

export async function setCharactersForChapter(id_chapter: number, characterIds: number[]) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { message: 'Not authenticated' } as Error }
  const { data: chapter } = await supabase
    .from('chapter')
    .select('id_user')
    .eq('id_chapter', id_chapter)
    .single()
  if (!chapter || chapter.id_user !== user.id) return { error: { message: 'Not found' } as Error }
  await supabase.from(TABLE).delete().eq('id_chapter', id_chapter)
  if (characterIds.length === 0) return { error: null }
  const rows = characterIds.map((id_character) => ({ id_chapter, id_character }))
  const { error } = await supabase.from(TABLE).insert(rows)
  return { error }
}
