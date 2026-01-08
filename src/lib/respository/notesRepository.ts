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

export async function getAllNotes() {
  return await noteRepo.select();
}

export async function getNoteById(id: number) {
  return await supabase
    .from(TABLE)
    .select()
    .eq("id_note", id)
    .single();
}

export async function getNotesByManuscriptId(id_manuscript: number) {
  return await supabase
    .from(TABLE)
    .select()
    .eq("id_manuscript", id_manuscript)
    .order("date_created", { ascending: false });
}

