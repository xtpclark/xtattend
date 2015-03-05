CREATE TABLE cgms.itemcontract
(itemcontract_id SERIAL NOT NULL,
 itemcontract_item_id INTEGER,
 itemcontract_uses_contract BOOLEAN,
 CONSTRAINT itemcontract_pkey PRIMARY KEY (itemcontract_id)
);

ALTER TABLE cgms.itemcontract OWNER TO "admin";
GRANT ALL ON TABLE cgms.itemcontract TO "admin";
GRANT ALL ON TABLE cgms.itemcontract TO xtrole;
GRANT ALL ON SEQUENCE cgms.itemcontract_itemcontract_id_seq TO xtrole;

COMMENT ON TABLE cgms.itemcontract IS 'Item / Contract Relationships';
