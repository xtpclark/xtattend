CREATE TABLE cgms.terminal
(terminal_id SERIAL NOT NULL,
 terminal_port_id INTEGER,
 terminal_number TEXT,
 terminal_descrip TEXT,
 terminal_addr_id INTEGER,
 terminal_cntct_id INTEGER,
 CONSTRAINT terminal_pkey PRIMARY KEY (terminal_id),
 CONSTRAINT terminal_terminal_port_id_fkey FOREIGN KEY (terminal_port_id)
   REFERENCES cgms.port (port_id) MATCH SIMPLE
   ON UPDATE NO ACTION ON DELETE CASCADE
);

ALTER TABLE cgms.terminal OWNER TO "admin";
GRANT ALL ON TABLE cgms.terminal TO "admin";
GRANT ALL ON TABLE cgms.terminal TO xtrole;
GRANT ALL ON SEQUENCE cgms.terminal_terminal_id_seq TO xtrole;

COMMENT ON TABLE cgms.terminal IS 'Terminal Information';
