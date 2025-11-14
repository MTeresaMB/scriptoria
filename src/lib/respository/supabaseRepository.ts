import type { Database } from "../../types/database";
import { supabase } from "../supabase";

/**
 * Limpia un objeto eliminando campos undefined y validando números
 */
function cleanInsertData<T extends Record<string, unknown>>(data: T): T {
  const cleaned = { ...data } as Partial<T>;

  for (const key in cleaned) {
    if (!Object.prototype.hasOwnProperty.call(cleaned, key)) continue;

    const value = cleaned[key];

    // Eliminar undefined
    if (value === undefined) {
      delete cleaned[key];
      continue;
    }

    // Validar números para evitar NaN - establecer a 0 si es NaN y es un campo numérico
    if (typeof value === 'number' && isNaN(value)) {
      console.warn(`Campo ${key} tiene valor NaN, se establecerá a 0`);
      // Para word_count y otros campos numéricos requeridos, establecer a 0
      if (key === 'word_count' || key.includes('count') || key.includes('id_')) {
        (cleaned as Record<string, unknown>)[key] = 0;
      } else {
        // Para otros campos numéricos opcionales, eliminar
        delete cleaned[key];
      }
      continue;
    }
  }

  return cleaned as T;
}

export function table<T extends keyof Database['public']['Tables']>(
  tableName: T
) {
  type Table = Database['public']['Tables'][T];
  type Insert = Table['Insert'];
  type Update = Table['Update'];

  return {
    /**
     * SELECT * FROM table
     */
    select: async () => {
      return await supabase.from(tableName).select();
    },

    /**
     * INSERT INTO table VALUES (...)
     */
    insert: async (values: Insert) => {
      const cleanedValues = cleanInsertData(values as Record<string, unknown>) as Insert;
      return await supabase
        .from(tableName)
        .insert(cleanedValues)
        .select()
        .single();
    },

    /**
     * UPDATE table SET ... WHERE key = value
     */
    update: async (
      matchKey: string,
      matchValue: string | number,
      values: Update
    ) => {
      const cleanedValues = cleanInsertData(values as Record<string, unknown>) as Update;
      return await supabase
        .from(tableName)
        .update(cleanedValues)
        .eq(matchKey, matchValue)
        .select()
        .single();
    },

    /**
     * DELETE FROM table WHERE key = value
     */
    delete: async (matchKey: string, matchValue: string | number) => {
      return await supabase
        .from(tableName)
        .delete()
        .eq(matchKey, matchValue);
    },
  };
}