CREATE TABLE cgms.soport
(soport_id SERIAL NOT NULL,
 soport_cohead_id INTEGER,
 soport_port_id INTEGER,
 soport_terminal_id INTEGER,
 CONSTRAINT soport_pkey PRIMARY KEY (soport_id),
 CONSTRAINT soport_soport_cohead_id_fkey FOREIGN KEY (soport_cohead_id)
   REFERENCES cohead (cohead_id) MATCH SIMPLE
   ON UPDATE NO ACTION ON DELETE CASCADE
);

ALTER TABLE cgms.soport OWNER TO "admin";
GRANT ALL ON TABLE cgms.soport TO "admin";
GRANT ALL ON TABLE cgms.soport TO xtrole;
GRANT ALL ON SEQUENCE cgms.soport_soport_id_seq TO xtrole;

COMMENT ON TABLE cgms.soport IS 'Sales Order / Port Relationships';
