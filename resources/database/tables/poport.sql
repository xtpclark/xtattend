CREATE TABLE cgms.poport
(poport_id SERIAL NOT NULL,
 poport_pohead_id INTEGER,
 poport_port_id INTEGER,
 poport_terminal_id INTEGER,
 CONSTRAINT poport_pkey PRIMARY KEY (poport_id),
 CONSTRAINT poport_poport_pohead_id_fkey FOREIGN KEY (poport_pohead_id)
   REFERENCES pohead (pohead_id) MATCH SIMPLE
   ON UPDATE NO ACTION ON DELETE CASCADE
);

ALTER TABLE cgms.poport OWNER TO "admin";
GRANT ALL ON TABLE cgms.poport TO "admin";
GRANT ALL ON TABLE cgms.poport TO xtrole;
GRANT ALL ON SEQUENCE cgms.poport_poport_id_seq TO xtrole;

COMMENT ON TABLE cgms.poport IS 'Purchase Order / Port Relationships';
