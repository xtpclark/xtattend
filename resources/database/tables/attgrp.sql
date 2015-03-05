CREATE TABLE xtattend.attgrp
(
  attgrp_id serial NOT NULL,
  attgrp_name text,
  attgrp_descrip text,
  attgrp_prj_id integer,
  CONSTRAINT attgrp_pkey PRIMARY KEY (attgrp_id),
  CONSTRAINT attgrp_attgrp_name_key UNIQUE (attgrp_name)
)
WITH (
  OIDS=FALSE
);
  
ALTER TABLE xtattend.attgrp OWNER TO admin;
GRANT ALL ON TABLE xtattend.attgrp TO admin;
GRANT ALL ON TABLE xtattend.attgrp TO xtrole;
GRANT ALL ON SEQUENCE xtattend.attgrp_attgrp_id_seq TO xtrole;

COMMENT ON TABLE xtattend.attgrp IS 'Meeting, Class, or Group Information';
