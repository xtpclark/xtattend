CREATE OR REPLACE FUNCTION cgms.deleteMktCost(INTEGER) RETURNS INTEGER AS $$
DECLARE
  pMktcostid ALIAS FOR $1;

BEGIN

  DELETE FROM cgms.mktcost WHERE mktcost_id=pMktcostid;

  RETURN pMktcostid;
END;
$$ LANGUAGE 'plpgsql';

