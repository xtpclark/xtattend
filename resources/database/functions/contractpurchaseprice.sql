CREATE OR REPLACE FUNCTION cgms.contractPurchasePrice(INTEGER, INTEGER, INTEGER, INTEGER) RETURNS NUMERIC AS $$
DECLARE
  pItemid ALIAS FOR $1;
  pWarehousid ALIAS FOR $2;
  pVendid ALIAS FOR $3;
  pPortid ALIAS FOR $4;

  _r RECORD;
  _result NUMERIC := 0.0;

BEGIN

--  raise exception 'item-%, warehouse=%, vend=%, port=%', pItemid, pWarehousid, pVendid, pPortid;

  SELECT * INTO _r
  FROM cgms.contract
       JOIN cgms.contractitem ON (contractitem_contract_id=contract_id)
  WHERE (contract_target_type='V')
    AND (contract_target_id=pVendid)
    AND (contractitem_item_id=pItemid)
    AND (contractitem_port_id=pPortid)
    AND (CURRENT_DATE BETWEEN contract_effective AND contract_expires);

  IF (NOT FOUND) THEN
    RETURN _result;
  END IF;

  IF (_r.contractitem_pricing_type='M') THEN
    SELECT SUM(mktcost_cost * (1 + _r.contractitem_pctmarkup)) INTO _result
    FROM cgms.mktcost
    WHERE (mktcost_item_id=_r.contractitem_item_id AND mktcost_costelem_id=_r.contractitem_costelem_id);
  ELSE
    _result := _r.contractitem_pctmarkup;
  END IF;

  RETURN _result;
END;
$$ LANGUAGE 'plpgsql';

