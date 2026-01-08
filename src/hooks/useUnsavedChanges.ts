import { useEffect } from 'react';

interface UseUnsavedChangesOptions {
  hasUnsavedChanges: boolean;
  message?: string;
}

/**
 * Hook para detectar cambios sin guardar y prevenir navegación accidental
 * Compatible con BrowserRouter (no requiere data router)
 * 
 * Nota: Solo previene el cierre de ventana/pestaña. Para prevenir navegación
 * interna, se debe manejar en los componentes usando useNavigate con confirmación.
 */
export const useUnsavedChanges = ({
  hasUnsavedChanges,
  message = 'You have unsaved changes. Are you sure you want to leave?'
}: UseUnsavedChangesOptions) => {
  // Prevenir cierre de ventana/pestaña
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, message]);
};

