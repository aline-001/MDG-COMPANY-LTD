--
-- PostgreSQL database dump
--

\restrict Jdifa9j7lRqSpzZyAsrKThDh6kNHx7e4K3SUI2gL9ZgYhdK6GbXN7MzVC2xXhLl

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-06-16 20:16:33

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 26619)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 876 (class 1247 OID 26642)
-- Name: ItemType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ItemType" AS ENUM (
    'SHOES',
    'BAG'
);


ALTER TYPE public."ItemType" OWNER TO postgres;

--
-- TOC entry 873 (class 1247 OID 26628)
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'IN_PROGRESS',
    'READY_FOR_PICKUP',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- TOC entry 882 (class 1247 OID 26658)
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'CREDIT_CARD',
    'DEBIT_CARD',
    'MOBILE_PAYMENT',
    'BANK_TRANSFER',
    'CASH'
);


ALTER TYPE public."PaymentMethod" OWNER TO postgres;

--
-- TOC entry 879 (class 1247 OID 26648)
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- TOC entry 870 (class 1247 OID 26621)
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'STAFF',
    'CUSTOMER'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 237 (class 1259 OID 26830)
-- Name: FileUpload; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FileUpload" (
    id integer NOT NULL,
    "fileName" text NOT NULL,
    "fileUrl" text NOT NULL,
    "fileSize" integer NOT NULL,
    "mimeType" text NOT NULL,
    "userId" integer NOT NULL,
    "orderId" integer,
    purpose text NOT NULL,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."FileUpload" OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 26829)
-- Name: FileUpload_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."FileUpload_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."FileUpload_id_seq" OWNER TO postgres;

--
-- TOC entry 5170 (class 0 OID 0)
-- Dependencies: 236
-- Name: FileUpload_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."FileUpload_id_seq" OWNED BY public."FileUpload".id;


--
-- TOC entry 235 (class 1259 OID 26812)
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id integer NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    "userId" integer NOT NULL,
    "orderId" integer,
    "isRead" boolean DEFAULT false NOT NULL,
    "sentAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 26811)
-- Name: Notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Notification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Notification_id_seq" OWNER TO postgres;

--
-- TOC entry 5171 (class 0 OID 0)
-- Dependencies: 234
-- Name: Notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Notification_id_seq" OWNED BY public."Notification".id;


--
-- TOC entry 225 (class 1259 OID 26717)
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id integer NOT NULL,
    "orderNumber" text NOT NULL,
    "orderSequence" integer NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "itemType" public."ItemType" NOT NULL,
    "userId" integer NOT NULL,
    "pickupDate" timestamp(3) without time zone NOT NULL,
    "deliveryDate" timestamp(3) without time zone,
    "completionDate" timestamp(3) without time zone,
    "pickupLocation" text NOT NULL,
    "deliveryLocation" text,
    notes text,
    "aiDiagnosis" text,
    "totalAmount" double precision NOT NULL,
    discount double precision DEFAULT 0 NOT NULL,
    "finalAmount" double precision NOT NULL,
    "isPaid" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 26760)
-- Name: OrderService; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderService" (
    id integer NOT NULL,
    "orderId" integer NOT NULL,
    "serviceId" integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    price double precision NOT NULL
);


ALTER TABLE public."OrderService" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 26759)
-- Name: OrderService_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OrderService_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OrderService_id_seq" OWNER TO postgres;

--
-- TOC entry 5172 (class 0 OID 0)
-- Dependencies: 228
-- Name: OrderService_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OrderService_id_seq" OWNED BY public."OrderService".id;


--
-- TOC entry 223 (class 1259 OID 26715)
-- Name: Order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Order_id_seq" OWNER TO postgres;

--
-- TOC entry 5173 (class 0 OID 0)
-- Dependencies: 223
-- Name: Order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Order_id_seq" OWNED BY public."Order".id;


--
-- TOC entry 224 (class 1259 OID 26716)
-- Name: Order_orderSequence_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Order_orderSequence_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Order_orderSequence_seq" OWNER TO postgres;

--
-- TOC entry 5174 (class 0 OID 0)
-- Dependencies: 224
-- Name: Order_orderSequence_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Order_orderSequence_seq" OWNED BY public."Order"."orderSequence";


--
-- TOC entry 231 (class 1259 OID 26773)
-- Name: Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payment" (
    id integer NOT NULL,
    "transactionId" text NOT NULL,
    amount double precision NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    method public."PaymentMethod" NOT NULL,
    "orderId" integer NOT NULL,
    "userId" integer NOT NULL,
    reference text,
    receipt text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 26772)
-- Name: Payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Payment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Payment_id_seq" OWNER TO postgres;

