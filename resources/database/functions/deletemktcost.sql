CREATE OR REPLACE FUNCTION xtattend.deleteMktCost(INTEGER) RETURNS INTEGER AS $$
DECLARE
  pMktcostid ALIAS FOR $1;

BEGIN

  DELETE FROM xtattend.mktcost WHERE mktcost_id=pMktcostid;

  RETURN pMktcostid;
END;
$$ LANGUAGE 'plpgsql';

