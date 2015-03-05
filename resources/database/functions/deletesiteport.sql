CREATE OR REPLACE FUNCTION xtattend.deleteSitePort(INTEGER) RETURNS INTEGER AS $$
DECLARE
  pSiteportid ALIAS FOR $1;

BEGIN

  DELETE FROM xtattend.siteport WHERE siteport_id=pSiteportid;

  RETURN pSiteportid;
END;
$$ LANGUAGE 'plpgsql';