--
-- TOC entry 5175 (class 0 OID 0)
-- Dependencies: 230
-- Name: Payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Payment_id_seq" OWNED BY public."Payment".id;


--
-- TOC entry 233 (class 1259 OID 26793)
-- Name: Review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Review" (
    id integer NOT NULL,
    rating integer NOT NULL,
    comment text NOT NULL,
    "orderId" integer NOT NULL,
    "userId" integer NOT NULL,
    "isApproved" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Review" OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 26792)
-- Name: Review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Review_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Review_id_seq" OWNER TO postgres;

--
-- TOC entry 5176 (class 0 OID 0)
-- Dependencies: 232
-- Name: Review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Review_id_seq" OWNED BY public."Review".id;


--
-- TOC entry 222 (class 1259 OID 26694)
-- Name: Service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Service" (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    category public."ItemType" NOT NULL,
    "basePrice" double precision NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "quantityLabel" text NOT NULL,
    icon text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Service" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 26693)
-- Name: Service_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Service_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Service_id_seq" OWNER TO postgres;

--
-- TOC entry 5177 (class 0 OID 0)
-- Dependencies: 221
-- Name: Service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Service_id_seq" OWNED BY public."Service".id;


--
-- TOC entry 227 (class 1259 OID 26745)
-- Name: Shoe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Shoe" (
    id integer NOT NULL,
    brand text NOT NULL,
    model text NOT NULL,
    color text,
    size text,
    condition text,
    material text,
    "orderId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Shoe" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 26744)
-- Name: Shoe_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Shoe_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Shoe_id_seq" OWNER TO postgres;

--
-- TOC entry 5178 (class 0 OID 0)
-- Dependencies: 226
-- Name: Shoe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Shoe_id_seq" OWNED BY public."Shoe".id;


--
-- TOC entry 220 (class 1259 OID 26670)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    phone text NOT NULL,
    role public."UserRole" DEFAULT 'CUSTOMER'::public."UserRole" NOT NULL,
    "profileImage" text,
    address text,
    city text,
    "zipCode" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "passwordResetToken" text,
    "passwordResetExpiry" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastLogin" timestamp(3) without time zone
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 26669)
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- TOC entry 5179 (class 0 OID 0)
-- Dependencies: 219
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- TOC entry 4940 (class 2604 OID 26833)
-- Name: FileUpload id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileUpload" ALTER COLUMN id SET DEFAULT nextval('public."FileUpload_id_seq"'::regclass);


--
-- TOC entry 4937 (class 2604 OID 26815)
-- Name: Notification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification" ALTER COLUMN id SET DEFAULT nextval('public."Notification_id_seq"'::regclass);


--
-- TOC entry 4921 (class 2604 OID 26720)
-- Name: Order id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order" ALTER COLUMN id SET DEFAULT nextval('public."Order_id_seq"'::regclass);


--
-- TOC entry 4922 (class 2604 OID 26721)
-- Name: Order orderSequence; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order" ALTER COLUMN "orderSequence" SET DEFAULT nextval('public."Order_orderSequence_seq"'::regclass);


--
-- TOC entry 4929 (class 2604 OID 26763)
-- Name: OrderService id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderService" ALTER COLUMN id SET DEFAULT nextval('public."OrderService_id_seq"'::regclass);


--
-- TOC entry 4931 (class 2604 OID 26776)
-- Name: Payment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment" ALTER COLUMN id SET DEFAULT nextval('public."Payment_id_seq"'::regclass);


--
-- TOC entry 4934 (class 2604 OID 26796)
-- Name: Review id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review" ALTER COLUMN id SET DEFAULT nextval('public."Review_id_seq"'::regclass);


--
-- TOC entry 4917 (class 2604 OID 26697)
-- Name: Service id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service" ALTER COLUMN id SET DEFAULT nextval('public."Service_id_seq"'::regclass);


--
-- TOC entry 4927 (class 2604 OID 26748)
-- Name: Shoe id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Shoe" ALTER COLUMN id SET DEFAULT nextval('public."Shoe_id_seq"'::regclass);


--
-- TOC entry 4912 (class 2604 OID 26673)
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- TOC entry 5163 (class 0 OID 26830)
-- Dependencies: 237
-- Data for Name: FileUpload; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FileUpload" (id, "fileName", "fileUrl", "fileSize", "mimeType", "userId", "orderId", purpose, "uploadedAt") FROM stdin;
\.


--
-- TOC entry 5161 (class 0 OID 26812)
-- Dependencies: 235
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, type, title, message, "userId", "orderId", "isRead", "sentAt", "createdAt") FROM stdin;
\.


