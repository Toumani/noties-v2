alter table users_roles add
    constraint users_roles_pk
        primary key (username, role);

alter table note
    add nb_done smallint default 0;

alter table note
    add nb_total smallint default 0;

create sequence note_id_seq
    as integer;

alter table note
    alter column id set default nextval('public.note_id_seq'::regclass);