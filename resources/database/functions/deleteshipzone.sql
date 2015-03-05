CREATE OR REPLACE FUNCTION xtattend.deleteShipzone(INTEGER) RETURNS INTEGER AS $$
DECLARE
  pShipzoneid ALIAS FOR $1;

BEGIN

  IF (EXISTS(SELECT port_id
             FROM xtattend.port
             WHERE (port_shipzone_id=pShipzoneid)
             LIMIT 1)) THEN
    RETURN -1;
  END IF;

  DELETE FROM shipzone WHERE shipzone_id=pShipzoneid;

  RETURN pShipzoneid;
END;
$$ LANGUAGE 'plpgsql';

