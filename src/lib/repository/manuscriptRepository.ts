import { table } from "./supabaseRepository";
import type { Database } from "../../types/database";
import { supabase } from "../supabase";

const TABLE = "manuscript" as const;

type ManuscriptTable = Database["public"]["Tables"][typeof TABLE];
export type ManuscriptRow = ManuscriptTable["Row"];
export type ManuscriptInsert = ManuscriptTable["Insert"];
export type ManuscriptUpdate = ManuscriptTable["Update"];

const manuscriptRepo = table(TABLE);

export async function insertManuscript(values: ManuscriptInsert) {
  return await manuscriptRepo.insert(values);
}

export async function updateManuscript(id: number, values: ManuscriptUpdate) {
  return await manuscriptRepo.update("id_manuscript", id, values);
}

export async function deleteManuscript(id: number) {
  return await manuscriptRepo.delete("id_manuscript", id);
}

export async function getAllManuscripts() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: null };
  return await supabase
    .from(TABLE)
    .select()
    .eq("id_user", user.id);
}

export async function getManuscriptById(id: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } as Error };
  return await supabase
    .from(TABLE)
    .select()
    .eq("id_manuscript", id)
    .eq("id_user", user.id)
    .single();
}

export async function recalculateManuscriptWordCount(id: number) {
  const { data: chapters, error } = await supabase
    .from("chapter")
    .select("word_count")
    .eq("id_manuscript", id);

  if (error) {
    return { data: null, error };
  }

  const totalWords =
    chapters?.reduce(
      (acc: number, ch: { word_count: number | null }) =>
        acc + (ch.word_count || 0),
      0,
    ) || 0;

  return await updateManuscript(id, { word_count: totalWords });
}

