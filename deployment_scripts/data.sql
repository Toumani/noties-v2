-- noinspection SqlWithoutWhere
update note n set
                  nb_done = (select count(*) from todo t where t.done = true and t.note_id = n.id),
                  nb_total = (select count(*) from todo t where t.note_id = n.id);