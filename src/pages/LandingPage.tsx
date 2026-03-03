import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import fondoHero from "../assets/fondo_hero.png";
import {
    FileSpreadsheet,
    Users,
    BarChart3,
    Shield,
    ArrowRight,
    ChevronDown,
    Zap,
    Clock,
    TrendingUp,
    Building2,
    Briefcase,
    GraduationCap,
    Store,
    Target,
    Calculator,
    PieChart,
    CheckCircle2
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────
interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    index: number;
}

interface MetricProps {
    value: string;
    label: string;
    index: number;
}

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    active?: boolean;
}

interface TargetClientProps {
    icon: React.ElementType;
    title: string;
    description: string;
    stat: string;
    statLabel: string;
    index: number;
    image: string;
}

// ─── Data ───────────────────────────────────────────────────────
const FEATURES: Omit<FeatureCardProps, "index">[] = [
    {
        icon: FileSpreadsheet,
        title: "Contabilidad General",
        description:
            "Mantenemos tus libros al día con precisión. Registros contables, estados financieros y cumplimiento normativo sin complicaciones.",
    },
    {
        icon: Users,
        title: "Gestión de Nómina",
        description:
            "Cálculo exacto de sueldos, retenciones, IMSS e Infonavit. Asegura el pago puntual de tu equipo cumpliendo la ley.",
    },
    {
        icon: BarChart3,
        title: "Estrategia Fiscal",
        description:
            "Planeación y presentación de declaraciones. Optimizamos tu carga tributaria de manera legal y transparente.",
    },
    {
        icon: Shield,
        title: "Consultoría Financiera",
        description:
            "Análisis profundo de tus finanzas para tomar decisiones estratégicas. Proyecciones, control de presupuestos y flujos.",
    },
];

const METRICS: Omit<MetricProps, "index">[] = [
    { value: "10+", label: "Años de Experiencia" },
    { value: "200+", label: "Clientes Satisfechos" },
    { value: "100%", label: "Cumplimiento" },
    { value: "24/7", label: "Atención Pers." },
];

const TARGET_CLIENTS: Omit<TargetClientProps, "index">[] = [
    {
        icon: Building2,
        title: "PyMEs y Empresas",
        description:
            "Negocios establecidos que buscan delegar su departamento contable para enfocarse en la operación y crecimiento de su empresa.",
        stat: "Empresas",
        statLabel: "Servicio Integral",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop",
    },
    {
        icon: Briefcase,
        title: "Emprendedores",
        description:
            "Startups y nuevos negocios que necesitan estructura, cumplimiento inicial y asesoría para dar pasos firmes desde el primer día.",
        stat: "Startups",
        statLabel: "Asesoría Estratégica",
        image: "https://images.unsplash.com/photo-1556761175-5973dd0f3217?q=80&w=800&auto=format&fit=crop",
    },
    {
        icon: GraduationCap,
        title: "Profesionales Indep.",
        description:
            "Freelancers y prestadores de servicios que requieren apoyo para sus declaraciones mensuales y anuales sin complicaciones.",
        stat: "Freelancers",
        statLabel: "Declaraciones",
        image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=800&auto=format&fit=crop",
    },
    {
        icon: Store,
        title: "Comercios Locales",
        description:
            "Negocios físicos, tiendas y restaurantes que necesitan control de inventarios, facturación rápida y nóminas semanales.",
        stat: "Comercios",
        statLabel: "Control Total",
        image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=800&auto=format&fit=crop",
    },
];

// ─── Animation Variants ─────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
    }),
};

// ─── Sub-components ─────────────────────────────────────────────

function NavLink({ href, children, active = false }: NavLinkProps) {
    return (
        <a
            href={href}
            className={`text-sm font-medium transition-all duration-300 px-4 py-1.5 rounded-full
                ${active
                    ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30"
                    : "text-white/80 hover:text-white border border-transparent"
                }`}
        >
            {children}
        </a>
    );
}

