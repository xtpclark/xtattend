CREATE TABLE xtattend.terminal
(terminal_id SERIAL NOT NULL,
 terminal_port_id INTEGER,
 terminal_number TEXT,
 terminal_descrip TEXT,
 terminal_addr_id INTEGER,
 terminal_cntct_id INTEGER,
 CONSTRAINT terminal_pkey PRIMARY KEY (terminal_id),
 CONSTRAINT terminal_terminal_port_id_fkey FOREIGN KEY (terminal_port_id)
   REFERENCES xtattend.port (port_id) MATCH SIMPLE
   ON UPDATE NO ACTION ON DELETE CASCADE
);

ALTER TABLE xtattend.terminal OWNER TO "admin";
GRANT ALL ON TABLE xtattend.terminal TO "admin";
GRANT ALL ON TABLE xtattend.terminal TO xtrole;
GRANT ALL ON SEQUENCE xtattend.terminal_terminal_id_seq TO xtrole;

COMMENT ON TABLE xtattend.terminal IS 'Terminal Information';
