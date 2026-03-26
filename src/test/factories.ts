import type { ChapterRow } from '@/lib/repository/chaptersRepository'
import type { CharactersRow } from '@/lib/repository/charactersRepository'
import type { ManuscriptRow } from '@/lib/repository/manuscriptRepository'
import type { Note } from '@/types'

export const createChapterRow = (overrides: Partial<ChapterRow> = {}): ChapterRow => ({
  id_chapter: 1,
  chapter_number: 1,
  content: null,
  date_created: '2024-06-01T12:00:00.000Z',
  id_manuscript: 10,
  id_user: null,
  last_edit: null,
  name_chapter: 'Opening',
  status: 'Draft',
  summary: 'A short summary.',
  word_count: 1200,
  ...overrides,
})

export const createManuscriptRow = (overrides: Partial<ManuscriptRow> = {}): ManuscriptRow => ({
  id_manuscript: 1,
  id_user: null,
  title: 'Untitled',
  status: 'draft',
  summary: null,
  genre: null,
  word_count: 0,
  date_created: '2024-06-01T12:00:00.000Z',
  date_updated: null,
  picture: null,
  target_audience: null,
  ...overrides,
})

export const createCharacterRow = (overrides: Partial<CharactersRow> = {}): CharactersRow => ({
  id_character: 1,
  id_manuscript: null,
  name: 'Unnamed',
  age: null,
  biography: null,
  birth: null,
  build: null,
  date_created: null,
  external_motivation: null,
  eye_color: null,
  eye_shape: null,
  fears_phobias: null,
  flaw: null,
  hair_color: null,
  hair_style: null,
  height: null,
  internal_motivation: null,
  motto: null,
  negative_traits: null,
  occupation: null,
  personality_type: null,
  picture: null,
  positive_traits: null,
  quirks_mannerisms: null,
  relationship_status: null,
  role: null,
  scars: null,
  weight: null,
  ...overrides,
})

export const createNote = (overrides: Partial<Note> = {}): Note => ({
  id_note: 1,
  title: 'Plot twist',
  content: 'Remember to foreshadow.',
  category: 'Plot',
  priority: 'High',
  date_created: '2024-06-02T12:00:00.000Z',
  id_manuscript: 5,
  id_user: null,
  ...overrides,
})
