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
  return await charactersRepo.select();
}

export async function getCharacterById(id: number) {
  return await supabase
    .from(TABLE)
    .select()
    .eq("id_character", id)
    .single();
}

export async function getCharactersByManuscriptId(id_manuscript: number) {
  return await supabase
    .from(TABLE)
    .select()
    .eq("id_manuscript", id_manuscript)
    .order("name");
}