--Add clinic department to DB
ALTER TABLE reports ADD COLUMN pp_misc_mfd_1_kuerzel character varying,
                    ADD COLUMN pp_misc_mfd_1_bezeichnung character varying(255);