--
-- TOC entry 5151 (class 0 OID 26717)
-- Dependencies: 225
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, "orderNumber", "orderSequence", status, "itemType", "userId", "pickupDate", "deliveryDate", "completionDate", "pickupLocation", "deliveryLocation", notes, "aiDiagnosis", "totalAmount", discount, "finalAmount", "isPaid", "createdAt", "updatedAt") FROM stdin;
1	MDG-001	1	COMPLETED	SHOES	4	2026-06-11 00:00:00	\N	2026-06-11 13:54:17.201	MDG Laundry Center	MDG Laundry Center		\N	1000	0	1000	f	2026-06-11 13:40:54.606	2026-06-11 13:54:17.203
\.


--
-- TOC entry 5155 (class 0 OID 26760)
-- Dependencies: 229
-- Data for Name: OrderService; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderService" (id, "orderId", "serviceId", quantity, price) FROM stdin;
1	1	1	1	0
\.


--
-- TOC entry 5157 (class 0 OID 26773)
-- Dependencies: 231
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payment" (id, "transactionId", amount, status, method, "orderId", "userId", reference, receipt, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5159 (class 0 OID 26793)
-- Dependencies: 233
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Review" (id, rating, comment, "orderId", "userId", "isApproved", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5148 (class 0 OID 26694)
-- Dependencies: 222
-- Data for Name: Service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Service" (id, name, description, category, "basePrice", quantity, "quantityLabel", icon, "isActive", "createdAt", "updatedAt") FROM stdin;
1	Regular Cleaning	Standard shoe cleaning with brush and water wash. Ranges from 800–1,000 RWF based on shoe condition.	SHOES	800	1	per pair	\N	t	2026-05-23 08:26:16.668	2026-06-16 17:23:01.468
2	Medium Cleaning	Deeper clean for moderately soiled shoes. Ranges from 800–1,000 RWF based on condition.	SHOES	800	1	per pair	\N	t	2026-05-23 08:26:16.682	2026-06-16 17:23:01.487
3	Extreme Cleaning	Advanced cleaning for heavily soiled shoes with stain removal. 1,000 RWF per pair.	SHOES	1000	1	per pair	\N	t	2026-05-23 08:26:16.686	2026-06-16 17:23:01.492
4	Unyellowing Treatment	Special treatment to restore color and remove yellowing. 1,000 RWF per pair.	SHOES	1000	1	per pair	\N	t	2026-05-23 08:26:16.689	2026-06-16 17:23:01.496
5	Twin Deal Bundle	Special bundle for 2 pairs of shoes! Get both pairs cleaned for just 1,500 RWF.	SHOES	1500	2	2 pairs	\N	t	2026-05-23 08:26:16.692	2026-06-16 17:23:01.501
6	Leather Bags	Expert cleaning and conditioning for leather bags. Includes protection treatment. 2,000 RWF	BAG	1500	1	per bag	\N	t	2026-05-23 08:26:16.696	2026-06-16 17:23:01.505
7	Canvas Bags	Professional cleaning for canvas bags with stain removal. 1,500 RWF	BAG	1200	1	per bag	\N	t	2026-05-23 08:26:16.702	2026-06-16 17:23:01.51
8	Lace Bags	Gentle cleaning for delicate lace bags with special care. 1,500 RWF	BAG	1500	1	per bag	\N	t	2026-05-23 08:26:16.705	2026-06-16 17:23:01.514
9	Other Bag Types	Cleaning for any other bag type (nylon, synthetic, etc). Professional treatment. 2,000 RWF	BAG	1200	1	per bag	\N	t	2026-05-23 08:26:16.707	2026-06-16 17:23:01.518
\.


--
-- TOC entry 5153 (class 0 OID 26745)
-- Dependencies: 227
-- Data for Name: Shoe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Shoe" (id, brand, model, color, size, condition, material, "orderId", "createdAt") FROM stdin;
\.


