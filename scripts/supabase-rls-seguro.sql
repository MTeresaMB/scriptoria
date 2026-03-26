-- =============================================================================
-- Scriptoria: políticas RLS más seguras
-- =============================================================================
-- PASOS (no hace falta saber SQL):
-- 1. Abre https://supabase.com y entra en TU proyecto.
-- 2. Menú izquierda → "SQL Editor".
-- 3. Botón "New query".
-- 4. Copia TODO este archivo y pégalo.
-- 5. Pulsa "Run" (abajo a la derecha).
-- 6. Debe poner "Success". Luego abre tu app y prueba crear/editar algo.
--
-- Si falla: copia el mensaje de error rojo y guárdalo.
-- =============================================================================

-- Borra todas las políticas de una tabla y luego creamos las nuevas.
-- (manuscript primero: el resto depende de saber qué manuscritos son tuyos)

-- --- manuscript ---
ALTER TABLE public.manuscript ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'manuscript'
  LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON public.manuscript', pol.policyname);
  END LOOP;
END $$;
CREATE POLICY manuscript_select_own ON public.manuscript FOR SELECT TO authenticated USING (id_user = auth.uid());
CREATE POLICY manuscript_insert_own ON public.manuscript FOR INSERT TO authenticated WITH CHECK (id_user = auth.uid());
CREATE POLICY manuscript_update_own ON public.manuscript FOR UPDATE TO authenticated USING (id_user = auth.uid()) WITH CHECK (id_user = auth.uid());
CREATE POLICY manuscript_delete_own ON public.manuscript FOR DELETE TO authenticated USING (id_user = auth.uid());

-- --- chapter ---
ALTER TABLE public.chapter ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'chapter'
  LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON public.chapter', pol.policyname);
  END LOOP;
END $$;
CREATE POLICY chapter_select_own ON public.chapter FOR SELECT TO authenticated USING (id_user = auth.uid());
CREATE POLICY chapter_insert_own ON public.chapter FOR INSERT TO authenticated WITH CHECK (id_user = auth.uid());
CREATE POLICY chapter_update_own ON public.chapter FOR UPDATE TO authenticated USING (id_user = auth.uid()) WITH CHECK (id_user = auth.uid());
CREATE POLICY chapter_delete_own ON public.chapter FOR DELETE TO authenticated USING (id_user = auth.uid());

-- --- characters ---
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'characters'
  LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON public.characters', pol.policyname);
  END LOOP;
END $$;
CREATE POLICY characters_select_own ON public.characters FOR SELECT TO authenticated USING (
  id_manuscript IS NULL OR id_manuscript IN (SELECT id_manuscript FROM public.manuscript WHERE id_user = auth.uid())
);
CREATE POLICY characters_insert_own ON public.characters FOR INSERT TO authenticated WITH CHECK (
  id_manuscript IS NULL OR id_manuscript IN (SELECT id_manuscript FROM public.manuscript WHERE id_user = auth.uid())
);
CREATE POLICY characters_update_own ON public.characters FOR UPDATE TO authenticated USING (
  id_manuscript IS NULL OR id_manuscript IN (SELECT id_manuscript FROM public.manuscript WHERE id_user = auth.uid())
) WITH CHECK (
  id_manuscript IS NULL OR id_manuscript IN (SELECT id_manuscript FROM public.manuscript WHERE id_user = auth.uid())
);
CREATE POLICY characters_delete_own ON public.characters FOR DELETE TO authenticated USING (
  id_manuscript IS NULL OR id_manuscript IN (SELECT id_manuscript FROM public.manuscript WHERE id_user = auth.uid())
);

-- --- note ---
ALTER TABLE public.note ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'note'
  LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON public.note', pol.policyname);
  END LOOP;
END $$;
CREATE POLICY note_select_own ON public.note FOR SELECT TO authenticated USING (
  id_user = auth.uid()
  OR (id_manuscript IS NOT NULL AND id_manuscript IN (SELECT id_manuscript FROM public.manuscript WHERE id_user = auth.uid()))
);
CREATE POLICY note_insert_own ON public.note FOR INSERT TO authenticated WITH CHECK (
  id_user = auth.uid()
  AND (id_manuscript IS NULL OR id_manuscript IN (SELECT id_manuscript FROM public.manuscript WHERE id_user = auth.uid()))
);
CREATE POLICY note_update_own ON public.note FOR UPDATE TO authenticated USING (
  id_user = auth.uid()
  OR (id_manuscript IS NOT NULL AND id_manuscript IN (SELECT id_manuscript FROM public.manuscript WHERE id_user = auth.uid()))
) WITH CHECK (
  id_user = auth.uid()
  AND (id_manuscript IS NULL OR id_manuscript IN (SELECT id_manuscript FROM public.manuscript WHERE id_user = auth.uid()))
);
CREATE POLICY note_delete_own ON public.note FOR DELETE TO authenticated USING (
  id_user = auth.uid()
  OR (id_manuscript IS NOT NULL AND id_manuscript IN (SELECT id_manuscript FROM public.manuscript WHERE id_user = auth.uid()))
);

-- --- chapter_has_character ---
ALTER TABLE public.chapter_has_character ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'chapter_has_character'
  LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON public.chapter_has_character', pol.policyname);
  END LOOP;
END $$;
CREATE POLICY chc_select_own ON public.chapter_has_character FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.chapter c WHERE c.id_chapter = chapter_has_character.id_chapter AND c.id_user = auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.characters ch
    WHERE ch.id_character = chapter_has_character.id_character
      AND (ch.id_manuscript IS NULL OR ch.id_manuscript IN (SELECT id_manuscript FROM public.manuscript WHERE id_user = auth.uid()))
  )
);
CREATE POLICY chc_insert_own ON public.chapter_has_character FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.chapter c WHERE c.id_chapter = chapter_has_character.id_chapter AND c.id_user = auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.characters ch
    WHERE ch.id_character = chapter_has_character.id_character
      AND (ch.id_manuscript IS NULL OR ch.id_manuscript IN (SELECT id_manuscript FROM public.manuscript WHERE id_user = auth.uid()))
  )
);
CREATE POLICY chc_update_own ON public.chapter_has_character FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.chapter c WHERE c.id_chapter = chapter_has_character.id_chapter AND c.id_user = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.chapter c WHERE c.id_chapter = chapter_has_character.id_chapter AND c.id_user = auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.characters ch
    WHERE ch.id_character = chapter_has_character.id_character
      AND (ch.id_manuscript IS NULL OR ch.id_manuscript IN (SELECT id_manuscript FROM public.manuscript WHERE id_user = auth.uid()))
  )
);
CREATE POLICY chc_delete_own ON public.chapter_has_character FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.chapter c WHERE c.id_chapter = chapter_has_character.id_chapter AND c.id_user = auth.uid())
);

-- --- stats (dashboard) ---
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'stats'
  LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON public.stats', pol.policyname);
  END LOOP;
END $$;
CREATE POLICY stats_select_own ON public.stats FOR SELECT TO authenticated USING (id_user = auth.uid());
CREATE POLICY stats_insert_own ON public.stats FOR INSERT TO authenticated WITH CHECK (id_user = auth.uid());
CREATE POLICY stats_update_own ON public.stats FOR UPDATE TO authenticated USING (id_user = auth.uid()) WITH CHECK (id_user = auth.uid());
CREATE POLICY stats_delete_own ON public.stats FOR DELETE TO authenticated USING (id_user = auth.uid());
