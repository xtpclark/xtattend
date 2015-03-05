CREATE TABLE cgms.contract
(contract_id SERIAL NOT NULL,
 contract_number TEXT NOT NULL,
 contract_descrip TEXT,
 contract_notes TEXT,
 contract_target_type TEXT NOT NULL,
 contract_target_id INTEGER NOT NULL,
 contract_effective DATE,
 contract_expires DATE,
 contract_ref_contract_id INTEGER,
 CONSTRAINT contract_pkey PRIMARY KEY (contract_id),
 CONSTRAINT contract_contract_target_type_check CHECK (contract_target_type = ANY (ARRAY['C'::bpchar, 'V'::bpchar]::text[]))
);

ALTER TABLE cgms.contract OWNER TO "admin";
GRANT ALL ON TABLE cgms.contract TO "admin";
GRANT ALL ON TABLE cgms.contract TO xtrole;
GRANT ALL ON SEQUENCE cgms.contract_contract_id_seq TO xtrole;

COMMENT ON TABLE cgms.contract IS 'Contract Header Information';
