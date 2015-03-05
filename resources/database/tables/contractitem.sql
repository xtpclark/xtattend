CREATE TABLE xtattend.contractitem
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
   REFERENCES xtattend.contract (contract_id) MATCH SIMPLE
   ON UPDATE NO ACTION ON DELETE CASCADE,
 CONSTRAINT contractitem_contractitem_curr_id_fkey FOREIGN KEY (contractitem_curr_id)
   REFERENCES curr_symbol (curr_id) MATCH SIMPLE
   ON UPDATE NO ACTION ON DELETE NO ACTION
);

ALTER TABLE xtattend.contractitem OWNER TO "admin";
GRANT ALL ON TABLE xtattend.contractitem TO "admin";
GRANT ALL ON TABLE xtattend.contractitem TO xtrole;
GRANT ALL ON SEQUENCE xtattend.contractitem_contractitem_id_seq TO xtrole;

COMMENT ON TABLE xtattend.contract IS 'Contract Item Information';
