SELECT to_char(minute, 'hh24:mi') AS TimeOfDay,
	-- Hour of the day (0 - 23)
	extract(hour FROM minute) AS Hour, 
	-- Extract and format quarter hours
	to_char(minute - (extract(minute FROM minute)::integer % 15 || 'minutes')::interval, 'hh24:mi') ||
	' – ' ||
	to_char(minute - (extract(minute FROM minute)::integer % 15 || 'minutes')::interval + '14 minutes'::interval, 'hh24:mi')
		AS QuarterHour,
	-- Minute of the day (0 - 1439)
	extract(hour FROM minute)*60 + extract(minute FROM minute) AS minute,
	-- Names of day periods
	case when to_char(minute, 'hh24:mi') BETWEEN '06:00' AND '08:29'
		then 'Morning'
	     when to_char(minute, 'hh24:mi') BETWEEN '08:30' AND '11:59'
		then 'AM'
	     when to_char(minute, 'hh24:mi') BETWEEN '12:00' AND '17:59'
		then 'PM'
	     when to_char(minute, 'hh24:mi') BETWEEN '18:00' AND '22:29'
		then 'Evening'
	     else 'Night'
	end AS DaytimeName,
	-- Indicator of day or night
	case when to_char(minute, 'hh24:mi') BETWEEN '07:00' AND '19:59' then 'Day'
	     else 'Night'
	end AS DayNight
INTO xtattend.atttime
FROM (SELECT '0:00'::time + (sequence.minute || ' minutes')::interval AS minute
	FROM generate_series(0,1439) AS sequence(minute)
	GROUP BY sequence.minute
     ) DQ
ORDER BY 1;
