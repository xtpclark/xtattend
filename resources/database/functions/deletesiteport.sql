CREATE OR REPLACE FUNCTION cgms.deleteSitePort(INTEGER) RETURNS INTEGER AS $$
DECLARE
  pSiteportid ALIAS FOR $1;

BEGIN

  DELETE FROM cgms.siteport WHERE siteport_id=pSiteportid;

  RETURN pSiteportid;
END;
$$ LANGUAGE 'plpgsql';

