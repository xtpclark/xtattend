CREATE OR REPLACE FUNCTION xtattend.deleteTerminal(INTEGER) RETURNS INTEGER AS $$
DECLARE
  pTerminalid ALIAS FOR $1;

BEGIN

  IF (EXISTS(SELECT soport_terminal_id
             FROM xtattend.soport
             WHERE (soport_terminal_id=pTerminalid)
             LIMIT 1)) THEN
    RETURN -2;
  END IF;

  IF (EXISTS(SELECT poport_terminal_id
             FROM xtattend.poport
             WHERE (poport_terminal_id=pTerminalid)
             LIMIT 1)) THEN
    RETURN -3;
  END IF;

  DELETE FROM xtattend.terminal WHERE terminal_id=pTerminalid;

  RETURN pTerminalid;
END;
$$ LANGUAGE 'plpgsql';

