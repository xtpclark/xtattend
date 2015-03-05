CREATE OR REPLACE FUNCTION cgms.deleteContractItem(INTEGER) RETURNS INTEGER AS $$
DECLARE
  pContractitemid ALIAS FOR $1;

BEGIN

  DELETE FROM cgms.contractitem WHERE contractitem_id=pContractitemid;

  RETURN pContractitemid;
END;
$$ LANGUAGE 'plpgsql';

