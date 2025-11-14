import { table } from "./supabaseRepository";
import type { Database } from "../../types/database";

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
  return await manuscriptRepo.select();
}
