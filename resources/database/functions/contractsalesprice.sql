CREATE OR REPLACE FUNCTION xtattend.contractSalesPrice(INTEGER, INTEGER, INTEGER, INTEGER, NUMERIC) RETURNS NUMERIC AS $$
DECLARE
  pItemid ALIAS FOR $1;
  pWarehousid ALIAS FOR $2;
  pCustid ALIAS FOR $3;
  pPortid ALIAS FOR $4;
  pQty ALIAS FOR $5;

  _r RECORD;
  _result NUMERIC := 0.0;

BEGIN

--  raise exception 'item-%, warehouse=%, cust=%, port=%', pItemid, pWarehousid, pCustid, pPortid;

  SELECT * INTO _r
  FROM xtattend.contract
       JOIN xtattend.contractitem ON (contractitem_contract_id=contract_id)
  WHERE (contract_target_type='C')
    AND (contract_target_id=pCustid)
    AND (contractitem_item_id=pItemid)
    AND (contractitem_port_id=pPortid)
    AND (CURRENT_DATE BETWEEN contract_effective AND contract_expires);

  IF (NOT FOUND) THEN
    RETURN _result;
  END IF;

  IF (_r.contractitem_pricing_type='M') THEN
    SELECT SUM(mktcost_cost * (1 + _r.contractitem_pctmarkup)) INTO _result
    FROM xtattend.mktcost
    WHERE (mktcost_item_id=_r.contractitem_item_id AND mktcost_costelem_id=_r.contractitem_costelem_id);
  ELSEIF (_r.contractitem_pricing_type='P') THEN
    SELECT (ipsitem_price - (ipsitem_price * _r.contractitem_pctmarkup)) INTO _result
    FROM ipsitem
    WHERE (ipsitem_item_id=_r.contractitem_item_id AND ipsitem_qtybreak < pQty)
    ORDER BY ipsitem_qtybreak DESC
    LIMIT 1;
  ELSE
    _result := _r.contractitem_pctmarkup;
  END IF;

  RETURN _result;
END;
$$ LANGUAGE 'plpgsql';

