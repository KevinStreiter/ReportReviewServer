CREATE USER review;
CREATE DATABASE review;
GRANT ALL PRIVILEGES ON DATABASE review TO review;
ALTER ROLE review WITH PASSWORD 'review';

CREATE TABLE reports (
    unters_schluessel bigint NOT NULL,
    unters_art character varying(64),
    schreiber character varying(64),
    patient_schluessel bigint NOT NULL,
    freigeber character varying(64),
    befund_status character varying(64),
    befund_schluessel bigint NOT NULL,
    befund_freigabe timestamp without time zone,
    befund_s text,
    befund_g text,
    befund_f text,
    lese_datum timestamp without time zone,
    gegenlese_datum timestamp without time zone,
    gegenleser character varying,
    leser character varying,
    signierer character varying,
    befund_l text,
    unters_beginn timestamp without time zone,
    untart_name character varying,
    pat_name character varying(255),
    pat_vorname character varying(255)
);

ALTER TABLE reports OWNER TO review;
