create sequence category_id_seq
    as integer;

alter table category
    alter column id set default nextval('public.category_id_seq'::regclass);