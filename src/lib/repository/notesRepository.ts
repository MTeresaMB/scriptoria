import { table } from "./supabaseRepository";
import type { Database } from "../../types/database";
import { supabase } from "../supabase";

const TABLE = "note" as const;

type NoteTable = Database["public"]["Tables"][typeof TABLE];
export type NoteRow = NoteTable["Row"];
export type NoteInsert = NoteTable["Insert"];
export type NoteUpdate = NoteTable["Update"];

const noteRepo = table(TABLE);

export async function insertNote(values: NoteInsert) {
  return await noteRepo.insert(values);
}

export async function updateNote(id: number, values: NoteUpdate) {
  return await noteRepo.update("id_note", id, values);
}

export async function deleteNote(id: number) {
  return await noteRepo.delete("id_note", id);
}

export async function getAllNotes(): Promise<{ data: NoteRow[]; error: { message: string } | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: null };
  const { data: byUser, error: err1 } = await supabase.from(TABLE).select().eq("id_user", user.id);
  if (err1) return { data: [], error: err1 };
  const { data: manuscripts } = await supabase
    .from("manuscript")
    .select("id_manuscript")
    .eq("id_user", user.id);
  const manuscriptIds = (manuscripts ?? [])
    .map((m: { id_manuscript: number | null }) => m.id_manuscript)
    .filter((id: number | null | undefined): id is number => id != null);
  let byManuscript: NoteRow[] = [];
  if (manuscriptIds.length > 0) {
    const r = await supabase.from(TABLE).select().in("id_manuscript", manuscriptIds);
    if (r.error) return { data: [], error: r.error };
    byManuscript = r.data ?? [];
  }
  const combined = [...(byUser ?? []), ...byManuscript];
  const seen = new Set<number>();
  const unique = combined.filter((n) => {
    if (seen.has(n.id_note)) return false;
    seen.add(n.id_note);
    return true;
  });
  return { data: unique, error: null };
}

export async function getNoteById(id: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } as Error };
  return await supabase
    .from(TABLE)
    .select()
    .eq("id_note", id)
    .eq("id_user", user.id)
    .single();
}

export async function getNotesByManuscriptId(id_manuscript: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: null };
  return await supabase
    .from(TABLE)
    .select()
    .eq("id_manuscript", id_manuscript)
    .eq("id_user", user.id)
    .order("date_created", { ascending: false });
}