function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            custom={index}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="group relative p-8 rounded-2xl border border-white/10 bg-[#050505] overflow-hidden
                 hover:-translate-y-2 hover:border-[#D4AF37]/50 hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] transition-all duration-500"
        >
            {/* Base gradient inside */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

            {/* Intense Glow on hover */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Bottom accent line on hover */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 pointer-events-none origin-center" />

            <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37]/20 group-hover:scale-110 transition-all duration-500 border border-[#D4AF37]/20 shadow-lg">
                    <Icon className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3 tracking-wide group-hover:text-[#D4AF37] transition-colors duration-300">{title}</h3>
                <p className="text-white/80 text-base leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
}

function AnimatedMetric({ value, label, index }: MetricProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            custom={index}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={scaleIn}
            className="text-center"
        >
            <p className="text-5xl md:text-6xl font-black text-black tracking-tight mb-2">
                {value}
            </p>
            <p className="text-black/60 text-sm uppercase tracking-[0.2em] font-bold">{label}</p>
        </motion.div>
    );
}

function TargetClientCard({ icon: Icon, title, description, stat, statLabel, image, index }: TargetClientProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    // Create the parallax background movement
    const yTransform = useTransform(scrollYProgress, [0, 1], [-80, 80]);

    return (
        <motion.div
            ref={ref}
            custom={index}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="group relative p-8 md:p-10 rounded-2xl border border-white/[0.08] bg-[#050505] overflow-hidden hover:border-[#D4AF37]/40 transition-all duration-500 shadow-xl"
        >
            {/* Parallax Background Image */}
            <motion.div
                style={{ y: yTransform }}
                className="absolute inset-[-80px] z-0 pointer-events-none transition-transform duration-700"
            >
                <img src={image} alt={title} className="w-full h-full object-cover scale-110 opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
            </motion.div>

            {/* Gradient Overlay for Text Legibility */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#020202] via-[#020202]/80 to-transparent pointer-events-none" />

            {/* Subtile radial glow on hover */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37]/30 transition-colors duration-500 border border-[#D4AF37]/20 group-hover:border-[#D4AF37]/50 shadow-lg backdrop-blur-md">
                        <Icon className="w-7 h-7 text-[#D4AF37]" />
                    </div>
                    <div className="text-right bg-black/50 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-md">
                        <p className="text-3xl font-black text-[#D4AF37] drop-shadow-md">{stat}</p>
                        <p className="text-white/90 text-xs uppercase tracking-widest drop-shadow">{statLabel}</p>
                    </div>
                </div>

                <h3 className="text-white font-bold text-2xl mb-3 drop-shadow-lg tracking-wide">{title}</h3>
                <p className="text-white/90 text-base leading-relaxed drop-shadow-md">{description}</p>
            </div>
        </motion.div>
    );
}

// ─── Navbar ─────────────────────────────────────────────────────

function Navbar() {
    const [activeSection, setActiveSection] = useState("hero");

    useEffect(() => {
        const handleScroll = () => {
            const sections = ["hero", "servicios", "about", "clientes"];
            let current = "hero";

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Consider a section active if its top is near the middle of the viewport
                    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                        current = section;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener("scroll", handleScroll);
        // initial check
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/[0.04]"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
                {/* Logo */}
                <a href="#hero" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#b8941f] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                        <span className="text-black font-black text-sm">Z</span>
                    </div>
                    <span className="text-white font-bold text-lg tracking-wider hidden sm:inline">
                        Zechnas
                    </span>
                </a>

                {/* Center nav pills */}
                <div className="hidden md:flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-full px-1.5 py-1">
                    <NavLink href="#hero" active={activeSection === "hero"}>Inicio</NavLink>
                    <NavLink href="#servicios" active={activeSection === "servicios"}>Servicios</NavLink>
                    <NavLink href="#about" active={activeSection === "about"}>Nosotros</NavLink>
                    <NavLink href="#clientes" active={activeSection === "clientes"}>Clientes</NavLink>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-3">
                    <a
                        href="#contacto"
                        className="bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.1em] px-5 py-2 rounded-lg
                         hover:bg-[#c9a430] transition-all duration-300 cursor-pointer shadow-lg shadow-[#D4AF37]/15"
                    >
                        Contáctanos
                    </a>
                </div>
            </div>
        </motion.nav>
    );
}

// ─── Hero ───────────────────────────────────────────────────────

function HeroSection() {
    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center overflow-hidden pt-16"
        >
            {/* ── Background image ── */}
            <img
                src={fondoHero}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-70"
            />
            {/* Dark overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 pointer-events-none" />

            {/* ── Background gradient mesh ── */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Primary gold glow — top-left */}
                <div className="absolute top-[10%] left-[15%] w-[600px] h-[500px] bg-[#D4AF37]/[0.06] rounded-full blur-[140px]" />
                {/* Secondary darker gold — center */}
                <div className="absolute top-[40%] left-[40%] w-[500px] h-[400px] bg-[#8B7320]/[0.04] rounded-full blur-[120px]" />
                {/* Subtle cool tone — bottom right for depth */}
                <div className="absolute bottom-[5%] right-[10%] w-[400px] h-[350px] bg-[#1a2a1a]/30 rounded-full blur-[100px]" />
                {/* Warm edge — top right */}
                <div className="absolute top-0 right-[20%] w-[300px] h-[300px] bg-[#D4AF37]/[0.02] rounded-full blur-[100px]" />
            </div>

            {/* Noise texture overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                }}
            />

            {/* ── Main content ── */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-4rem)]">

                    {/* ── Left: Text content ── */}
                    <div className="flex flex-col justify-center py-12 lg:py-0">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="inline-flex items-center gap-2 border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06] rounded-full px-4 py-1.5 mb-8 w-fit"
                        >
                            <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span className="text-[#D4AF37] text-xs font-medium tracking-[0.1em]">
                                Servicios Contables Profesionales
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="text-[2.75rem] sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-extrabold text-white leading-[1.08] mb-6 tracking-tight"
                        >
                            Tu tranquilidad fiscal en manos de{" "}
                            <span className="italic font-serif bg-gradient-to-r from-[#D4AF37] via-[#e8cb6b] to-[#D4AF37] bg-clip-text text-transparent">
                                expertos
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="text-white/75 text-base lg:text-lg max-w-lg mb-10 leading-relaxed"
                        >
                            Brindamos soluciones integrales en contabilidad, impuestos y finanzas para que tú te enfoques en hacer crecer tu negocio sin preocupaciones.
                        </motion.p>

                        {/* CTA buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.65, duration: 0.6 }}
                            className="flex flex-wrap items-center gap-4"
                        >
                            <a
                                href="#servicios"
                                className="group inline-flex items-center gap-2 bg-[#D4AF37] text-black font-bold text-sm tracking-wide px-7 py-3 rounded-full
                                   hover:bg-[#c9a430] transition-all duration-300 shadow-xl shadow-[#D4AF37]/20"
                            >
                                Nuestros Servicios
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                            </a>
                            <a
                                href="#contacto"
                                className="inline-flex items-center gap-2 border border-white/10 text-white/60 font-semibold text-sm tracking-wide px-7 py-3 rounded-full
                                   hover:border-white/20 hover:text-white/80 transition-all duration-300 backdrop-blur-sm"
                            >
                                Agendar Asesoría
                            </a>
                        </motion.div>
                    </div>

                    {/* ── Right: Liquid glass floating cards ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative hidden lg:flex items-center justify-center"
                    >
                        <div className="relative w-full max-w-[700px] h-[550px]">

                            {/* Card 1 — Main representation (bottom-left) */}
                            <motion.div
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-[40px] left-[20px] w-[460px] p-8 rounded-2xl
                                    bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08]
                                    shadow-[0_30px_70px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]
                                    z-10 flex flex-col gap-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                                            <Calculator className="w-6 h-6 text-[#D4AF37]" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-lg">Balance General</p>
                                            <p className="text-white/80 text-sm">Actualizado hoy</p>
                                        </div>
                                    </div>
                                    <span className="text-[#D4AF37] font-semibold">+15.4%</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <span className="text-white/60">Activos Totales</span>
                                        <span className="text-white font-medium">$2,450,000 MXN</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <span className="text-white/60">Pasivos</span>
                                        <span className="text-white font-medium">$840,000 MXN</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60">Capital Contable</span>
                                        <span className="text-[#D4AF37] font-bold">$1,610,000 MXN</span>
                                    </div>
                                </div>

                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-white/[0.05] pointer-events-none z-20" />
                            </motion.div>

                            {/* Card 2 — Floating status (top-right, overlapping) */}
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute top-[60px] right-[20px] w-[320px] p-6 rounded-2xl
                                    bg-[#D4AF37]/[0.05] backdrop-blur-3xl border border-[#D4AF37]/20
                                    shadow-[0_40px_80px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(212,175,55,0.1)]
                                    z-20 flex flex-col gap-5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#1a2a1a] border border-green-500/30 flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">Declaración Anual</p>
                                        <p className="text-green-400 text-xs font-medium">Presentada con éxito</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                                    <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center">
                                        <PieChart className="w-6 h-6 text-white/50" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">Estrategia Fiscal</p>
                                        <p className="text-[#D4AF37] text-xs font-medium">Optimizando recursos</p>
                                    </div>
                                </div>
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent z-20" />
                            </motion.div>

                            {/* Ambient glow behind cards */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#D4AF37]/[0.04] rounded-full blur-[80px] pointer-events-none" />
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-5 h-5 text-white/20" />
                </motion.div>
            </motion.div>
        </section>
    );
}

// ─── Features ───────────────────────────────────────────────────

function FeaturesSection() {
    return (
        <section id="servicios" className="relative py-32 px-6 bg-[#030303] overflow-hidden border-t border-white/[0.04]">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

            {/* Glowing animated background orbs */}
            <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 right-[15%] w-[600px] h-[600px] bg-[conic-gradient(from_0deg,transparent,rgba(212,175,55,0.3),transparent)] rounded-full blur-[60px] pointer-events-none"
            />
            <motion.div
                animate={{ y: [0, -50, 0], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 left-[5%] w-[400px] h-[400px] bg-[#D4AF37]/[0.15] rounded-full blur-[80px] pointer-events-none"
            />

            {/* Subtle top/bottom gradient transitions */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#020202] to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section header */}
                <div className="text-center mb-20 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#D4AF37]/[0.15] rounded-full blur-[60px] pointer-events-none" />
                    <p className="text-[#D4AF37] text-sm uppercase tracking-[0.2em] font-bold mb-4 relative z-10">
                        Nuestros Servicios
                    </p>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 relative z-10 drop-shadow-lg">
                        Soluciones contables a tu medida
                    </h2>
                    <p className="text-white/70 max-w-lg mx-auto text-base leading-relaxed relative z-10">
                        Delegar tu contabilidad nunca fue tan fácil. Nos encargamos de tus números para que tú te enfoques en liderar tu negocio.
                    </p>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES.map((feature, i) => (
                        <FeatureCard key={feature.title} {...feature} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Metrics ────────────────────────────────────────────────────

function MetricsSection() {
    return (
        <section id="metrics" className="relative py-24 px-6 bg-[#D4AF37]">
            {/* Inner subtle texturization */}
            <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }} />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
                    {METRICS.map((metric, i) => (
                        <AnimatedMetric key={metric.label} {...metric} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── About ──────────────────────────────────────────────────────

function AboutSection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="about" className="relative py-32 px-6 bg-[#08080a] overflow-hidden border-y border-white/[0.02]">
            {/* Diagonal striped background */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }} />

            {/* Ambient radial glow */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-[#D4AF37]/[0.06] rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
                className="max-w-6xl mx-auto"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Header + Description */}
                    <div>
                        <p className="text-[#D4AF37] text-sm uppercase tracking-[0.2em] font-bold mb-4">
                            Quiénes Somos
                        </p>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
                            Tu aliado estratégico en{" "}
                            <span className="text-[#D4AF37]">contabilidad</span>
                        </h2>
                        <p className="text-white/80 text-base leading-relaxed mb-6">
                            En Zechnas entendemos que la contabilidad y los impuestos pueden ser un dolor de cabeza para muchos empresarios. Nuestro propósito es transformar esa carga en una ventaja competitiva para tu negocio.
                        </p>
                        <p className="text-white/80 text-base leading-relaxed">
                            Con años de experiencia en múltiples sectores, nuestro equipo de especialistas está preparado para blindar tu patrimonio, optimizar tus recursos fiscales de forma legal y darte la claridad financiera que requieres. No somos solo contadores, somos tus socios estratégicos.
                        </p>
                    </div>

                    {/* Right: Values / Stats */}
                    <div className="grid grid-cols-2 gap-5">
                        {[
                            { value: "Valor", label: "Confianza", detail: "Transparencia total" },
                            { value: "Meta", label: "Excelencia", detail: "Calidad en cada proceso" },
                            { value: "Soporte", label: "Resolutivo", detail: "Atención personalizada" },
                            { value: "Foco", label: "Estrategia", detail: "Crecimiento de tu empresa" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="p-6 rounded-xl border border-white/20 bg-white/[0.02] hover:border-[#D4AF37]/20 transition-all duration-500"
                            >
                                <p className="text-3xl font-black text-[#D4AF37] mb-1">{item.value}</p>
                                <p className="text-white font-semibold text-base mb-1">{item.label}</p>
                                <p className="text-white/70 text-sm">{item.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

// ─── Image Parallax Showcase ────────────────────────────────────

function ImageShowcaseSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // Smooth transform mappings for parallax effects
    const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

    return (
        <section ref={containerRef} className="relative py-32 px-6 bg-[#040404] overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 h-[600px] md:h-[700px]">

                {/* Left Image (Slow scroll up) */}
                <motion.div
                    style={{ y: y1 }}
                    className="w-full md:w-1/3 h-[300px] md:h-[450px] rounded-3xl overflow-hidden border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                >
                    <div className="absolute inset-0 bg-black/20 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1554200876-56c2f25224fa?q=80&w=1200&auto=format&fit=crop"
                        alt="Estrategia financiera"
                        className="w-full h-full object-cover scale-110"
                    />
                </motion.div>

                {/* Center Main Image (Scroll down slightly) */}
                <motion.div
                    style={{ y: y2 }}
                    className="w-full md:w-5/12 h-[350px] md:h-[550px] rounded-3xl overflow-hidden border border-[#D4AF37]/30 shadow-[0_30px_60px_rgba(212,175,55,0.15)] z-20"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop"
                        alt="Reunión corporativa"
                        className="w-full h-full object-cover scale-105"
                    />
                    <div className="absolute bottom-8 left-8 z-20">
                        <p className="text-white font-bold text-xl mb-1">Análisis Profundo</p>
                        <p className="text-[#D4AF37] font-semibold text-sm tracking-widest uppercase">Zechnas Data</p>
                    </div>
                </motion.div>

                {/* Right Image (Fast scroll up) */}
                <motion.div
                    style={{ y: y3 }}
                    className="hidden md:block w-full md:w-1/3 h-[250px] md:h-[380px] rounded-3xl overflow-hidden border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                >
                    <div className="absolute inset-0 bg-black/30 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop"
                        alt="Documentos contables"
                        className="w-full h-full object-cover scale-110"
                    />
                </motion.div>

            </div>
        </section>
    );
}

// ─── Target Clients ─────────────────────────────────────────────

function TargetClientsSection() {
    return (
        <section id="clientes" className="relative py-32 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#060606] overflow-hidden">
            {/* Base ambient glow */}
            <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[500px] h-[400px] bg-[#D4AF37]/[0.04] rounded-full blur-[120px] pointer-events-none" />

            {/* DECORATIVE ELEMENTS (Yellow & White) */}
            {/* Slow rotating dashed ring (White) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{ willChange: "transform" }}
                className="absolute top-[10%] -left-[5%] w-[400px] h-[400px] border-2 border-white/20 rounded-full border-dashed pointer-events-none transform-gpu"
            />

            {/* Slow rotating dotted ring (Gold) */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                style={{ willChange: "transform" }}
                className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] border-[3px] border-[#D4AF37]/30 rounded-full border-solid pointer-events-none transform-gpu"
            />

            {/* Glowing floating dots */}
            <motion.div
                animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[25%] left-[15%] w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_20px_5px_rgba(255,255,255,0.7)] pointer-events-none"
            />
            <motion.div
                animate={{ y: [0, 20, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[35%] left-[8%] w-3 h-3 rounded-full bg-[#D4AF37] shadow-[0_0_20px_6px_rgba(212,175,55,0.8)] pointer-events-none"
            />
            <motion.div
                animate={{ y: [0, -15, 0], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-[15%] right-[25%] w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_15px_4px_rgba(212,175,55,0.8)] pointer-events-none"
            />
            <motion.div
                animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-[40%] right-[10%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_15px_3px_rgba(255,255,255,0.5)] pointer-events-none"
            />
            <motion.div
                animate={{ y: [0, 25, 0], scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-[20%] right-[30%] w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_15px_3px_rgba(212,175,55,0.6)] pointer-events-none"
            />
            <motion.div
                animate={{ x: [0, 15, 0], y: [0, 10, 0], opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="absolute top-[60%] left-[25%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.7)] pointer-events-none"
            />

            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Target className="w-5 h-5 text-[#D4AF37]" />
                        <p className="text-[#D4AF37] text-sm uppercase tracking-[0.2em] font-bold">
                            ¿A quiénes ayudamos?
                        </p>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                        Soluciones para cada etapa
                    </h2>
                    <p className="text-white/70 max-w-lg mx-auto text-base leading-relaxed">
                        Sin importar el tamaño de tu operación, contamos con la experiencia y
                        metodología para llevar tus finanzas al siguiente nivel.
                    </p>
                </div>

                {/* Client cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {TARGET_CLIENTS.map((client, i) => (
                        <TargetClientCard key={client.title} {...client} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Contact CTA ────────────────────────────────────────────────

function CTASection() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="contacto" className="relative py-32 px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/[0.2] via-[#050505] to-[#000000] overflow-hidden">
            {/* Additional texture overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                }}
            />
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-4xl mx-auto text-center relative"
            >
                {/* Background glow */}
                <div className="absolute inset-0 -m-12 rounded-2xl bg-gradient-to-b from-[#D4AF37]/5 to-transparent blur-xl pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Clock className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-[#D4AF37] text-sm uppercase tracking-[0.2em] font-bold">
                            Da el primer paso hoy
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
                        Deja de preocuparte por tus{" "}
                        <span className="text-[#D4AF37]">impuestos</span>
                    </h2>

                    <p className="text-white/70 max-w-xl mx-auto mb-10 text-base leading-relaxed">
                        Agenda una asesoría inicial sin costo para conocer las necesidades de tu negocio y presentarte un plan de trabajo a tu medida.
                    </p>

                    <a
                        href="mailto:contacto@zechnas.com"
                        className="group bg-[#D4AF37] text-black font-bold text-base uppercase tracking-[0.15em] px-12 py-4 rounded-lg
                       hover:bg-[#c9a430] transition-all duration-300 shadow-2xl shadow-[#D4AF37]/20 cursor-pointer inline-flex items-center gap-3"
                    >
                        <TrendingUp className="w-5 h-5" />
                        Agendar Asesoría
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </a>
                </div>
            </motion.div>
        </section>
    );
}

// ─── Footer ─────────────────────────────────────────────────────

function Footer() {
    return (
        <footer className="border-t border-[#D4AF37]/20 py-20 px-6 bg-[#D4AF37]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-black rounded">
                        <span className="text-[#D4AF37] font-black text-xs">Z</span>
                    </div>
                    <span className="text-black text-lg font-black tracking-widest">
                        ZECHNAS
                    </span>
                </div>

                {/* Links */}
                <div className="flex items-center gap-8">
                    <a href="#about" className="text-black/70 font-bold text-sm uppercase tracking-widest hover:text-black transition-colors">
                        Nosotros
                    </a>
                    <a href="#clientes" className="text-black/70 font-bold text-sm uppercase tracking-widest hover:text-black transition-colors">
                        Clientes
                    </a>
                    <a href="#metrics" className="text-black/70 font-bold text-sm uppercase tracking-widest hover:text-black transition-colors">
                        Resultados
                    </a>
                </div>

                {/* Copyright */}
                <p className="text-black/60 font-semibold text-xs">
                    &copy; {new Date().getFullYear()} Zechnas. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}

// ─── Main Component ─────────────────────────────────────────────

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#080808] to-[#050505] text-white scroll-smooth">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <MetricsSection />
            <AboutSection />
            <ImageShowcaseSection />
            <TargetClientsSection />
            <CTASection />
            <Footer />
        </div>
    );
}
