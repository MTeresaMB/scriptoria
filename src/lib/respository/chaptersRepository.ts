import type { Database } from "@/types/database"
import { table } from "./supabaseRepository"
import { supabase } from "../supabase"

const TABLE = "chapter" as const

type ChaptersTable = Database["public"]["Tables"][typeof TABLE]
export type ChapterRow = ChaptersTable["Row"]
export type ChapterInsert = ChaptersTable["Insert"]
export type ChapterUpdate = ChaptersTable["Update"]

const chaptersRepo = table(TABLE)

export async function insertChapter(values: ChapterInsert) {
  return await chaptersRepo.insert(values)
}

export async function updateChapter(id: number, values: ChapterUpdate) {
  return await chaptersRepo.update("id_chapter", id, values)
}

export async function deleteChapter(id: number) {
  return await chaptersRepo.delete("id_chapter", id)
}

export async function getAllChapters() {
  return await chaptersRepo.select()
}

export async function getChapterById(id: number) {
  return await supabase
    .from(TABLE)
    .select()
    .eq("id_chapter", id)
    .single()
}

export async function getChaptersByManuscriptId(id_manuscript: number) {
  return await supabase
    .from(TABLE)
    .select()
    .eq("id_manuscript", id_manuscript)
    .order("chapter_number")
}


