CREATE TABLE cgms.mktcost
(mktcost_id SERIAL NOT NULL,
 mktcost_item_id INTEGER NOT NULL,
 mktcost_costelem_id INTEGER NOT NULL,
 mktcost_cost NUMERIC(16,6) NOT NULL DEFAULT 0,
 mktcost_updated DATE DEFAULT CURRENT_DATE,
 CONSTRAINT mktcost_pkey PRIMARY KEY (mktcost_id),
 CONSTRAINT mktcost_mktcost_item_id_fkey FOREIGN KEY (mktcost_item_id)
   REFERENCES item (item_id) MATCH SIMPLE
   ON UPDATE NO ACTION ON DELETE NO ACTION,
 CONSTRAINT mktcost_mktcost_costelem_id_fkey FOREIGN KEY (mktcost_costelem_id)
   REFERENCES costelem (costelem_id) MATCH SIMPLE
   ON UPDATE NO ACTION ON DELETE NO ACTION
);

ALTER TABLE cgms.mktcost OWNER TO "admin";
GRANT ALL ON TABLE cgms.mktcost TO "admin";
GRANT ALL ON TABLE cgms.mktcost TO xtrole;
GRANT ALL ON SEQUENCE cgms.mktcost_mktcost_id_seq TO xtrole;

COMMENT ON TABLE cgms.mktcost IS 'Market Cost Information';
