SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;


SET search_path = xtattend, pg_catalog;


CREATE FUNCTION update_changetimestamp_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.changetimestamp = now(); 
   RETURN NEW;
END;
$$;


ALTER FUNCTION xtattend.update_changetimestamp_column() OWNER TO admin;

SET default_tablespace = '';

SET default_with_oids = false;


CREATE TABLE attally (
    attally_id integer NOT NULL,
    attally_attmember_id integer,
    attally_attsess_id integer,
    attally_attstat_id integer,
    attally_recorded timestamp with time zone NOT NULL
);


ALTER TABLE xtattend.attally OWNER TO admin;


CREATE SEQUENCE attally_attally_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE xtattend.attally_attally_id_seq OWNER TO admin;

ALTER SEQUENCE attally_attally_id_seq OWNED BY attally.attally_id;

CREATE TABLE attcalendar (
    date date,
    year double precision,
    month double precision,
    monthname text,
    day double precision,
    dayofyear double precision,
    weekdayname text,
    dayofweek double precision,
    calendarweek double precision,
    formatteddate text,
    quartal text,
    yearquartal text,
    yearmonth text,
    yearcalendarweek text,
    weekend text,
    americanholiday text,
    period text,
    cwstart date,
    cwend date,
    monthstart date,
    monthend timestamp without time zone
);


ALTER TABLE xtattend.attcalendar OWNER TO admin;


CREATE TABLE attgrp (
    attgrp_id integer NOT NULL,
    attgrp_prj_id integer,
    attgrp_name text,
    attgrp_descrip text
);


ALTER TABLE xtattend.attgrp OWNER TO admin;


CREATE SEQUENCE attgrp_attgrp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE xtattend.attgrp_attgrp_id_seq OWNER TO admin;


ALTER SEQUENCE attgrp_attgrp_id_seq OWNED BY attgrp.attgrp_id;


CREATE TABLE attmember (
    attmember_id integer NOT NULL,
    attmember_attgrp_id integer,
    attmember_cntct_id integer
);


ALTER TABLE xtattend.attmember OWNER TO admin;

CREATE SEQUENCE attmember_attmember_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE xtattend.attmember_attmember_id_seq OWNER TO admin;

ALTER SEQUENCE attmember_attmember_id_seq OWNED BY attmember.attmember_id;


CREATE TABLE attsess (
    attsess_id integer NOT NULL,
    attsess_attgrp_id integer,
    attsess_startdate timestamp without time zone NOT NULL,
    attsess_stopdate timestamp without time zone NOT NULL,
    attsess_name text,
    attsess_descrip text,
    attsess_note text
);


ALTER TABLE xtattend.attsess OWNER TO admin;


CREATE SEQUENCE attsess_attsess_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE xtattend.attsess_attsess_id_seq OWNER TO admin;


ALTER SEQUENCE attsess_attsess_id_seq OWNED BY attsess.attsess_id;

CREATE TABLE attstat (
    attstat_id integer NOT NULL,
    attstat_code text,
    attstat_descrip text
);


ALTER TABLE xtattend.attstat OWNER TO admin;


CREATE SEQUENCE attstat_attstat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE xtattend.attstat_attstat_id_seq OWNER TO admin;

ALTER SEQUENCE attstat_attstat_id_seq OWNED BY attstat.attstat_id;

CREATE TABLE atttime (
    timeofday text,
    hour double precision,
    quarterhour text,
    minute double precision,
    daytimename text,
    daynight text
);


ALTER TABLE xtattend.atttime OWNER TO admin;

ALTER TABLE ONLY attally ALTER COLUMN attally_id SET DEFAULT nextval('attally_attally_id_seq'::regclass);

ALTER TABLE ONLY attgrp ALTER COLUMN attgrp_id SET DEFAULT nextval('attgrp_attgrp_id_seq'::regclass);

ALTER TABLE ONLY attmember ALTER COLUMN attmember_id SET DEFAULT nextval('attmember_attmember_id_seq'::regclass);

ALTER TABLE ONLY attsess ALTER COLUMN attsess_id SET DEFAULT nextval('attsess_attsess_id_seq'::regclass);

ALTER TABLE ONLY attstat ALTER COLUMN attstat_id SET DEFAULT nextval('attstat_attstat_id_seq'::regclass);

ALTER TABLE ONLY attally
    ADD CONSTRAINT attally_attsess_attstat_attmember_key UNIQUE (attally_attmember_id, attally_attsess_id, attally_attstat_id);

ALTER TABLE ONLY attally
    ADD CONSTRAINT attally_pkey PRIMARY KEY (attally_id);

ALTER TABLE ONLY attgrp
    ADD CONSTRAINT attgrp_attgrp_name_key UNIQUE (attgrp_name);


ALTER TABLE ONLY attgrp
    ADD CONSTRAINT attgrp_pkey PRIMARY KEY (attgrp_id);


ALTER TABLE ONLY attmember
    ADD CONSTRAINT attmember_attgrp_cntct_id_key UNIQUE (attmember_attgrp_id, attmember_cntct_id);


ALTER TABLE ONLY attmember
    ADD CONSTRAINT attmember_pkey PRIMARY KEY (attmember_id);


ALTER TABLE ONLY attsess
    ADD CONSTRAINT attsess_grp_date_name_key UNIQUE (attsess_attgrp_id, attsess_name, attsess_startdate, attsess_stopdate);


ALTER TABLE ONLY attsess
    ADD CONSTRAINT attsess_pkey PRIMARY KEY (attsess_id);


ALTER TABLE ONLY attstat
    ADD CONSTRAINT attstat_attstat_status_key UNIQUE (attstat_code);


ALTER TABLE ONLY attstat
    ADD CONSTRAINT attstat_pkey PRIMARY KEY (attstat_id);


REVOKE ALL ON SCHEMA xtattend FROM PUBLIC;
REVOKE ALL ON SCHEMA xtattend FROM admin;
GRANT ALL ON SCHEMA xtattend TO admin;
GRANT ALL ON SCHEMA xtattend TO PUBLIC;
