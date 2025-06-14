--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (PGlite 0.2.0)
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = off;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET escape_string_warning = off;
SET row_security = off;

--
-- Name: meta; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA meta;


ALTER SCHEMA meta OWNER TO postgres;

--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: embeddings; Type: TABLE; Schema: meta; Owner: postgres
--

CREATE TABLE meta.embeddings (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    content text NOT NULL,
    embedding public.vector(384) NOT NULL
);


ALTER TABLE meta.embeddings OWNER TO postgres;

--
-- Name: embeddings_id_seq; Type: SEQUENCE; Schema: meta; Owner: postgres
--

ALTER TABLE meta.embeddings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME meta.embeddings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: migrations; Type: TABLE; Schema: meta; Owner: postgres
--

CREATE TABLE meta.migrations (
    version text NOT NULL,
    name text,
    applied_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE meta.migrations OWNER TO postgres;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id bigint NOT NULL,
    user_id bigint,
    appointment_date timestamp with time zone NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.appointments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.appointments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: html_content; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.html_content (
    id bigint NOT NULL,
    content text
);


ALTER TABLE public.html_content OWNER TO postgres;

--
-- Name: html_content_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.html_content ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.html_content_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: login_attempts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_attempts (
    id bigint NOT NULL,
    user_id bigint,
    attempt_time timestamp with time zone DEFAULT now(),
    success boolean NOT NULL
);


ALTER TABLE public.login_attempts OWNER TO postgres;

--
-- Name: login_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.login_attempts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.login_attempts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: signups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.signups (
    id bigint NOT NULL,
    user_id bigint,
    signup_time timestamp with time zone DEFAULT now()
);


ALTER TABLE public.signups OWNER TO postgres;

--
-- Name: signups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.signups ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.signups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: embeddings; Type: TABLE DATA; Schema: meta; Owner: postgres
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: meta; Owner: postgres
--

INSERT INTO meta.migrations VALUES ('202407160001', 'embeddings', '2025-06-14 10:24:14.044+00');


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: html_content; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1, '<!DOCTYPE html>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (2, '<html lang="en">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (3, '<head>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (4, '    <meta charset="UTF-8">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (5, '    <meta name="viewport" content="width=device-width, initial-scale=1.0">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (6, '    <title>Turnaround Experts - Transform Your Startup</title>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (7, '    <style>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (8, '        * {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (9, '            margin: 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (10, '            padding: 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (11, '            box-sizing: border-box;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (12, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (13, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (14, '        body {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (15, '            font-family: ''Arial'', sans-serif;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (16, '            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (17, '            color: #ffffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (18, '            overflow-x: hidden;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (19, '            line-height: 1.6;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (20, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (21, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (22, '        .container {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (23, '            max-width: 1200px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (24, '            margin: 0 auto;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (25, '            padding: 0 20px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (26, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (27, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (28, '        /* Header */');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (29, '        header {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (30, '            position: fixed;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (31, '            top: 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (32, '            width: 100%;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (33, '            background: rgba(10, 10, 10, 0.95);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (34, '            backdrop-filter: blur(10px);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (35, '            z-index: 1000;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (36, '            padding: 1rem 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (37, '            border-bottom: 1px solid rgba(0, 255, 255, 0.2);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (38, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (39, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (40, '        nav {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (41, '            display: flex;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (42, '            justify-content: space-between;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (43, '            align-items: center;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (44, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (45, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (46, '        .logo {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (47, '            font-size: 1.8rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (48, '            font-weight: bold;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (49, '            background: linear-gradient(45deg, #00ffff, #ff00ff);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (50, '            -webkit-background-clip: text;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (51, '            -webkit-text-fill-color: transparent;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (52, '            background-clip: text;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (53, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (54, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (55, '        .nav-links {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (56, '            display: flex;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (57, '            list-style: none;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (58, '            gap: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (59, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (60, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (61, '        .nav-links a {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (62, '            color: #ffffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (63, '            text-decoration: none;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (64, '            transition: all 0.3s ease;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (65, '            position: relative;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (66, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (67, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (68, '        .nav-links a:hover {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (69, '            color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (70, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (71, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (72, '        .nav-links a::after {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (73, '            content: '''';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (74, '            position: absolute;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (75, '            bottom: -5px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (76, '            left: 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (77, '            width: 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (78, '            height: 2px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (79, '            background: linear-gradient(45deg, #00ffff, #ff00ff);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (80, '            transition: width 0.3s ease;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (81, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (82, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (83, '        .nav-links a:hover::after {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (84, '            width: 100%;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (85, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (86, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (87, '        .auth-buttons {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (88, '            display: flex;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (89, '            gap: 1rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (90, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (91, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (92, '        .btn {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (93, '            padding: 0.6rem 1.5rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (94, '            border: none;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (95, '            border-radius: 25px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (96, '            cursor: pointer;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (97, '            font-weight: bold;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (98, '            transition: all 0.3s ease;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (99, '            text-decoration: none;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (100, '            display: inline-block;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (101, '            text-align: center;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (102, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (103, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (104, '        .btn-primary {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (105, '            background: linear-gradient(45deg, #00ffff, #0080ff);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (106, '            color: #000;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (107, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (108, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (109, '        .btn-secondary {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (110, '            background: transparent;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (111, '            border: 2px solid #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (112, '            color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (113, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (114, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (115, '        .btn:hover {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (116, '            transform: translateY(-2px);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (117, '            box-shadow: 0 10px 20px rgba(0, 255, 255, 0.3);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (118, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (119, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (120, '        /* Hero Section */');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (121, '        .hero {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (122, '            height: 100vh;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (123, '            display: flex;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (124, '            align-items: center;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (125, '            position: relative;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (126, '            overflow: hidden;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (127, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (128, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (129, '        .hero-bg {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (130, '            position: absolute;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (131, '            top: 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (132, '            left: 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (133, '            width: 100%;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (134, '            height: 100%;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (135, '            background: radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 70%);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (136, '            animation: pulse 4s ease-in-out infinite;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (137, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (138, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (139, '        @keyframes pulse {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (140, '            0%, 100% { opacity: 0.5; }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (141, '            50% { opacity: 1; }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (142, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (143, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (144, '        .hero-content {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (145, '            position: relative;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (146, '            z-index: 2;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (147, '            text-align: center;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (148, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (149, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (150, '        .hero h1 {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (151, '            font-size: 4rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (152, '            margin-bottom: 1rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (153, '            background: linear-gradient(45deg, #00ffff, #ff00ff, #ffff00);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (154, '            -webkit-background-clip: text;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (155, '            -webkit-text-fill-color: transparent;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (156, '            background-clip: text;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (157, '            animation: glow 2s ease-in-out infinite alternate;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (158, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (159, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (160, '        @keyframes glow {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (161, '            from { filter: brightness(1); }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (162, '            to { filter: brightness(1.2); }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (163, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (164, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (165, '        .hero p {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (166, '            font-size: 1.3rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (167, '            margin-bottom: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (168, '            opacity: 0.9;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (169, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (170, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (171, '        /* Sections */');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (172, '        .section {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (173, '            padding: 5rem 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (174, '            position: relative;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (175, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (176, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (177, '        .section-title {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (178, '            text-align: center;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (179, '            font-size: 2.5rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (180, '            margin-bottom: 3rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (181, '            background: linear-gradient(45deg, #00ffff, #ff00ff);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (182, '            -webkit-background-clip: text;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (183, '            -webkit-text-fill-color: transparent;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (184, '            background-clip: text;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (185, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (186, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (187, '        /* About Section */');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (188, '        .about-grid {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (189, '            display: grid;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (190, '            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (191, '            gap: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (192, '            margin-top: 3rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (193, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (194, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (195, '        .about-card {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (196, '            background: rgba(255, 255, 255, 0.05);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (197, '            border: 1px solid rgba(0, 255, 255, 0.2);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (198, '            border-radius: 15px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (199, '            padding: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (200, '            backdrop-filter: blur(10px);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (201, '            transition: all 0.3s ease;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (202, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (203, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (204, '        .about-card:hover {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (205, '            transform: translateY(-10px);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (206, '            border-color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (207, '            box-shadow: 0 20px 40px rgba(0, 255, 255, 0.2);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (208, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (209, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (210, '        .about-card h3 {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (211, '            color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (212, '            margin-bottom: 1rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (213, '            font-size: 1.3rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (214, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (215, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (216, '        /* Services Section */');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (217, '        .services-grid {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (218, '            display: grid;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (219, '            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (220, '            gap: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (221, '            margin-top: 3rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (222, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (223, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (224, '        .service-item {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (225, '            text-align: center;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (226, '            padding: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (227, '            background: rgba(255, 255, 255, 0.05);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (228, '            border-radius: 15px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (229, '            border: 1px solid rgba(0, 255, 255, 0.2);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (230, '            transition: all 0.3s ease;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (231, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (232, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (233, '        .service-item:hover {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (234, '            transform: scale(1.05);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (235, '            border-color: #ff00ff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (236, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (237, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (238, '        .service-icon {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (239, '            font-size: 3rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (240, '            margin-bottom: 1rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (241, '            color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (242, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (243, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (244, '        /* Pricing Section */');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (245, '        .pricing-grid {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (246, '            display: grid;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (247, '            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (248, '            gap: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (249, '            margin-top: 3rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (250, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (251, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (252, '        .pricing-card {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (253, '            background: rgba(255, 255, 255, 0.05);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (254, '            border: 2px solid rgba(0, 255, 255, 0.2);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (255, '            border-radius: 20px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (256, '            padding: 2.5rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (257, '            text-align: center;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (258, '            position: relative;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (259, '            transition: all 0.3s ease;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (260, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (261, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (262, '        .pricing-card.featured {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (263, '            border-color: #ff00ff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (264, '            transform: scale(1.05);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (265, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (266, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (267, '        .pricing-card:hover {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (268, '            transform: translateY(-10px) scale(1.02);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (269, '            border-color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (270, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (271, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (272, '        .plan-name {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (273, '            font-size: 1.5rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (274, '            color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (275, '            margin-bottom: 1rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (276, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (277, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (278, '        .plan-price {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (279, '            font-size: 2.5rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (280, '            font-weight: bold;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (281, '            color: #ff00ff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (282, '            margin-bottom: 1rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (283, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (284, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (285, '        .plan-duration {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (286, '            color: #ffffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (287, '            opacity: 0.8;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (288, '            margin-bottom: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (289, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (290, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (291, '        .plan-features {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (292, '            list-style: none;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (293, '            margin-bottom: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (294, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (295, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (296, '        .plan-features li {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (297, '            padding: 0.5rem 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (298, '            border-bottom: 1px solid rgba(255, 255, 255, 0.1);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (299, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (300, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (301, '        .plan-features li:before {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (302, '            content: ''✓'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (303, '            color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (304, '            font-weight: bold;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (305, '            margin-right: 0.5rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (306, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (307, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (308, '        /* Forms */');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (309, '        .form-container {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (310, '            max-width: 500px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (311, '            margin: 0 auto;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (312, '            background: rgba(255, 255, 255, 0.05);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (313, '            border: 1px solid rgba(0, 255, 255, 0.2);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (314, '            border-radius: 20px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (315, '            padding: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (316, '            backdrop-filter: blur(10px);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (317, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (318, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (319, '        .form-group {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (320, '            margin-bottom: 1.5rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (321, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (322, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (323, '        .form-group label {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (324, '            display: block;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (325, '            margin-bottom: 0.5rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (326, '            color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (327, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (328, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (329, '        .form-group input,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (330, '        .form-group select,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (331, '        .form-group textarea {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (332, '            width: 100%;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (333, '            padding: 0.8rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (334, '            border: 1px solid rgba(0, 255, 255, 0.3);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (335, '            border-radius: 10px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (336, '            background: rgba(255, 255, 255, 0.1);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (337, '            color: #ffffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (338, '            font-size: 1rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (339, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (340, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (341, '        .form-group input:focus,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (342, '        .form-group select:focus,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (343, '        .form-group textarea:focus {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (344, '            outline: none;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (345, '            border-color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (346, '            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (347, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (348, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (349, '        /* Footer */');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (350, '        footer {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (351, '            background: rgba(0, 0, 0, 0.8);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (352, '            padding: 3rem 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (353, '            text-align: center;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (354, '            border-top: 1px solid rgba(0, 255, 255, 0.2);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (355, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (356, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (357, '        .footer-content {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (358, '            display: grid;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (359, '            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (360, '            gap: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (361, '            margin-bottom: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (362, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (363, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (364, '        .footer-section h3 {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (365, '            color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (366, '            margin-bottom: 1rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (367, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (368, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (369, '        .footer-section p,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (370, '        .footer-section a {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (371, '            color: #ffffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (372, '            opacity: 0.8;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (373, '            text-decoration: none;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (374, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (375, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (376, '        .footer-section a:hover {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (377, '            color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (378, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (379, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (380, '        /* Modal */');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (381, '        .modal {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (382, '            display: none;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (383, '            position: fixed;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (384, '            top: 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (385, '            left: 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (386, '            width: 100%;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (387, '            height: 100%;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (388, '            background: rgba(0, 0, 0, 0.8);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (389, '            z-index: 2000;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (390, '            justify-content: center;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (391, '            align-items: center;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (392, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (393, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (394, '        .modal-content {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (395, '            background: linear-gradient(135deg, #1a1a2e 0%, #2a2a4e 100%);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (396, '            border: 2px solid #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (397, '            border-radius: 20px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (398, '            padding: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (399, '            max-width: 500px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (400, '            width: 90%;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (401, '            position: relative;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (402, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (403, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (404, '        .close {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (405, '            position: absolute;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (406, '            top: 1rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (407, '            right: 1.5rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (408, '            font-size: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (409, '            color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (410, '            cursor: pointer;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (411, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (412, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (413, '        .close:hover {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (414, '            color: #ff00ff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (415, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (416, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (417, '        /* Hidden sections */');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (418, '        .hidden {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (419, '            display: none;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (420, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (421, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (422, '        /* Responsive */');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (423, '        @media (max-width: 768px) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (424, '            .nav-links {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (425, '                display: none;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (426, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (427, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (428, '            .hero h1 {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (429, '                font-size: 2.5rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (430, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (431, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (432, '            .hero p {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (433, '                font-size: 1.1rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (434, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (435, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (436, '            .pricing-card.featured {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (437, '                transform: none;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (438, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (439, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (440, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (441, '        /* Admin Panel */');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (442, '        .admin-panel {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (443, '            background: rgba(255, 255, 255, 0.05);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (444, '            border: 1px solid rgba(0, 255, 255, 0.2);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (445, '            border-radius: 20px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (446, '            padding: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (447, '            margin: 2rem 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (448, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (449, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (450, '        .admin-section {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (451, '            margin-bottom: 3rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (452, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (453, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (454, '        .admin-section h3 {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (455, '            color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (456, '            margin-bottom: 1rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (457, '            font-size: 1.5rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (458, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (459, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (460, '        .data-table {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (461, '            width: 100%;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (462, '            border-collapse: collapse;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (463, '            background: rgba(255, 255, 255, 0.05);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (464, '            border-radius: 10px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (465, '            overflow: hidden;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (466, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (467, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (468, '        .data-table th,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (469, '        .data-table td {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (470, '            padding: 1rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (471, '            text-align: left;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (472, '            border-bottom: 1px solid rgba(255, 255, 255, 0.1);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (473, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (474, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (475, '        .data-table th {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (476, '            background: rgba(0, 255, 255, 0.1);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (477, '            color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (478, '            font-weight: bold;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (479, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (480, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (481, '        .data-table tr:hover {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (482, '            background: rgba(255, 255, 255, 0.05);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (483, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (484, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (485, '        .export-buttons {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (486, '            display: flex;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (487, '            gap: 1rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (488, '            margin-bottom: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (489, '            flex-wrap: wrap;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (490, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (491, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (492, '        .btn-export {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (493, '            background: linear-gradient(45deg, #ff00ff, #ff4500);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (494, '            color: #fff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (495, '            padding: 0.8rem 1.5rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (496, '            border: none;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (497, '            border-radius: 25px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (498, '            cursor: pointer;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (499, '            font-weight: bold;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (500, '            transition: all 0.3s ease;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (501, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (502, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (503, '        .btn-export:hover {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (504, '            transform: translateY(-2px);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (505, '            box-shadow: 0 10px 20px rgba(255, 0, 255, 0.3);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (506, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (507, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (508, '        .stats-grid {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (509, '            display: grid;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (510, '            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (511, '            gap: 1rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (512, '            margin-bottom: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (513, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (514, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (515, '        .stat-card {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (516, '            background: rgba(255, 255, 255, 0.05);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (517, '            border: 1px solid rgba(0, 255, 255, 0.2);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (518, '            border-radius: 15px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (519, '            padding: 1.5rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (520, '            text-align: center;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (521, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (522, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (523, '        .stat-number {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (524, '            font-size: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (525, '            font-weight: bold;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (526, '            color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (527, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (528, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (529, '        .stat-label {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (530, '            opacity: 0.8;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (531, '            margin-top: 0.5rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (532, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (533, '        .case-study {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (534, '            background: rgba(255, 255, 255, 0.05);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (535, '            border: 1px solid rgba(0, 255, 255, 0.2);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (536, '            border-radius: 20px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (537, '            padding: 3rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (538, '            margin: 3rem 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (539, '            text-align: center;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (540, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (541, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (542, '        .case-study h3 {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (543, '            color: #ff00ff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (544, '            font-size: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (545, '            margin-bottom: 1rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (546, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (547, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (548, '        .case-study-logo {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (549, '            font-size: 1.5rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (550, '            color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (551, '            font-weight: bold;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (552, '            margin-bottom: 1rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (553, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (554, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (555, '        .metrics {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (556, '            display: grid;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (557, '            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (558, '            gap: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (559, '            margin-top: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (560, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (561, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (562, '        .metric {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (563, '            text-align: center;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (564, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (565, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (566, '        .metric-number {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (567, '            font-size: 2rem;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (568, '            font-weight: bold;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (569, '            color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (570, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (571, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (572, '        .metric-label {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (573, '            opacity: 0.8;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (574, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (575, '    </style>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (576, '</head>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (577, '<body>    ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (578, '    <div class="bg-image"></div><style>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (579, '.bg-image {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (580, '  background: url(''bg.png'') no-repeat center center fixed;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (581, '  background-size: cover;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (582, '  position: fixed;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (583, '  top: 0; left: 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (584, '  width: 100vw;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (585, '  height: 100vh;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (586, '  opacity: 0.1;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (587, '  z-index: -1;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (588, '}');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (589, '        .content {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (590, '  position: relative;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (591, '  z-index: 1;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (592, '}');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (593, '</style>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (594, '    ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (595, '    <!-- Header -->');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (596, '    <header>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (597, '        <nav class="container">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (598, '            <div class="logo">TAE - TURNAROUND EXPERTS</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (599, '            <ul class="nav-links">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (600, '                <li><a href="#home" onclick="showSection(''home'')">Home</a></li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (601, '                <li><a href="#about" onclick="showSection(''about'')">About</a></li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (602, '                <li><a href="#services" onclick="showSection(''services'')">Services</a></li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (603, '                <li><a href="#pricing" onclick="showSection(''pricing'')">Pricing</a></li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (604, '                <li><a href="#contact" onclick="showSection(''contact'')">Contact</a></li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (605, '                <li id="adminNav" style="display: none;"><a href="#admin" onclick="showSection(''admin'')">Admin</a></li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (606, '            </ul>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (607, '              <link rel="stylesheet" href="style.css">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (608, '            <script src="https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js"></script>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (609, '            <script src="https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"></script>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (610, '            <script src="https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js"></script>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (611, '            <div class="auth-buttons">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (612, '                <a href="login.html">Login</a> ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (613, '                <a href="signup.html">Sign Up</a>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (614, '</body>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (615, '            </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (616, '        </nav>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (617, '    </header>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (618, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (619, '    <!-- Home Section -->');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (620, '    <section id="home" class="hero">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (621, '        <div class="hero-bg"></div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (622, '        <div class="container">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (623, '            <div class="hero-content">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (624, '                <h1>TRANSFORM YOUR STARTUP</h1>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (625, '                <p>Turn losses into profits with our expert strategies and innovative marketing campaigns</p>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (626, '                <div style="margin-top: 2rem;">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (627, '                    <a href="#" class="btn btn-primary" onclick="showSection(''pricing'')" style="margin-right: 1rem;">Get Started</a>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (628, '                    <a href="#" class="btn btn-secondary" onclick="showSection(''about'')">Learn More</a>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (629, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (630, '            </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (631, '        </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (632, '    </section>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (633, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (634, '    <!-- Admin Section -->');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (635, '    <section id="admin" class="section hidden">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (636, '        <div class="container">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (637, '            <h2 class="section-title">Admin Dashboard</h2>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (638, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (639, '            <!-- Statistics -->');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (640, '            <div class="stats-grid">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (641, '                <div class="stat-card">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (642, '                    <div class="stat-number" id="totalUsers">0</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (643, '                    <div class="stat-label">Total Users</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (644, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (645, '                <div class="stat-card">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (646, '                    <div class="stat-number" id="totalAppointments">0</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (647, '                    <div class="stat-label">Total Appointments</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (648, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (649, '                <div class="stat-card">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (650, '                    <div class="stat-number" id="pendingAppointments">0</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (651, '                    <div class="stat-label">Pending Appointments</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (652, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (653, '                <div class="stat-card">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (654, '                    <div class="stat-number" id="basicPlanCount">0</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (655, '                    <div class="stat-label">Basic Plan Interest</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (656, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (657, '            </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (658, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (659, '            <!-- Export Buttons -->');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (660, '            <div class="export-buttons">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (661, '                <button class="btn-export" onclick="exportUsersToExcel()">📊 Export Users to Excel</button>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (662, '                <button class="btn-export" onclick="exportAppointmentsToExcel()">📅 Export Appointments to Excel</button>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (663, '                <button class="btn-export" onclick="exportAllDataToExcel()">📋 Export All Data to Excel</button>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (664, '            </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (665, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (666, '            <!-- Users Section -->');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (667, '            <div class="admin-section">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (668, '                <h3>Registered Users</h3>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (669, '                <div style="overflow-x: auto;">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (670, '                    <table class="data-table" id="usersTable">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (671, '                        <thead>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (672, '                            <tr>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (673, '                                <th>ID</th>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (674, '                                <th>Name</th>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (675, '                                <th>Email</th>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (676, '                                <th>Company</th>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (677, '                                <th>Registration Date</th>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (678, '                            </tr>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (679, '                        </thead>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (680, '                        <tbody id="usersTableBody">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (681, '                            <!-- Users will be populated here -->');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (682, '                        </tbody>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (683, '                    </table>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (684, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (685, '            </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (686, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (687, '            <!-- Appointments Section -->');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (688, '            <div class="admin-section">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (689, '                <h3>Appointments</h3>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (690, '                <div style="overflow-x: auto;">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (691, '                    <table class="data-table" id="appointmentsTable">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (692, '                        <thead>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (693, '                            <tr>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (694, '                                <th>ID</th>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (695, '                                <th>Name</th>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (696, '                                <th>Email</th>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (697, '                                <th>Phone</th>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (698, '                                <th>Company</th>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (699, '                                <th>Plan</th>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (700, '                                <th>Message</th>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (701, '                                <th>Status</th>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (702, '                                <th>Date</th>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (703, '                                <th>Actions</th>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (704, '                            </tr>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (705, '                        </thead>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (706, '                        <tbody id="appointmentsTableBody">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (707, '                            <!-- Appointments will be populated here -->');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (708, '                        </tbody>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (709, '                    </table>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (710, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (711, '            </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (712, '        </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (713, '    </section>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (714, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (715, '    <!-- About Section -->');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (716, '    <section id="about" class="section hidden">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (717, '        <div class="container">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (718, '            <h2 class="section-title">Why Choose TAE?</h2>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (719, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (720, '            <!-- Success Case Study -->');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (721, '            <div class="case-study">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (722, '                <h3>SUCCESS STORY</h3>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (723, '                <div class="case-study-logo">LE CHALO</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (724, '                <p>From struggling startup to profitable business - we transformed Le Chalo''s entire operation</p>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (725, '                <div class="metrics">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (726, '                    <div class="metric">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (727, '                        <div class="metric-number">30%</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (728, '                        <div class="metric-label">Revenue Growth</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (729, '                    </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (730, '                    <div class="metric">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (731, '                        <div class="metric-number">5K+</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (732, '                        <div class="metric-label">Social Followers</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (733, '                    </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (734, '                    <div class="metric">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (735, '                        <div class="metric-number">58%</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (736, '                        <div class="metric-label">Cost Reduction</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (737, '                    </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (738, '                    <div class="metric">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (739, '                        <div class="metric-number">1M</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (740, '                        <div class="metric-label">Months to Profit</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (741, '                    </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (742, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (743, '            </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (744, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (745, '            <div class="about-grid">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (746, '                <div class="about-card">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (747, '                    <h3>Complete Business Transformation</h3>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (748, '                    <p>We don''t just manage your marketing - we transform your entire business model, operations, and strategy to ensure sustainable growth and profitability.</p>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (749, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (750, '                <div class="about-card">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (751, '                    <h3>Expert Team</h3>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (752, '                    <p>Our specialists include social media marketers, SEO experts, web developers, financial advisors, and legal consultants - all working together for your success.</p>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (753, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (754, '                <div class="about-card">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (755, '                    <h3>Proven Results</h3>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (756, '                    <p>We''ve helped startups like Le Chalo achieve remarkable transformations. Our track record speaks for itself with measurable improvements in revenue and growth.</p>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (757, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (758, '                <div class="about-card">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (759, '                    <h3>Full-Service Solutions</h3>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (760, '                    <p>From social media management to website development, ground operations to legal compliance - we handle everything so you can focus on your core business.</p>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (761, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (762, '            </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (763, '        </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (764, '    </section>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (765, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (766, '    <!-- Services Section -->');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (767, '    <section id="services" class="section hidden">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (768, '        <div class="container">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (769, '            <h2 class="section-title">Our Expertise</h2>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (770, '            <div class="services-grid">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (771, '                <div class="service-item">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (772, '                    <div class="service-icon">📱</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (773, '                    <h3>Social Media Management</h3>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (774, '                    <p>Complete social media strategy, content creation, and community management across all platforms</p>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (775, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (776, '                <div class="service-item">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (777, '                    <div class="service-icon">🌐</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (778, '                    <h3>Website Development</h3>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (779, '                    <p>Custom website design, development, and ongoing management to establish your online presence</p>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (780, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (781, '                <div class="service-item">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (782, '                    <div class="service-icon">🔍</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (783, '                    <h3>SEO Optimization</h3>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (784, '                    <p>Search engine optimization to improve your visibility and drive organic traffic to your business</p>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (785, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (786, '                <div class="service-item">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (787, '                    <div class="service-icon">📊</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (788, '                    <h3>Marketing Campaigns</h3>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (789, '                    <p>Unique, data-driven marketing campaigns designed to maximize ROI and customer acquisition</p>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (790, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (791, '                <div class="service-item">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (792, '                    <div class="service-icon">🏢</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (793, '                    <h3>Ground Operations</h3>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (794, '                    <p>Physical marketing activities, hoardings, events, and on-ground promotional campaigns</p>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (795, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (796, '                <div class="service-item">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (797, '                    <div class="service-icon">⚖️</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (798, '                    <h3>Legal & Financial</h3>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (799, '                    <p>Legal compliance support and financial optimisation strategies (Advanced plan only)</p>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (800, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (801, '            </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (802, '        </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (803, '    </section>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (804, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (805, '    <!-- Pricing Section -->');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (806, '    <section id="pricing" class="section hidden">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (807, '        <div class="container">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (808, '            <h2 class="section-title">Choose Your Transformation Plan</h2>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (809, '            <div class="pricing-grid">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (810, '                <div class="pricing-card">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (811, '                    <div class="plan-name">BASIC PLAN</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (812, '                    <div class="plan-price">₹11,999</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (813, '                    <div class="plan-duration">2 Months</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (814, '                    <ul class="plan-features">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (815, '                        <li>Dedicated Social Media Manager</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (816, '                        <li>Daily Content Creation & Posting</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (817, '                        <li>Ground Marketing Tasks</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (818, '                        <li>Hoardings & Physical Promotion</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (819, '                        <li>Basic Analytics & Reporting</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (820, '                        <li>Weekly Strategy Calls</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (821, '                    </ul>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (822, '                    <a href="#" class="btn btn-primary" onclick="bookAppointment(''Basic Plan'')">Get Started</a>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (823, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (824, '                ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (825, '                <div class="pricing-card featured">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (826, '                    <div class="plan-name">STANDARD PLAN</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (827, '                    <div class="plan-price">₹24,999</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (828, '                    <div class="plan-duration">4 Months</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (829, '                    <ul class="plan-features">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (830, '                        <li>Everything in Basic Plan</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (831, '                        <li>Custom Website Development</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (832, '                        <li>Website Management & Maintenance</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (833, '                        <li>SEO Optimization</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (834, '                        <li>Advanced Social Media Strategy</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (835, '                        <li>Email Marketing Setup</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (836, '                        <li>Bi-weekly Strategy Sessions</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (837, '                    </ul>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (838, '                    <a href="#" class="btn btn-primary" onclick="bookAppointment(''Standard Plan'')">Most Popular</a>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (839, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (840, '                ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (841, '                <div class="pricing-card">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (842, '                    <div class="plan-name">ADVANCE PLAN</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (843, '                    <div class="plan-price">₹49,999</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (844, '                    <div class="plan-duration">6 Months</div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (845, '                    <ul class="plan-features">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (846, '                        <li>Everything in Standard Plan</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (847, '                        <li>Legal Compliance Support</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (848, '                        <li>Financial Strategy & Optimization</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (849, '                        <li>Business Model Restructuring</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (850, '                        <li>Advanced Analytics & Insights</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (851, '                        <li>Priority Support & Consultation</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (852, '                        <li>Weekly One-on-One Sessions</li>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (853, '                    </ul>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (854, '                    <a href="#" class="btn btn-primary" onclick="bookAppointment(''Advance Plan'')">Transform Now</a>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (855, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (856, '            </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (857, '        </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (858, '    </section>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (859, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (860, '    <!-- Contact Section -->');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (861, '    <section id="contact" class="section hidden">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (862, '        <div class="container">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (863, '            <h2 class="section-title">Book Your Consultation</h2>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (864, '            <div class="form-container">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (865, '                <form id="appointmentForm">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (866, '                    <div class="form-group">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (867, '                        <label for="name">Full Name</label>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (868, '                        <input type="text" id="name" name="name" required>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (869, '                    </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (870, '                    <div class="form-group">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (871, '                        <label for="email">Email Address</label>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (872, '                        <input type="email" id="email" name="email" required>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (873, '                    </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (874, '                    <div class="form-group">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (875, '                        <label for="phone">Phone Number</label>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (876, '                        <input type="tel" id="phone" name="phone" required>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (877, '                    </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (878, '                    <div class="form-group">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (879, '                        <label for="company">Company Name</label>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (880, '                        <input type="text" id="company" name="company" required>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (881, '                    </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (882, '                    <div class="form-group">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (883, '                        <label for="plan">Interested Plan</label>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (884, '                        <select id="plan" name="plan" required>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (885, '                            <option value="">Select a Plan</option>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (886, '                            <option value="Basic Plan">Basic Plan - ₹11,999</option>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (887, '                            <option value="Standard Plan">Standard Plan - ₹24,999</option>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (888, '                            <option value="Advance Plan">Advance Plan - ₹49,999</option>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (889, '                        </select>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (890, '                    </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (891, '                    <div class="form-group">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (892, '                        <label for="message">Tell us about your business challenges</label>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (893, '                        <textarea id="message" name="message" rows="4" required></textarea>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (894, '                    </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (895, '                    <button type="submit" class="btn btn-primary" style="width: 100%;">Book Appointment</button>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (896, '                </form>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (897, '            </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (898, '        </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (899, '    </section>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (900, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (901, '    <!-- Footer -->');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (902, '    <footer>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (903, '        <div class="container">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (904, '            <div class="footer-content">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (905, '                <div class="footer-section">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (906, '                    <h3>TAE - Turnaround Experts</h3>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (907, '                    <p>Transforming startups from losses to profits through innovative strategies and expert execution.</p>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (908, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (909, '                <div class="footer-section">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (910, '                    <h3>Services</h3>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (911, '                    <p>Social Media Management<br>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (912, '                    Website Development<br>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (913, '                    SEO Optimization<br>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (914, '                    Marketing Campaigns</p>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (915, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (916, '                <div class="footer-section">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (917, '                    <h3>Contact</h3>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (918, '                    <p><a href="mailto:turnaroundexperts4@gmail.com">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (919, '                    Email: turnaroundexperts4@gmail.com</a><br>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (920, '                   <a href="tel:+918401635015">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (921, '                    Phone: +91 84016 35015</a><br>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (922, '                    <a href="tel:+919409283440">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (923, '                    Phone: +91 94092 83440</a><br>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (924, '                    Address: Palanpur Banaskantha, Gujarat<br>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (925, '                    Founder: Mr.Lucky Varandani .N<br>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (926, '                    Co-Founder: Mr.Rudra Padhya .D<br></p>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (927, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (928, '            </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (929, '            <p>&copy; 2025 Turnaround Experts. All rights reserved.</p>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (930, '        </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (931, '    </footer>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (932, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (933, '    <!-- Login Modal -->');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (934, '    <div id="loginModal" class="modal">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (935, '        <div class="modal-content">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (936, '            <span class="close" onclick="closeModal(''loginModal'')">&times;</span>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (937, '            <h2 style="text-align: center; color: #00ffff; margin-bottom: 2rem;">Login</h2>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (938, '            <form id="loginForm">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (939, '                <div class="form-group">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (940, '                    <label for="loginEmail">Email Address</label>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (941, '                    <input type="email" id="loginEmail" name="email" required>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (942, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (943, '                <div class="form-group">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (944, '                    <label for="loginPassword">Password</label>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (945, '                    <input type="password" id="loginPassword" name="password" required>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (946, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (947, '                <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (948, '            </form>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (949, '        </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (950, '    </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (951, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (952, '    <!-- Signup Modal -->');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (953, '    <div id="signupModal" class="modal">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (954, '        <div class="modal-content">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (955, '            <span class="close" onclick="closeModal(''signupModal'')">&times;</span>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (956, '            <h2 style="text-align: center; color: #00ffff; margin-bottom: 2rem;">Sign Up</h2>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (957, '            <form id="signupForm">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (958, '                <div class="form-group">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (959, '                    <label for="signupName">Full Name</label>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (960, '                    <input type="text" id="signupName" name="name" required>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (961, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (962, '                <div class="form-group">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (963, '                    <label for="signupEmail">Email Address</label>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (964, '                    <input type="email" id="signupEmail" name="email" required>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (965, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (966, '                <div class="form-group">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (967, '                    <label for="signupPassword">Password</label>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (968, '                    <input type="password" id="signupPassword" name="password" required>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (969, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (970, '                <div class="form-group">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (971, '                    <label for="signupCompany">Company Name</label>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (972, '                    <input type="text" id="signupCompany" name="company" required>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (973, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (974, '                <button type="submit" class="btn btn-primary" style="width: 100%;">Create Account</button>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (975, '            </form>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (976, '        </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (977, '    </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (978, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (979, '    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (980, '    <script>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (981, '        // User data storage');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (982, '        let users = JSON.parse(localStorage.getItem(''tae_users'')) || [];');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (983, '        let appointments = JSON.parse(localStorage.getItem(''tae_appointments'')) || [];');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (984, '        let currentUser = JSON.parse(localStorage.getItem(''tae_current_user'')) || null;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (985, '        ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (986, '        // Admin credentials');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (987, '        const ADMIN_EMAIL = ''luckyvarandani112@gmail.com'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (988, '        const ADMIN_PASSWORD = ''lucky@123'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (989, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (990, '        // Navigation');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (991, '        function showSection(sectionId) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (992, '            // Hide all sections');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (993, '            const sections = [''home'', ''about'', ''services'', ''pricing'', ''contact'', ''admin''];');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (994, '            sections.forEach(id => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (995, '                const element = document.getElementById(id);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (996, '                if (id === sectionId) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (997, '                    element.classList.remove(''hidden'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (998, '                } else {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (999, '                    element.classList.add(''hidden'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1000, '                }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1001, '            });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1002, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1003, '            // Update admin data if showing admin section');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1004, '            if (sectionId === ''admin'') {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1005, '                updateAdminDashboard();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1006, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1007, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1008, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1009, '        // Modal functions');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1010, '        function showModal(modalId) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1011, '            document.getElementById(modalId).style.display = ''flex'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1012, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1013, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1014, '        function closeModal(modalId) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1015, '            document.getElementById(modalId).style.display = ''none'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1016, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1017, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1018, '        // Book appointment function');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1019, '        function bookAppointment(planName) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1020, '            const planSelect = document.getElementById(''plan'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1021, '            planSelect.value = planName;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1022, '            showSection(''contact'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1023, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1024, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1025, '        // Form submissions');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1026, '        document.getElementById(''signupForm'').addEventListener(''submit'', function(e) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1027, '            e.preventDefault();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1028, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1029, '            const formData = new FormData(this);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1030, '            const userData = {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1031, '                id: Date.now(),');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1032, '                name: formData.get(''name''),');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1033, '                email: formData.get(''email''),');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1034, '                password: formData.get(''password''),');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1035, '                company: formData.get(''company''),');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1036, '                createdAt: new Date().toISOString()');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1037, '            };');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1038, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1039, '            // Check if user already exists');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1040, '            if (users.find(user => user.email === userData.email)) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1041, '                alert(''User with this email already exists!'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1042, '                return;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1043, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1044, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1045, '            users.push(userData);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1046, '            localStorage.setItem(''tae_users'', JSON.stringify(users));');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1047, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1048, '            alert(''Account created successfully! You can now login.'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1049, '            closeModal(''signupModal'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1050, '            this.reset();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1051, '        });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1052, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1053, '        document.getElementById(''loginForm'').addEventListener(''submit'', function(e) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1054, '            e.preventDefault();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1055, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1056, '            const formData = new FormData(this);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1057, '            const email = formData.get(''email'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1058, '            const password = formData.get(''password'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1059, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1060, '            // Check for admin login');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1061, '            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1062, '                currentUser = {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1063, '                    id: ''admin'',');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1064, '                    name: ''Admin'',');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1065, '                    email: ADMIN_EMAIL,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1066, '                    isAdmin: true');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1067, '                };');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1068, '                localStorage.setItem(''tae_current_user'', JSON.stringify(currentUser));');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1069, '                alert(''Welcome Admin! You now have access to the admin dashboard.'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1070, '                closeModal(''loginModal'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1071, '                updateAuthButtons();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1072, '                this.reset();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1073, '                return;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1074, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1075, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1076, '            // Regular user login');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1077, '            const user = users.find(u => u.email === email && u.password === password);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1078, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1079, '            if (user) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1080, '                currentUser = user;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1081, '                localStorage.setItem(''tae_current_user'', JSON.stringify(user));');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1082, '                alert(`Welcome back, ${user.name}!`);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1083, '                closeModal(''loginModal'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1084, '                updateAuthButtons();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1085, '                this.reset();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1086, '            } else {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1087, '                alert(''Invalid email or password!'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1088, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1089, '        });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1090, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1091, '        document.getElementById(''appointmentForm'').addEventListener(''submit'', function(e) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1092, '            e.preventDefault();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1093, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1094, '            const formData = new FormData(this);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1095, '            const appointmentData = {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1096, '                id: Date.now(),');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1097, '                name: formData.get(''name''),');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1098, '                email: formData.get(''email''),');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1099, '                phone: formData.get(''phone''),');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1100, '                company: formData.get(''company''),');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1101, '                plan: formData.get(''plan''),');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1102, '                message: formData.get(''message''),');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1103, '                status: ''pending'',');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1104, '                createdAt: new Date().toISOString()');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1105, '            };');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1106, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1107, '            appointments.push(appointmentData);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1108, '            localStorage.setItem(''tae_appointments'', JSON.stringify(appointments));');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1109, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1110, '            alert(''Appointment booked successfully! Our team will contact you within 24 hours.'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1111, '            this.reset();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1112, '        });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1113, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1114, '        // Update auth buttons based on login status');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1115, '        function updateAuthButtons() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1116, '            const authButtons = document.querySelector(''.auth-buttons'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1117, '            const adminNav = document.getElementById(''adminNav'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1118, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1119, '            if (currentUser) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1120, '                if (currentUser.isAdmin) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1121, '                    authButtons.innerHTML = `');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1122, '                        <span style="color: #ff00ff; margin-right: 1rem; font-weight: bold;">👑 Admin Panel</span>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1123, '                        <a href="#" class="btn btn-secondary" onclick="logout()">Logout</a>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1124, '                    `;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1125, '                    adminNav.style.display = ''block'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1126, '                } else {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1127, '                    authButtons.innerHTML = `');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1128, '                        <span style="color: #00ffff; margin-right: 1rem;">Welcome, ${currentUser.name}</span>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1129, '                        <a href="#" class="btn btn-secondary" onclick="logout()">Logout</a>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1130, '                    `;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1131, '                    adminNav.style.display = ''none'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1132, '                }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1133, '            } else {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1134, '                authButtons.innerHTML = `');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1135, '                    <a href="#" class="btn btn-secondary" onclick="showModal(''loginModal'')">Login</a>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1136, '                    <a href="#" class="btn btn-primary" onclick="showModal(''signupModal'')">Sign Up</a>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1137, '                `;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1138, '                adminNav.style.display = ''none'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1139, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1140, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1141, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1142, '        // Excel Export Functions');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1143, '        function exportUsersToExcel() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1144, '            if (users.length === 0) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1145, '                alert(''No users data to export!'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1146, '                return;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1147, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1148, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1149, '            const wb = XLSX.utils.book_new();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1150, '            const wsData = [');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1151, '                [''ID'', ''Name'', ''Email'', ''Company'', ''Registration Date'']');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1152, '            ];');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1153, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1154, '            users.forEach(user => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1155, '                wsData.push([');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1156, '                    user.id,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1157, '                    user.name,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1158, '                    user.email,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1159, '                    user.company,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1160, '                    new Date(user.createdAt).toLocaleDateString()');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1161, '                ]);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1162, '            });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1163, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1164, '            const ws = XLSX.utils.aoa_to_sheet(wsData);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1165, '            XLSX.utils.book_append_sheet(wb, ws, ''Users'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1166, '            XLSX.writeFile(wb, `TAE_Users_${new Date().toISOString().split(''T'')[0]}.xlsx`);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1167, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1168, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1169, '        function exportAppointmentsToExcel() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1170, '            if (appointments.length === 0) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1171, '                alert(''No appointments data to export!'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1172, '                return;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1173, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1174, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1175, '            const wb = XLSX.utils.book_new();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1176, '            const wsData = [');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1177, '                [''ID'', ''Name'', ''Email'', ''Phone'', ''Company'', ''Plan'', ''Message'', ''Status'', ''Date'']');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1178, '            ];');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1179, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1180, '            appointments.forEach(appointment => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1181, '                wsData.push([');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1182, '                    appointment.id,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1183, '                    appointment.name,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1184, '                    appointment.email,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1185, '                    appointment.phone,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1186, '                    appointment.company,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1187, '                    appointment.plan,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1188, '                    appointment.message,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1189, '                    appointment.status,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1190, '                    new Date(appointment.createdAt).toLocaleDateString()');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1191, '                ]);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1192, '            });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1193, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1194, '            const ws = XLSX.utils.aoa_to_sheet(wsData);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1195, '            XLSX.utils.book_append_sheet(wb, ws, ''Appointments'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1196, '            XLSX.writeFile(wb, `TAE_Appointments_${new Date().toISOString().split(''T'')[0]}.xlsx`);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1197, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1198, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1199, '        function exportAllDataToExcel() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1200, '            const wb = XLSX.utils.book_new();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1201, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1202, '            // Users Sheet');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1203, '            if (users.length > 0) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1204, '                const usersData = [');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1205, '                    [''ID'', ''Name'', ''Email'', ''Company'', ''Registration Date'']');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1206, '                ];');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1207, '                users.forEach(user => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1208, '                    usersData.push([');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1209, '                        user.id,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1210, '                        user.name,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1211, '                        user.email,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1212, '                        user.company,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1213, '                        new Date(user.createdAt).toLocaleDateString()');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1214, '                    ]);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1215, '                });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1216, '                const usersSheet = XLSX.utils.aoa_to_sheet(usersData);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1217, '                XLSX.utils.book_append_sheet(wb, usersSheet, ''Users'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1218, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1219, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1220, '            // Appointments Sheet');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1221, '            if (appointments.length > 0) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1222, '                const appointmentsData = [');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1223, '                    [''ID'', ''Name'', ''Email'', ''Phone'', ''Company'', ''Plan'', ''Message'', ''Status'', ''Date'']');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1224, '                ];');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1225, '                appointments.forEach(appointment => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1226, '                    appointmentsData.push([');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1227, '                        appointment.id,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1228, '                        appointment.name,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1229, '                        appointment.email,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1230, '                        appointment.phone,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1231, '                        appointment.company,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1232, '                        appointment.plan,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1233, '                        appointment.message,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1234, '                        appointment.status,');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1235, '                        new Date(appointment.createdAt).toLocaleDateString()');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1236, '                    ]);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1237, '                });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1238, '                const appointmentsSheet = XLSX.utils.aoa_to_sheet(appointmentsData);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1239, '                XLSX.utils.book_append_sheet(wb, appointmentsSheet, ''Appointments'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1240, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1241, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1242, '            // Statistics Sheet');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1243, '            const statsData = [');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1244, '                [''Metric'', ''Value''],');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1245, '                [''Total Users'', users.length],');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1246, '                [''Total Appointments'', appointments.length],');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1247, '                [''Pending Appointments'', appointments.filter(a => a.status === ''pending'').length],');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1248, '                [''Basic Plan Interest'', appointments.filter(a => a.plan === ''Basic Plan'').length],');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1249, '                [''Standard Plan Interest'', appointments.filter(a => a.plan === ''Standard Plan'').length],');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1250, '                [''Advance Plan Interest'', appointments.filter(a => a.plan === ''Advance Plan'').length],');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1251, '                [''Export Date'', new Date().toLocaleDateString()]');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1252, '            ];');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1253, '            const statsSheet = XLSX.utils.aoa_to_sheet(statsData);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1254, '            XLSX.utils.book_append_sheet(wb, statsSheet, ''Statistics'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1255, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1256, '            XLSX.writeFile(wb, `TAE_Complete_Data_${new Date().toISOString().split(''T'')[0]}.xlsx`);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1257, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1258, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1259, '        // Admin Dashboard Functions');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1260, '        function updateAdminDashboard() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1261, '            // Update statistics');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1262, '            document.getElementById(''totalUsers'').textContent = users.length;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1263, '            document.getElementById(''totalAppointments'').textContent = appointments.length;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1264, '            document.getElementById(''pendingAppointments'').textContent = ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1265, '                appointments.filter(a => a.status === ''pending'').length;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1266, '            document.getElementById(''basicPlanCount'').textContent = ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1267, '                appointments.filter(a => a.plan === ''Basic Plan'').length;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1268, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1269, '            // Update users table');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1270, '            const usersTableBody = document.getElementById(''usersTableBody'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1271, '            usersTableBody.innerHTML = '''';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1272, '            users.forEach(user => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1273, '                const row = usersTableBody.insertRow();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1274, '                row.innerHTML = `');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1275, '                    <td>${user.id}</td>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1276, '                    <td>${user.name}</td>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1277, '                    <td>${user.email}</td>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1278, '                    <td>${user.company}</td>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1279, '                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1280, '                `;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1281, '            });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1282, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1283, '            // Update appointments table');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1284, '            const appointmentsTableBody = document.getElementById(''appointmentsTableBody'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1285, '            appointmentsTableBody.innerHTML = '''';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1286, '            appointments.forEach(appointment => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1287, '                const row = appointmentsTableBody.insertRow();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1288, '                row.innerHTML = `');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1289, '                    <td>${appointment.id}</td>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1290, '                    <td>${appointment.name}</td>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1291, '                    <td>${appointment.email}</td>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1292, '                    <td>${appointment.phone}</td>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1293, '                    <td>${appointment.company}</td>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1294, '                    <td><span style="color: #00ffff; font-weight: bold;">${appointment.plan}</span></td>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1295, '                    <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${appointment.message}</td>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1296, '                    <td><span style="color: ${appointment.status === ''pending'' ? ''#ff00ff'' : ''#00ffff''}; font-weight: bold;">${appointment.status}</span></td>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1297, '                    <td>${new Date(appointment.createdAt).toLocaleDateString()}</td>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1298, '                    <td>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1299, '                        <button onclick="updateAppointmentStatus(${appointment.id}, ''completed'')" ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1300, '                                style="background: #00ffff; color: #000; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-right: 5px;">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1301, '                            Complete');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1302, '                        </button>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1303, '                        <button onclick="deleteAppointment(${appointment.id})" ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1304, '                                style="background: #ff0000; color: #fff; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1305, '                            Delete');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1306, '                        </button>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1307, '                    </td>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1308, '                `;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1309, '            });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1310, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1311, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1312, '        function updateAppointmentStatus(appointmentId, newStatus) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1313, '            const appointment = appointments.find(a => a.id === appointmentId);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1314, '            if (appointment) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1315, '                appointment.status = newStatus;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1316, '                localStorage.setItem(''tae_appointments'', JSON.stringify(appointments));');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1317, '                updateAdminDashboard();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1318, '                alert(`Appointment status updated to ${newStatus}!`);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1319, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1320, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1321, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1322, '        function deleteAppointment(appointmentId) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1323, '            if (confirm(''Are you sure you want to delete this appointment?'')) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1324, '                appointments = appointments.filter(a => a.id !== appointmentId);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1325, '                localStorage.setItem(''tae_appointments'', JSON.stringify(appointments));');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1326, '                updateAdminDashboard();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1327, '                alert(''Appointment deleted successfully!'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1328, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1329, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1330, '        function logout() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1331, '            currentUser = null;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1332, '            localStorage.removeItem(''tae_current_user'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1333, '            updateAuthButtons();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1334, '            alert(''Logged out successfully!'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1335, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1336, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1337, '        // Close modals when clicking outside');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1338, '        window.addEventListener(''click'', function(e) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1339, '            const modals = document.querySelectorAll(''.modal'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1340, '            modals.forEach(modal => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1341, '                if (e.target === modal) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1342, '                    modal.style.display = ''none'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1343, '                }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1344, '            });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1345, '        });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1346, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1347, '        // Smooth scrolling animation');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1348, '        function smoothScroll() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1349, '            const sections = document.querySelectorAll(''.section'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1350, '            sections.forEach(section => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1351, '                section.style.opacity = ''0'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1352, '                section.style.transform = ''translateY(50px)'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1353, '                section.style.transition = ''all 0.6s ease'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1354, '            });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1355, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1356, '            setTimeout(() => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1357, '                sections.forEach(section => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1358, '                    if (!section.classList.contains(''hidden'')) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1359, '                        section.style.opacity = ''1'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1360, '                        section.style.transform = ''translateY(0)'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1361, '                    }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1362, '                });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1363, '            }, 100);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1364, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1365, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1366, '        // Add animation to cards');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1367, '        function animateCards() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1368, '            const cards = document.querySelectorAll(''.about-card, .service-item, .pricing-card'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1369, '            cards.forEach((card, index) => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1370, '                card.style.opacity = ''0'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1371, '                card.style.transform = ''translateY(30px)'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1372, '                card.style.transition = `all 0.6s ease ${index * 0.1}s`;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1373, '                ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1374, '                setTimeout(() => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1375, '                    card.style.opacity = ''1'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1376, '                    card.style.transform = ''translateY(0)'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1377, '                }, 200 + (index * 100));');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1378, '            });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1379, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1380, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1381, '        // Floating particles animation');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1382, '        function createParticles() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1383, '            const particleContainer = document.createElement(''div'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1384, '            particleContainer.style.position = ''fixed'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1385, '            particleContainer.style.top = ''0'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1386, '            particleContainer.style.left = ''0'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1387, '            particleContainer.style.width = ''100%'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1388, '            particleContainer.style.height = ''100%'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1389, '            particleContainer.style.pointerEvents = ''none'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1390, '            particleContainer.style.zIndex = ''1'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1391, '            document.body.appendChild(particleContainer);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1392, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1393, '            for (let i = 0; i < 50; i++) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1394, '                const particle = document.createElement(''div'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1395, '                particle.style.position = ''absolute'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1396, '                particle.style.width = ''2px'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1397, '                particle.style.height = ''2px'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1398, '                particle.style.background = ''#00ffff'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1399, '                particle.style.borderRadius = ''50%'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1400, '                particle.style.opacity = Math.random();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1401, '                particle.style.left = Math.random() * 100 + ''%'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1402, '                particle.style.top = Math.random() * 100 + ''%'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1403, '                particle.style.animation = `float ${5 + Math.random() * 10}s linear infinite`;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1404, '                particleContainer.appendChild(particle);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1405, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1406, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1407, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1408, '        // Add floating animation keyframes');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1409, '        const style = document.createElement(''style'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1410, '        style.textContent = `');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1411, '            @keyframes float {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1412, '                0% { transform: translateY(100vh) rotate(0deg); }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1413, '                100% { transform: translateY(-100vh) rotate(360deg); }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1414, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1415, '        `;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1416, '        document.head.appendChild(style);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1417, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1418, '        // Initialize');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1419, '        document.addEventListener(''DOMContentLoaded'', function() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1420, '            updateAuthButtons();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1421, '            createParticles();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1422, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1423, '            // Add event listeners for section changes');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1424, '            const originalShowSection = showSection;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1425, '            showSection = function(sectionId) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1426, '                originalShowSection(sectionId);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1427, '                smoothScroll();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1428, '                setTimeout(animateCards, 300);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1429, '            };');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1430, '        });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1431, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1432, '        // Add typing effect to hero text');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1433, '        function typeWriter(element, text, speed = 100) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1434, '            let i = 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1435, '            element.innerHTML = '''';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1436, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1437, '            function type() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1438, '                if (i < text.length) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1439, '                    element.innerHTML += text.charAt(i);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1440, '                    i++;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1441, '                    setTimeout(type, speed);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1442, '                }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1443, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1444, '            type();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1445, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1446, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1447, '        // Initialize typing effect');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1448, '        window.addEventListener(''load'', function() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1449, '            const heroTitle = document.querySelector(''.hero h1'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1450, '            const heroText = document.querySelector(''.hero p'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1451, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1452, '            setTimeout(() => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1453, '                typeWriter(heroTitle, ''TRANSFORM YOUR STARTUP'', 100);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1454, '            }, 500);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1455, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1456, '            setTimeout(() => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1457, '                typeWriter(heroText, ''Turn losses into profits with our expert strategies and innovative marketing campaigns'', 50);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1458, '            }, 3000);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1459, '        });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1460, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1461, '        // Add hover effects to pricing cards');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1462, '        document.addEventListener(''DOMContentLoaded'', function() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1463, '            const pricingCards = document.querySelectorAll(''.pricing-card'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1464, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1465, '            pricingCards.forEach(card => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1466, '                card.addEventListener(''mouseenter'', function() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1467, '                    this.style.background = `linear-gradient(135deg, ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1468, '                        rgba(0, 255, 255, 0.1) 0%, ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1469, '                        rgba(255, 0, 255, 0.1) 100%)`;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1470, '                });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1471, '                ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1472, '                card.addEventListener(''mouseleave'', function() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1473, '                    this.style.background = ''rgba(255, 255, 255, 0.05)'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1474, '                });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1475, '            });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1476, '        });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1477, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1478, '        // Add loading animation');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1479, '        function showLoading() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1480, '            const loader = document.createElement(''div'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1481, '            loader.id = ''loader'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1482, '            loader.innerHTML = `');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1483, '                <div style="');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1484, '                    position: fixed;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1485, '                    top: 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1486, '                    left: 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1487, '                    width: 100%;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1488, '                    height: 100%;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1489, '                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1490, '                    display: flex;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1491, '                    justify-content: center;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1492, '                    align-items: center;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1493, '                    z-index: 9999;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1494, '                ">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1495, '                    <div style="');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1496, '                        text-align: center;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1497, '                        color: #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1498, '                    ">');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1499, '                        <div style="');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1500, '                            width: 50px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1501, '                            height: 50px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1502, '                            border: 3px solid rgba(0, 255, 255, 0.3);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1503, '                            border-radius: 50%;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1504, '                            border-top: 3px solid #00ffff;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1505, '                            animation: spin 1s linear infinite;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1506, '                            margin: 0 auto 20px;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1507, '                        "></div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1508, '                        <h2>TAE - TURNAROUND EXPERTS</h2>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1509, '                        <p>Loading your transformation...</p>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1510, '                    </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1511, '                </div>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1512, '            `;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1513, '            document.body.appendChild(loader);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1514, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1515, '            // Add spin animation');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1516, '            const spinStyle = document.createElement(''style'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1517, '            spinStyle.textContent = `');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1518, '                @keyframes spin {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1519, '                    0% { transform: rotate(0deg); }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1520, '                    100% { transform: rotate(360deg); }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1521, '                }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1522, '            `;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1523, '            document.head.appendChild(spinStyle);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1524, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1525, '            setTimeout(() => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1526, '                loader.remove();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1527, '            }, 2000);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1528, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1529, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1530, '        // Show loading on page load');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1531, '        window.addEventListener(''load'', function() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1532, '            showLoading();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1533, '        });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1534, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1535, '        // Add success metrics counter animation');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1536, '        function animateCounters() {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1537, '            const counters = document.querySelectorAll(''.metric-number'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1538, '            ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1539, '            counters.forEach(counter => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1540, '                const target = counter.textContent;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1541, '                const isPercentage = target.includes(''%'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1542, '                const isPlus = target.includes(''+'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1543, '                const isMonth = target.includes(''M'');');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1544, '                ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1545, '                let numericValue;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1546, '                if (isPercentage) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1547, '                    numericValue = parseInt(target.replace(''%'', ''''));');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1548, '                } else if (isPlus) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1549, '                    numericValue = parseInt(target.replace(''K+'', ''''));');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1550, '                } else if (isMonth) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1551, '                    numericValue = parseInt(target.replace(''M'', ''''));');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1552, '                } else {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1553, '                    numericValue = parseInt(target);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1554, '                }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1555, '                ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1556, '                let current = 0;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1557, '                const increment = numericValue / 50;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1558, '                const timer = setInterval(() => {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1559, '                    current += increment;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1560, '                    if (current >= numericValue) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1561, '                        current = numericValue;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1562, '                        clearInterval(timer);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1563, '                    }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1564, '                    ');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1565, '                    let displayValue = Math.floor(current);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1566, '                    if (isPercentage) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1567, '                        counter.textContent = displayValue + ''%'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1568, '                    } else if (isPlus) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1569, '                        counter.textContent = displayValue + ''K+'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1570, '                    } else if (isMonth) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1571, '                        counter.textContent = displayValue + ''M'';');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1572, '                    } else {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1573, '                        counter.textContent = displayValue;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1574, '                    }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1575, '                }, 50);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1576, '            });');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1577, '        }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1578, '');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1579, '        // Trigger counter animation when about section is shown');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1580, '        const originalShowSectionWithCounters = showSection;');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1581, '        showSection = function(sectionId) {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1582, '            originalShowSectionWithCounters(sectionId);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1583, '            if (sectionId === ''about'') {');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1584, '                setTimeout(animateCounters, 1000);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1585, '            }');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1586, '            smoothScroll();');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1587, '            setTimeout(animateCards, 300);');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1588, '        };');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1589, '    </script>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1590, '</body>');
INSERT INTO public.html_content OVERRIDING SYSTEM VALUE VALUES (1591, '</html>');


--
-- Data for Name: login_attempts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: signups; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: embeddings_id_seq; Type: SEQUENCE SET; Schema: meta; Owner: postgres
--

SELECT pg_catalog.setval('meta.embeddings_id_seq', 1, false);


--
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.appointments_id_seq', 1, false);


--
-- Name: html_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.html_content_id_seq', 1591, true);


--
-- Name: login_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.login_attempts_id_seq', 1, false);


--
-- Name: signups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.signups_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: embeddings embeddings_pkey; Type: CONSTRAINT; Schema: meta; Owner: postgres
--

ALTER TABLE ONLY meta.embeddings
    ADD CONSTRAINT embeddings_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: meta; Owner: postgres
--

ALTER TABLE ONLY meta.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (version);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: html_content html_content_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.html_content
    ADD CONSTRAINT html_content_pkey PRIMARY KEY (id);


--
-- Name: login_attempts login_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_attempts
    ADD CONSTRAINT login_attempts_pkey PRIMARY KEY (id);


--
-- Name: signups signups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signups
    ADD CONSTRAINT signups_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: appointments appointments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: login_attempts login_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_attempts
    ADD CONSTRAINT login_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: signups signups_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signups
    ADD CONSTRAINT signups_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

