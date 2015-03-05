CREATE TABLE xtattend.poport
(poport_id SERIAL NOT NULL,
 poport_pohead_id INTEGER,
 poport_port_id INTEGER,
 poport_terminal_id INTEGER,
 CONSTRAINT poport_pkey PRIMARY KEY (poport_id),
 CONSTRAINT poport_poport_pohead_id_fkey FOREIGN KEY (poport_pohead_id)
   REFERENCES pohead (pohead_id) MATCH SIMPLE
   ON UPDATE NO ACTION ON DELETE CASCADE
);

ALTER TABLE xtattend.poport OWNER TO "admin";
GRANT ALL ON TABLE xtattend.poport TO "admin";
GRANT ALL ON TABLE xtattend.poport TO xtrole;
GRANT ALL ON SEQUENCE xtattend.poport_poport_id_seq TO xtrole;

COMMENT ON TABLE xtattend.poport IS 'Purchase Order / Port Relationships';
