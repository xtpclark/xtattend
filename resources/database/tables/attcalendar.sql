SELECT
	datum AS Date,
	extract(year FROM datum) AS Year,
	extract(month FROM datum) AS Month,
	-- Localized month name
	to_char(datum, 'TMMonth') AS MonthName,
	extract(day FROM datum) AS Day,
	extract(doy FROM datum) AS DayOfYear,
	-- Localized weekday
	to_char(datum, 'TMDay') AS WeekdayName,
	extract(isodow FROM datum) AS dayofweek,
	-- ISO calendar week
	extract(week FROM datum) AS CalendarWeek,
	to_char(datum, 'dd. mm. yyyy') AS FormattedDate,
	'Q' || to_char(datum, 'Q') AS Quartal,
	to_char(datum, 'yyyy/"Q"Q') AS YearQuartal,
	to_char(datum, 'yyyy/mm') AS YearMonth,
	-- ISO calendar year and week
	to_char(datum, 'iyyy/IW') AS YearCalendarWeek,
	-- Weekend
	CASE WHEN extract(isodow FROM datum) IN (6, 7) THEN 'Weekend' ELSE 'Weekday' END AS Weekend,
	-- Fixed holidays 
        -- for America
        CASE WHEN to_char(datum, 'MMDD') IN ('0101', '0704', '1225', '1226')
		THEN 'Holiday' ELSE 'No holiday' END
		AS AmericanHoliday,
	CASE WHEN to_char(datum, 'MMDD') BETWEEN '0701' AND '0831' THEN 'Summer break'
	     WHEN to_char(datum, 'MMDD') BETWEEN '1115' AND '1225' THEN 'Christmas season'
	     WHEN to_char(datum, 'MMDD') > '1225' OR to_char(datum, 'MMDD') <= '0106' THEN 'Winter break'
		ELSE 'Normal' END
		AS Period,
	-- ISO start and end of the week of this date
	datum + (1 - extract(isodow FROM datum))::integer AS CWStart,
	datum + (7 - extract(isodow FROM datum))::integer AS CWEnd,
	-- Start and end of the month of this date
	datum + (1 - extract(day FROM datum))::integer AS MonthStart,
	(datum + (1 - extract(day FROM datum))::integer + '1 month'::interval)::date - '1 day'::interval AS MonthEnd
INTO xtattend.attcalendar
FROM (
	-- There are 3 leap years in this range, so calculate 365 * 10 + 3 records
	SELECT '2014-01-01'::DATE + sequence.day AS datum
	FROM generate_series(0,3652) AS sequence(day)
	GROUP BY sequence.day
     ) DQ
ORDER BY 1;
