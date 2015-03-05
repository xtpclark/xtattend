CREATE TABLE cgms.port
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

ALTER TABLE cgms.port OWNER TO "admin";
GRANT ALL ON TABLE cgms.port TO "admin";
GRANT ALL ON TABLE cgms.port TO xtrole;
GRANT ALL ON SEQUENCE cgms.port_port_id_seq TO xtrole;

COMMENT ON TABLE cgms.port IS 'Port Information';
