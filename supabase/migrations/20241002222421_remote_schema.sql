

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" integer NOT NULL,
    "content" character varying(1000) NOT NULL,
    "user_id" integer,
    "medication_id" integer,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."comments" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."comments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."comments_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."comments_id_seq" OWNED BY "public"."comments"."id";



CREATE TABLE IF NOT EXISTS "public"."knex_migrations" (
    "id" integer NOT NULL,
    "name" character varying(255),
    "batch" integer,
    "migration_time" timestamp with time zone
);


ALTER TABLE "public"."knex_migrations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."knex_migrations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."knex_migrations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."knex_migrations_id_seq" OWNED BY "public"."knex_migrations"."id";



CREATE TABLE IF NOT EXISTS "public"."knex_migrations_lock" (
    "index" integer NOT NULL,
    "is_locked" integer
);


ALTER TABLE "public"."knex_migrations_lock" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."knex_migrations_lock_index_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."knex_migrations_lock_index_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."knex_migrations_lock_index_seq" OWNED BY "public"."knex_migrations_lock"."index";



CREATE TABLE IF NOT EXISTS "public"."medications" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "active_ingredient" character varying(255) NOT NULL,
    "indications" character varying(255) NOT NULL,
    "side_effects" character varying(255) NOT NULL,
    "food_interactions" character varying(255) DEFAULT 'none'::character varying,
    "contra_indications" character varying(255) DEFAULT 'none'::character varying NOT NULL
);


ALTER TABLE "public"."medications" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."medications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."medications_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."medications_id_seq" OWNED BY "public"."medications"."id";



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" integer NOT NULL,
    "full_name" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "age" integer DEFAULT 0 NOT NULL,
    "gender" character varying(255) DEFAULT 'other'::character varying NOT NULL,
    "password" character varying(255) NOT NULL,
    "preexisting_conditions" character varying(255) DEFAULT 'none'::character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "last_login" character varying(255) DEFAULT ''::character varying
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."users_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."users_id_seq" OWNED BY "public"."users"."id";



CREATE TABLE IF NOT EXISTS "public"."users_medications" (
    "id" integer NOT NULL,
    "medication_id" integer,
    "user_id" integer
);


ALTER TABLE "public"."users_medications" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."users_medications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."users_medications_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."users_medications_id_seq" OWNED BY "public"."users_medications"."id";



ALTER TABLE ONLY "public"."comments" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."comments_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."knex_migrations" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."knex_migrations_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."knex_migrations_lock" ALTER COLUMN "index" SET DEFAULT "nextval"('"public"."knex_migrations_lock_index_seq"'::"regclass");



ALTER TABLE ONLY "public"."medications" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."medications_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."users" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."users_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."users_medications" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."users_medications_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."knex_migrations_lock"
    ADD CONSTRAINT "knex_migrations_lock_pkey" PRIMARY KEY ("index");



ALTER TABLE ONLY "public"."knex_migrations"
    ADD CONSTRAINT "knex_migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."medications"
    ADD CONSTRAINT "medications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users_medications"
    ADD CONSTRAINT "users_medications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_medication_id_foreign" FOREIGN KEY ("medication_id") REFERENCES "public"."medications"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_medications"
    ADD CONSTRAINT "users_medications_medication_id_foreign" FOREIGN KEY ("medication_id") REFERENCES "public"."medications"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_medications"
    ADD CONSTRAINT "users_medications_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


















































































































































































































GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."knex_migrations" TO "anon";
GRANT ALL ON TABLE "public"."knex_migrations" TO "authenticated";
GRANT ALL ON TABLE "public"."knex_migrations" TO "service_role";



GRANT ALL ON SEQUENCE "public"."knex_migrations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."knex_migrations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."knex_migrations_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."knex_migrations_lock" TO "anon";
GRANT ALL ON TABLE "public"."knex_migrations_lock" TO "authenticated";
GRANT ALL ON TABLE "public"."knex_migrations_lock" TO "service_role";



GRANT ALL ON SEQUENCE "public"."knex_migrations_lock_index_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."knex_migrations_lock_index_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."knex_migrations_lock_index_seq" TO "service_role";



GRANT ALL ON TABLE "public"."medications" TO "anon";
GRANT ALL ON TABLE "public"."medications" TO "authenticated";
GRANT ALL ON TABLE "public"."medications" TO "service_role";



GRANT ALL ON SEQUENCE "public"."medications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."medications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."medications_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users_medications" TO "anon";
GRANT ALL ON TABLE "public"."users_medications" TO "authenticated";
GRANT ALL ON TABLE "public"."users_medications" TO "service_role";



GRANT ALL ON SEQUENCE "public"."users_medications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_medications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_medications_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
