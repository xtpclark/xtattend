CREATE OR REPLACE FUNCTION xtattend.deletePort(INTEGER) RETURNS INTEGER AS $$
DECLARE
  pPortid ALIAS FOR $1;

BEGIN

  IF (EXISTS(SELECT contractitem_port_id
             FROM xtattend.contractitem
             WHERE (contractitem_port_id=pPortid)
             LIMIT 1)) THEN
    RETURN -1;
  END IF;

  IF (EXISTS(SELECT soport_port_id
             FROM xtattend.soport
             WHERE (soport_port_id=pPortid)
             LIMIT 1)) THEN
    RETURN -2;
  END IF;

  IF (EXISTS(SELECT poport_port_id
             FROM xtattend.poport
             WHERE (poport_port_id=pPortid)
             LIMIT 1)) THEN
    RETURN -3;
  END IF;

  DELETE FROM xtattend.terminal WHERE terminal_port_id=pPortid;
  DELETE FROM xtattend.port WHERE port_id=pPortid;

  RETURN pPortid;
END;
$$ LANGUAGE 'plpgsql';