--
-- TOC entry 5146 (class 0 OID 26670)
-- Dependencies: 220
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, "firstName", "lastName", phone, role, "profileImage", address, city, "zipCode", "isActive", "emailVerified", "passwordResetToken", "passwordResetExpiry", "createdAt", "updatedAt", "lastLogin") FROM stdin;
2	albertmendolza295@gmail.com	$2b$10$RF3xjkcHvgh2xUeueCzcxOvnwbVYyXUvtTp4InswzLtJkIUv58Loy	Albert	Mendolza	+250788000002	ADMIN	\N	\N	\N	\N	t	t	\N	\N	2026-05-23 08:26:16.55	2026-05-23 08:26:16.55	\N
1	asimwealine2004@gmail.com	$2b$10$hyO3RCAnZb4pxz0Hi3rSWeSSMCDyjrTNmVc6O4dCPl2D9O9NgOd8C	Aline	Asimwe	+250788000001	ADMIN	\N	\N	\N	\N	t	t	\N	\N	2026-05-23 08:26:16.416	2026-06-11 13:52:22.126	2026-06-11 13:52:22.123
3	default@mdg.com	$2b$10$YLfqyWhswNzxI5UHNpT7leBY3yMuYarF6oidR1INEyl.SYeAU2VMS	Default	User	0000000000	CUSTOMER	\N	\N	\N	\N	t	f	\N	\N	2026-05-23 08:26:16.658	2026-06-15 09:08:10.36	2026-06-15 09:08:10.355
4	mukamishamarieaimee@gmail.com	$2b$10$eI8oyZWgokZLvXUhjq/dE.tSefX6pgXmzDVqZ6iO.kgAIQ/TxPFtK	sally	Asiimwe	+250784595094	CUSTOMER	\N	\N	\N	\N	t	f	\N	\N	2026-06-09 12:03:19.683	2026-06-16 17:24:05.024	2026-06-16 17:24:05.02
\.


--
-- TOC entry 5180 (class 0 OID 0)
-- Dependencies: 236
-- Name: FileUpload_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."FileUpload_id_seq"', 1, false);


--
-- TOC entry 5181 (class 0 OID 0)
-- Dependencies: 234
-- Name: Notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Notification_id_seq"', 1, false);


--
-- TOC entry 5182 (class 0 OID 0)
-- Dependencies: 228
-- Name: OrderService_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OrderService_id_seq"', 1, true);


--
-- TOC entry 5183 (class 0 OID 0)
-- Dependencies: 223
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Order_id_seq"', 1, true);


--
-- TOC entry 5184 (class 0 OID 0)
-- Dependencies: 224
-- Name: Order_orderSequence_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Order_orderSequence_seq"', 1, true);


--
-- TOC entry 5185 (class 0 OID 0)
-- Dependencies: 230
-- Name: Payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Payment_id_seq"', 1, false);


--
-- TOC entry 5186 (class 0 OID 0)
-- Dependencies: 232
-- Name: Review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Review_id_seq"', 1, false);


--
-- TOC entry 5187 (class 0 OID 0)
-- Dependencies: 221
-- Name: Service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Service_id_seq"', 9, true);


--
-- TOC entry 5188 (class 0 OID 0)
-- Dependencies: 226
-- Name: Shoe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Shoe_id_seq"', 1, false);


--
-- TOC entry 5189 (class 0 OID 0)
-- Dependencies: 219
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 4, true);


--
-- TOC entry 4984 (class 2606 OID 26846)
-- Name: FileUpload FileUpload_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileUpload"
    ADD CONSTRAINT "FileUpload_pkey" PRIMARY KEY (id);


--
-- TOC entry 4980 (class 2606 OID 26828)
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- TOC entry 4965 (class 2606 OID 26771)
-- Name: OrderService OrderService_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderService"
    ADD CONSTRAINT "OrderService_pkey" PRIMARY KEY (id);


--
-- TOC entry 4956 (class 2606 OID 26743)
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- TOC entry 4968 (class 2606 OID 26791)
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- TOC entry 4975 (class 2606 OID 26810)
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- TOC entry 4950 (class 2606 OID 26714)
-- Name: Service Service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_pkey" PRIMARY KEY (id);


--
-- TOC entry 4961 (class 2606 OID 26758)
-- Name: Shoe Shoe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Shoe"
    ADD CONSTRAINT "Shoe_pkey" PRIMARY KEY (id);


--
-- TOC entry 4945 (class 2606 OID 26692)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4982 (class 1259 OID 26872)
-- Name: FileUpload_orderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "FileUpload_orderId_idx" ON public."FileUpload" USING btree ("orderId");


--
-- TOC entry 4985 (class 1259 OID 26871)
-- Name: FileUpload_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "FileUpload_userId_idx" ON public."FileUpload" USING btree ("userId");


--
-- TOC entry 4977 (class 1259 OID 26870)
-- Name: Notification_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_createdAt_idx" ON public."Notification" USING btree ("createdAt");


--
-- TOC entry 4978 (class 1259 OID 26869)
-- Name: Notification_isRead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_isRead_idx" ON public."Notification" USING btree ("isRead");


--
-- TOC entry 4981 (class 1259 OID 26868)
-- Name: Notification_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_userId_idx" ON public."Notification" USING btree ("userId");


