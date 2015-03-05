CREATE OR REPLACE FUNCTION cgms.deleteContract(INTEGER) RETURNS INTEGER AS $$
DECLARE
  pContractid ALIAS FOR $1;

BEGIN

  DELETE FROM cgms.contractitem WHERE contractitem_contract_id=pContractid;
  DELETE FROM cgms.contract WHERE contract_id=pContractid;

  RETURN pContractid;
END;
$$ LANGUAGE 'plpgsql';

