CREATE TABLE xtattend.siteport
(siteport_id SERIAL NOT NULL,
 siteport_site_id INTEGER,
 siteport_port_id INTEGER,
 CONSTRAINT siteport_pkey PRIMARY KEY (siteport_id),
 CONSTRAiNT siteport_unique UNIQUE (siteport_site_id, siteport_port_id)
);

ALTER TABLE xtattend.siteport OWNER TO "admin";
GRANT ALL ON TABLE xtattend.siteport TO "admin";
GRANT ALL ON TABLE xtattend.siteport TO xtrole;
GRANT ALL ON SEQUENCE xtattend.siteport_siteport_id_seq TO xtrole;

COMMENT ON TABLE xtattend.siteport IS 'Site / Port Relationships';
