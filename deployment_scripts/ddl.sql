alter table users_roles add
    constraint users_roles_pk
        primary key (username, role);

alter table note
    add nb_done smallint default 0;

alter table note
    add nb_total smallint default 0;