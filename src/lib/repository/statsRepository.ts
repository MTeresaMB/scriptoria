import { supabase } from '../supabase'

export type StatsRow = {
  id_stats: number
  id_user: string
  total_chapters: number | null
  total_characters: number | null
  total_words: number | null
  writing_streak: number | null
  last_writing_date: string | null
  date_created: string | null
  date_updated: string | null
}

export async function getStatsByUserId(): Promise<{ data: StatsRow | null; error: { message: string } | null }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }
  const { data, error } = await supabase
    .from('stats')
    .select()
    .eq('id_user', user.id)
    .maybeSingle()
  return { data: data as StatsRow | null, error: error as { message: string } | null }
}

export async function upsertStats(
  id_user: string,
  values: Partial<Omit<StatsRow, 'id_stats' | 'id_user'>>
): Promise<{ data: StatsRow | null; error: { message: string } | null }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== id_user) return { data: null, error: { message: 'Not authenticated' } }
  const now = new Date().toISOString()
  const { data: existing } = await supabase.from('stats').select().eq('id_user', id_user).maybeSingle()
  const payload = { ...values, date_updated: now }
  if (existing) {
    const { data, error } = await supabase
      .from('stats')
      .update(payload)
      .eq('id_user', id_user)
      .select()
      .single()
    return { data: data as StatsRow | null, error: error as { message: string } | null }
  }
  const { data, error } = await supabase
    .from('stats')
    .insert({ id_user, ...payload, date_created: now })
    .select()
    .single()
  return { data: data as StatsRow | null, error: error as { message: string } | null }
}

export async function recalculateAndUpsertStats(): Promise<{
  data: StatsRow | null
  error: { message: string } | null
}> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Not authenticated' } }

  const manuscriptsRes = await supabase.from('manuscript').select('id_manuscript, word_count').eq('id_user', user.id)
  const manuscriptIds: number[] = manuscriptsRes.data?.map((m: { id_manuscript: number }) => m.id_manuscript) ?? []
  const [chaptersRes, charactersRes] = await Promise.all([
    supabase.from('chapter').select('word_count, last_edit').eq('id_user', user.id),
    manuscriptIds.length
      ? supabase.from('characters').select('id_character').in('id_manuscript', manuscriptIds)
      : Promise.resolve({ data: [] }),
  ])

  type ManuscriptRow = { id_manuscript: number; word_count: number | null }
  type ChapterRow = { word_count: number | null; last_edit: string | null }
  const manuscripts: ManuscriptRow[] = manuscriptsRes.data ?? []
  const chapters: ChapterRow[] = chaptersRes.data ?? []

  const totalManuscriptWords = manuscripts.reduce((acc: number, m: ManuscriptRow) => acc + (m.word_count ?? 0), 0)
  const totalChapterWords = chapters.reduce((acc: number, c: ChapterRow) => acc + (c.word_count ?? 0), 0)
  const totalWords = totalManuscriptWords + totalChapterWords

  const lastEditDates = chapters.map((c: ChapterRow) => c.last_edit).filter((d: string | null): d is string => !!d)
  const lastWritingDate = lastEditDates.length > 0 ? lastEditDates.sort().reverse()[0]! : null

  return upsertStats(user.id, {
    total_chapters: chapters.length,
    total_characters: charactersRes.data?.length ?? 0,
    total_words: totalWords,
    last_writing_date: lastWritingDate,
    writing_streak: null,
  })
}
