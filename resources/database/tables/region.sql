CREATE TABLE cgms.region
(region_id SERIAL NOT NULL,
 region_number TEXT,
 region_descrip TEXT,
 region_costelem_id INTEGER,
 CONSTRAINT region_pkey PRIMARY KEY (region_id)
);

ALTER TABLE cgms.region OWNER TO "admin";
GRANT ALL ON TABLE cgms.region TO "admin";
GRANT ALL ON TABLE cgms.region TO xtrole;
GRANT ALL ON SEQUENCE cgms.region_region_id_seq TO xtrole;

COMMENT ON TABLE cgms.region IS 'Region Information';
