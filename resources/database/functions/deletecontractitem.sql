CREATE OR REPLACE FUNCTION xtattend.deleteContractItem(INTEGER) RETURNS INTEGER AS $$
DECLARE
  pContractitemid ALIAS FOR $1;

BEGIN

  DELETE FROM xtattend.contractitem WHERE contractitem_id=pContractitemid;

  RETURN pContractitemid;
END;
$$ LANGUAGE 'plpgsql';