--
-- TOC entry 4962 (class 1259 OID 26859)
-- Name: OrderService_orderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "OrderService_orderId_idx" ON public."OrderService" USING btree ("orderId");


--
-- TOC entry 4963 (class 1259 OID 26860)
-- Name: OrderService_orderId_serviceId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "OrderService_orderId_serviceId_key" ON public."OrderService" USING btree ("orderId", "serviceId");


--
-- TOC entry 4951 (class 1259 OID 26857)
-- Name: Order_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_createdAt_idx" ON public."Order" USING btree ("createdAt");


--
-- TOC entry 4952 (class 1259 OID 26856)
-- Name: Order_orderNumber_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_orderNumber_idx" ON public."Order" USING btree ("orderNumber");


--
-- TOC entry 4953 (class 1259 OID 26852)
-- Name: Order_orderNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Order_orderNumber_key" ON public."Order" USING btree ("orderNumber");


--
-- TOC entry 4954 (class 1259 OID 26853)
-- Name: Order_orderSequence_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Order_orderSequence_key" ON public."Order" USING btree ("orderSequence");


--
-- TOC entry 4957 (class 1259 OID 26855)
-- Name: Order_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_status_idx" ON public."Order" USING btree (status);


--
-- TOC entry 4958 (class 1259 OID 26854)
-- Name: Order_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_userId_idx" ON public."Order" USING btree ("userId");


--
-- TOC entry 4966 (class 1259 OID 26862)
-- Name: Payment_orderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_orderId_idx" ON public."Payment" USING btree ("orderId");


--
-- TOC entry 4969 (class 1259 OID 26864)
-- Name: Payment_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_status_idx" ON public."Payment" USING btree (status);


--
-- TOC entry 4970 (class 1259 OID 26861)
-- Name: Payment_transactionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Payment_transactionId_key" ON public."Payment" USING btree ("transactionId");


--
-- TOC entry 4971 (class 1259 OID 26863)
-- Name: Payment_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_userId_idx" ON public."Payment" USING btree ("userId");


--
-- TOC entry 4972 (class 1259 OID 26867)
-- Name: Review_isApproved_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Review_isApproved_idx" ON public."Review" USING btree ("isApproved");


--
-- TOC entry 4973 (class 1259 OID 26865)
-- Name: Review_orderId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Review_orderId_key" ON public."Review" USING btree ("orderId");


--
-- TOC entry 4976 (class 1259 OID 26866)
-- Name: Review_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Review_userId_idx" ON public."Review" USING btree ("userId");


--
-- TOC entry 4947 (class 1259 OID 26851)
-- Name: Service_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Service_category_idx" ON public."Service" USING btree (category);


--
-- TOC entry 4948 (class 1259 OID 26850)
-- Name: Service_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Service_isActive_idx" ON public."Service" USING btree ("isActive");


--
-- TOC entry 4959 (class 1259 OID 26858)
-- Name: Shoe_orderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Shoe_orderId_idx" ON public."Shoe" USING btree ("orderId");


--
-- TOC entry 4942 (class 1259 OID 26848)
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- TOC entry 4943 (class 1259 OID 26847)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 4946 (class 1259 OID 26849)
-- Name: User_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_role_idx" ON public."User" USING btree (role);


--
-- TOC entry 4996 (class 2606 OID 26928)
-- Name: FileUpload FileUpload_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileUpload"
    ADD CONSTRAINT "FileUpload_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4997 (class 2606 OID 26923)
-- Name: FileUpload FileUpload_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileUpload"
    ADD CONSTRAINT "FileUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4994 (class 2606 OID 26918)
-- Name: Notification Notification_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4995 (class 2606 OID 26913)
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4988 (class 2606 OID 26883)
-- Name: OrderService OrderService_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderService"
    ADD CONSTRAINT "OrderService_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4989 (class 2606 OID 26888)
-- Name: OrderService OrderService_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderService"
    ADD CONSTRAINT "OrderService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public."Service"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4986 (class 2606 OID 26873)
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4990 (class 2606 OID 26893)
-- Name: Payment Payment_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4991 (class 2606 OID 26898)
-- Name: Payment Payment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4992 (class 2606 OID 26903)
-- Name: Review Review_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4993 (class 2606 OID 26908)
-- Name: Review Review_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4987 (class 2606 OID 26878)
-- Name: Shoe Shoe_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Shoe"
    ADD CONSTRAINT "Shoe_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5169 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-06-16 20:16:34

--
-- PostgreSQL database dump complete
--

\unrestrict Jdifa9j7lRqSpzZyAsrKThDh6kNHx7e4K3SUI2gL9ZgYhdK6GbXN7MzVC2xXhLl

