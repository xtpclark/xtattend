CREATE TABLE xtattend.itemcontract
(itemcontract_id SERIAL NOT NULL,
 itemcontract_item_id INTEGER,
 itemcontract_uses_contract BOOLEAN,
 CONSTRAINT itemcontract_pkey PRIMARY KEY (itemcontract_id)
);

ALTER TABLE xtattend.itemcontract OWNER TO "admin";
GRANT ALL ON TABLE xtattend.itemcontract TO "admin";
GRANT ALL ON TABLE xtattend.itemcontract TO xtrole;
GRANT ALL ON SEQUENCE xtattend.itemcontract_itemcontract_id_seq TO xtrole;

COMMENT ON TABLE xtattend.itemcontract IS 'Item / Contract Relationships';
