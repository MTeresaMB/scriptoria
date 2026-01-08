/**
 * Utilidades para filtrado, búsqueda y ordenación
 */

export type SortOption = 'recent' | 'oldest' | 'alphabetical' | 'alphabetical-desc' | 'status' | 'word-count';

export interface FilterableItem {
  [key: string]: unknown;
}

/**
 * Filtra items por texto de búsqueda en campos específicos
 */
export function filterBySearch<T extends FilterableItem>(
  items: T[],
  searchText: string,
  searchFields: (keyof T)[]
): T[] {
  if (!searchText.trim()) return items;

  const lowerSearch = searchText.toLowerCase();
  return items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      return value && String(value).toLowerCase().includes(lowerSearch);
    })
  );
}

/**
 * Filtra items por un campo específico
 */
export function filterByField<T extends FilterableItem>(
  items: T[],
  field: keyof T,
  value: string | null
): T[] {
  if (!value) return items;
  return items.filter((item) => String(item[field]) === value);
}

/**
 * Ordena items según la opción seleccionada
 */
export function sortItems<T extends FilterableItem>(
  items: T[],
  sortOption: SortOption,
  dateField?: keyof T,
  textField?: keyof T,
  statusField?: keyof T,
  numberField?: keyof T
): T[] {
  const sorted = [...items];

  switch (sortOption) {
    case 'recent':
      if (dateField) {
        return sorted.sort((a, b) => {
          const dateA = a[dateField] ? new Date(String(a[dateField])).getTime() : 0;
          const dateB = b[dateField] ? new Date(String(b[dateField])).getTime() : 0;
          return dateB - dateA;
        });
      }
      break;

    case 'oldest':
      if (dateField) {
        return sorted.sort((a, b) => {
          const dateA = a[dateField] ? new Date(String(a[dateField])).getTime() : 0;
          const dateB = b[dateField] ? new Date(String(b[dateField])).getTime() : 0;
          return dateA - dateB;
        });
      }
      break;

    case 'alphabetical':
      if (textField) {
        return sorted.sort((a, b) => {
          const textA = String(a[textField] || '').toLowerCase();
          const textB = String(b[textField] || '').toLowerCase();
          return textA.localeCompare(textB);
        });
      }
      break;

    case 'alphabetical-desc':
      if (textField) {
        return sorted.sort((a, b) => {
          const textA = String(a[textField] || '').toLowerCase();
          const textB = String(b[textField] || '').toLowerCase();
          return textB.localeCompare(textA);
        });
      }
      break;

    case 'status':
      if (statusField) {
        const statusOrder: Record<string, number> = {
          'completed': 1,
          'in progress': 2,
          'draft': 3,
        };
        return sorted.sort((a, b) => {
          const statusA = String(a[statusField] || '').toLowerCase();
          const statusB = String(b[statusField] || '').toLowerCase();
          return (statusOrder[statusA] || 999) - (statusOrder[statusB] || 999);
        });
      }
      break;

    case 'word-count':
      if (numberField) {
        return sorted.sort((a, b) => {
          const numA = Number(a[numberField] || 0);
          const numB = Number(b[numberField] || 0);
          return numB - numA;
        });
      }
      break;
  }

  return sorted;
}

