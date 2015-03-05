CREATE TABLE xtattend.attmember
(
   attmember_id serial NOT NULL,
   attmember_attgrp_id integer,
   attmember_cntct_id integer,
   CONSTRAINT attmember_pkey PRIMARY KEY (attmember_id),
   CONSTRAINT attmember_attgrp_cntct_id_key UNIQUE (attmember_attgrp_id,attmember_cntct_id)

)
WITH (
  OIDS=FALSE
);
ALTER TABLE xtattend.attmember OWNER TO admin;
GRANT ALL ON TABLE xtattend.attmember TO admin;
GRANT ALL ON TABLE xtattend.attmember TO xtrole;
GRANT ALL ON SEQUENCE xtattend.attmember_attmember_id_seq TO xtrole;

COMMENT ON TABLE xtattend.attmember IS 'Member Associations';
