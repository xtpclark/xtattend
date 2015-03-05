CREATE OR REPLACE FUNCTION xtattend.deleteContract(INTEGER) RETURNS INTEGER AS $$
DECLARE
  pContractid ALIAS FOR $1;

BEGIN

  DELETE FROM xtattend.contractitem WHERE contractitem_contract_id=pContractid;
  DELETE FROM xtattend.contract WHERE contract_id=pContractid;

  RETURN pContractid;
END;
$$ LANGUAGE 'plpgsql';

