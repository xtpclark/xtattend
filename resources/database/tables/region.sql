CREATE TABLE xtattend.region
(region_id SERIAL NOT NULL,
 region_number TEXT,
 region_descrip TEXT,
 region_costelem_id INTEGER,
 CONSTRAINT region_pkey PRIMARY KEY (region_id)
);

ALTER TABLE xtattend.region OWNER TO "admin";
GRANT ALL ON TABLE xtattend.region TO "admin";
GRANT ALL ON TABLE xtattend.region TO xtrole;
GRANT ALL ON SEQUENCE xtattend.region_region_id_seq TO xtrole;

COMMENT ON TABLE xtattend.region IS 'Region Information';
