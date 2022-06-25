create sequence category_id_seq
    as integer;

alter table category
    alter column id set default nextval('public.category_id_seq'::regclass);

alter table todo
    drop constraint fkcy61dldh6e47w18t12q6697ph;

alter table todo
    add constraint fkcy61dldh6e47w18t12q6697ph
        foreign key (note_id) references note
            on delete cascade;