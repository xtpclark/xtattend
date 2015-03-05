CREATE TABLE cgms.contractitem
(contractitem_id SERIAL NOT NULL,
 contractitem_contract_id INTEGER NOT NULL,
 contractitem_item_id INTEGER NOT NULL,
 contractitem_site_id INTEGER NOT NULL DEFAULT (-1),
 contractitem_port_id INTEGER NOT NULL DEFAULT (-1),
 contractitem_pricing_type TEXT NOT NULL,
 contractitem_costelem_id INTEGER NOT NULL,
 contractitem_pctmarkup NUMERIC NOT NULL DEFAULT 0,
 contractitem_curr_id INTEGER NOT NULL DEFAULT basecurrid(),
 CONSTRAINT contractitem_pkey PRIMARY KEY (contractitem_id),
 CONSTRAINT contractitem_contractitem_contract_id_fkey FOREIGN KEY (contractitem_contract_id)
   REFERENCES cgms.contract (contract_id) MATCH SIMPLE
   ON UPDATE NO ACTION ON DELETE CASCADE,
 CONSTRAINT contractitem_contractitem_curr_id_fkey FOREIGN KEY (contractitem_curr_id)
   REFERENCES curr_symbol (curr_id) MATCH SIMPLE
   ON UPDATE NO ACTION ON DELETE NO ACTION
);

ALTER TABLE cgms.contractitem OWNER TO "admin";
GRANT ALL ON TABLE cgms.contractitem TO "admin";
GRANT ALL ON TABLE cgms.contractitem TO xtrole;
GRANT ALL ON SEQUENCE cgms.contractitem_contractitem_id_seq TO xtrole;

COMMENT ON TABLE cgms.contract IS 'Contract Item Information';
