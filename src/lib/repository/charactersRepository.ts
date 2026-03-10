import type { Database } from "@/types/database";
import { table } from "./supabaseRepository";
import { supabase } from "../supabase";

const TABLE = "characters" as const;

type CharactersTable = Database["public"]["Tables"][typeof TABLE];
export type CharactersRow = CharactersTable["Row"];
export type CharactersInsert = CharactersTable["Insert"];
export type CharactersUpdate = CharactersTable["Update"];

const charactersRepo = table(TABLE);

export async function insertCharacter(values: CharactersInsert) {
  return await charactersRepo.insert(values);
}

export async function updateCharacter(id: number, values: CharactersUpdate) {
  return await charactersRepo.update("id_character", id, values);
}

export async function deleteCharacter(id: number) {
  return await charactersRepo.delete("id_character", id);
}

export async function getAllCharacters() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: null };
  const { data: manuscripts } = await supabase
    .from("manuscript")
    .select("id_manuscript")
    .eq("id_user", user.id);
  const manuscriptIds = (manuscripts ?? [])
    .map((m: { id_manuscript: number | null }) => m.id_manuscript)
    .filter((id: number | null | undefined): id is number => id != null);
  if (manuscriptIds.length === 0) return { data: [], error: null };
  return await supabase
    .from(TABLE)
    .select()
    .in("id_manuscript", manuscriptIds);
}

export async function getCharacterById(id: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } as Error };
  const { data: character, error } = await supabase
    .from(TABLE)
    .select()
    .eq("id_character", id)
    .single();
  if (error || !character) return { data: null, error };
  if (character.id_manuscript == null) return { data: null, error: { message: "Not found" } as Error };
  const { data: manuscript } = await supabase
    .from("manuscript")
    .select("id_user")
    .eq("id_manuscript", character.id_manuscript)
    .single();
  if (!manuscript || manuscript.id_user !== user.id) return { data: null, error: { message: "Not found" } as Error };
  return { data: character, error: null };
}

export async function getCharactersByManuscriptId(id_manuscript: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: null };
  const { data: manuscript } = await supabase
    .from("manuscript")
    .select("id_manuscript")
    .eq("id_manuscript", id_manuscript)
    .eq("id_user", user.id)
    .single();
  if (!manuscript) return { data: [], error: null };
  return await supabase
    .from(TABLE)
    .select()
    .eq("id_manuscript", id_manuscript)
    .order("name");
}