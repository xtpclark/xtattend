CREATE TABLE xtattend.port
(port_id SERIAL NOT NULL,
 port_number TEXT,
 port_descrip TEXT,
 port_shipzone_id INTEGER,
 port_costelem_id INTEGER,
 port_bu BOOLEAN,
 port_ba BOOLEAN,
 port_dr BOOLEAN,
 port_pu BOOLEAN,
 port_stat TEXT,
 CONSTRAINT port_pkey PRIMARY KEY (port_id)
);

ALTER TABLE xtattend.port OWNER TO "admin";
GRANT ALL ON TABLE xtattend.port TO "admin";
GRANT ALL ON TABLE xtattend.port TO xtrole;
GRANT ALL ON SEQUENCE xtattend.port_port_id_seq TO xtrole;

COMMENT ON TABLE xtattend.port IS 'Port Information';
