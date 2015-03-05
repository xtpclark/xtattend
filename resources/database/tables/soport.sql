CREATE TABLE xtattend.soport
(soport_id SERIAL NOT NULL,
 soport_cohead_id INTEGER,
 soport_port_id INTEGER,
 soport_terminal_id INTEGER,
 CONSTRAINT soport_pkey PRIMARY KEY (soport_id),
 CONSTRAINT soport_soport_cohead_id_fkey FOREIGN KEY (soport_cohead_id)
   REFERENCES cohead (cohead_id) MATCH SIMPLE
   ON UPDATE NO ACTION ON DELETE CASCADE
);

ALTER TABLE xtattend.soport OWNER TO "admin";
GRANT ALL ON TABLE xtattend.soport TO "admin";
GRANT ALL ON TABLE xtattend.soport TO xtrole;
GRANT ALL ON SEQUENCE xtattend.soport_soport_id_seq TO xtrole;

COMMENT ON TABLE xtattend.soport IS 'Sales Order / Port Relationships';
