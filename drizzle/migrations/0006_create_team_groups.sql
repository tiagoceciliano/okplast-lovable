CREATE TABLE public.team_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  cor text NOT NULL DEFAULT 'emerald',
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_groups TO authenticated;
GRANT ALL ON public.team_groups TO service_role;
ALTER TABLE public.team_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view team groups"
ON public.team_groups FOR SELECT TO authenticated
USING (true);
CREATE POLICY "Admins and managers can create team groups"
ON public.team_groups FOR INSERT TO authenticated
WITH CHECK (public.is_admin_or_gestor(auth.uid()) AND created_by = auth.uid());
CREATE POLICY "Admins and managers can update team groups"
ON public.team_groups FOR UPDATE TO authenticated
USING (public.is_admin_or_gestor(auth.uid()))
WITH CHECK (public.is_admin_or_gestor(auth.uid()));
CREATE POLICY "Admins and managers can delete team groups"
ON public.team_groups FOR DELETE TO authenticated
USING (public.is_admin_or_gestor(auth.uid()));

CREATE TABLE public.team_group_members (
  group_id uuid NOT NULL REFERENCES public.team_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_group_members TO authenticated;
GRANT ALL ON public.team_group_members TO service_role;
ALTER TABLE public.team_group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view group members"
ON public.team_group_members FOR SELECT TO authenticated
USING (true);
CREATE POLICY "Admins and managers can add group members"
ON public.team_group_members FOR INSERT TO authenticated
WITH CHECK (public.is_admin_or_gestor(auth.uid()));
CREATE POLICY "Admins and managers can update group members"
ON public.team_group_members FOR UPDATE TO authenticated
USING (public.is_admin_or_gestor(auth.uid()))
WITH CHECK (public.is_admin_or_gestor(auth.uid()));
CREATE POLICY "Admins and managers can remove group members"
ON public.team_group_members FOR DELETE TO authenticated
USING (public.is_admin_or_gestor(auth.uid()));

CREATE TRIGGER team_groups_updated_at
BEFORE UPDATE ON public.team_groups
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX team_group_members_user_id_idx ON public.team_group_members(user_id);