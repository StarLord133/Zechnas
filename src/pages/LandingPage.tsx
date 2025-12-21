import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

const THEME = {
    black: "#000000",
    gold: "#D4AF37",
    white: "#F5F5F5",
};

const Typewriter = () => {
    const words = ["BLACK", "WHITE", "GOLD"];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const typeSpeed = isDeleting ? 50 : 150;
        const word = words[currentWordIndex];

        const timer = setTimeout(() => {
            if (!isDeleting && text === word) {
                setTimeout(() => setIsDeleting(true), 1500); // Pause at full word
            } else if (isDeleting && text === "") {
                setIsDeleting(false);
                setCurrentWordIndex((prev) => (prev + 1) % words.length);
            } else {
                setText(word.substring(0, isDeleting ? text.length - 1 : text.length + 1));
            }
        }, typeSpeed);

        return () => clearTimeout(timer);
    }, [text, isDeleting, currentWordIndex]);

    return (
        <span style={{ color: THEME.gold }} className="inline-block min-w-[5ch]">
            {text}
            <span className="animate-pulse">|</span>
        </span>
    );
};

const TexturedBackground = () => (
    <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#000000]" />

        {/* Gold Mesh Gradient - Top Right */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#D4AF37] rounded-full blur-[150px] opacity-[0.03]" />

        {/* Blue/Grey Cold Spot - Bottom Left */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1c1c1c] rounded-full blur-[150px] opacity-[0.4]" />

        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
    </div>
)

const FloatingHeader = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-20 flex justify-between items-center">
                <div className="text-xl font-bold tracking-tighter text-white">
                    ZECHNAS<span className="text-[#D4AF37]">.</span>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-2 bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 text-xs uppercase tracking-widest text-[#D4AF37] rounded-sm"
                >
                    Dashboard
                </button>
            </div>
        </motion.header>
    );
};

const Hero = () => {
    // Smooth scroll parallax for hero content
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section
            className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center z-10"
        >
            {/* Dynamic Background */}
            {/* Parallax Background Image */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{
                    y: useTransform(scrollY, [0, 1000], [0, 400]),
                    scale: useTransform(scrollY, [0, 1000], [1, 1.2]),
                }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop)',
                    }}
                />
                <div className="absolute inset-0 bg-black/70" /> {/* Contrast Overlay */}
            </motion.div>

            <motion.div
                className="z-10 text-center select-none flex flex-col items-center gap-6"
                style={{ y: y1, opacity }}
            >
                {/* Confidence Badge */}
                <div className="px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 backdrop-blur-md mb-2">
                    <span className="text-[#D4AF37] text-xs uppercase tracking-[0.2em] font-medium">Somos tus contadores de confianza</span>
                </div>

                <div>
                    <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-4" style={{ color: THEME.white }}>
                        ZECHNAS
                    </h1>
                    <div className="text-2xl md:text-4xl font-light tracking-widest uppercase">
                        <Typewriter />
                    </div>
                </div>

                {/* Social Proof */}
                <div className="mt-8 flex flex-col items-center gap-2">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                        ))}
                    </div>
                    <p className="text-white/60 text-sm font-light">
                        <span className="text-white font-medium">500+ Empresas</span> confían en nuestros análisis
                    </p>
                </div>
            </motion.div>

            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 text-sm animate-bounce"
                style={{ opacity }}
            >
                SCROLL TO EXPLORE
            </motion.div>
        </section>
    );
};

const About = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
    const y = useTransform(smoothProgress, [0, 1], [100, -100]);
    const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(smoothProgress, [0, 0.2], [0.8, 1]);

    return (
        <section ref={ref} className="min-h-screen w-full flex items-center justify-center py-20 px-4 md:px-20 relative overflow-hidden z-10">
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <motion.div style={{ opacity, x: useTransform(smoothProgress, [0, 0.5], [-50, 0]), scale }}>
                    <h2 className="text-4xl md:text-6xl font-bold mb-8" style={{ color: THEME.white }}>
                        Precision in <span style={{ color: THEME.gold }}>Finance</span>.
                    </h2>
                    <p className="text-lg md:text-xl leading-relaxed text-white/80 font-light">
                        At Zechnas, we redefine the architecture of wealth. Our approach combines rigorous analytical precision with creative financial strategies, delivering bespoke solutions for the modern enterprise. We don't just account; we anticipate.
                    </p>
                </motion.div>

                <div className="relative h-[60vh] w-full overflow-hidden rounded-sm border border-white/5">
                    <motion.div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop)',
                            scale: 1.2,
                            y
                        }}
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>
            </div>
        </section>
    );
};

const ServiceCard = ({ title, description, index }: { title: string, description: string, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="group relative p-10 border border-white/10 hover:border-[#D4AF37] transition-colors duration-500 bg-white/5 backdrop-blur-sm"
        >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-2xl font-bold mb-4" style={{ color: THEME.white }}>{title}</h3>
            <p className="text-white/60 font-light">{description}</p>
        </motion.div>
    )
}

// --- New Sections ---

const WorkProtocol = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start center", "end center"]
    });

    const steps = [
        { num: "01", title: "Discovery", desc: "Understanding the core architecture of your finances." },
        { num: "02", title: "Analysis", desc: "Rigorous stress-testing of current fiscal strategies." },
        { num: "03", title: "Execution", desc: "Deployment of optimized tax and audit frameworks." },
        { num: "04", title: "Monitor", desc: "Continuous monitoring and adaptive recalibration." }
    ];

    return (
        <section ref={ref} className="py-32 px-4 md:px-20 relative overflow-hidden z-10 bg-[#0a0a0a] border-y border-white/5">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-10%" }}
                className="text-4xl md:text-5xl font-bold mb-24 text-center text-white"
            >
                The Protocol
            </motion.h2>

            <div className="max-w-4xl mx-auto relative pl-12 md:pl-0">
                {/* Vertical Lines */}
                <div className="absolute left-[7px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2" />
                <motion.div
                    style={{ scaleY: scrollYProgress }}
                    className="absolute left-[7px] md:left-1/2 top-0 bottom-0 w-[1px] bg-[#D4AF37] -translate-x-1/2 origin-top z-10"
                />

                <div className="space-y-24">
                    {steps.map((step, i) => (
                        <StepItem key={i} step={step} index={i} />
                    ))}
                </div>
            </div>
        </section>
    )
}

const StepItem = ({ step, index }: { step: any, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0.2 }}
            whileInView={{ opacity: 1 }}
            viewport={{ margin: "-20% 0px -20% 0px" }}
            transition={{ duration: 0.5 }}
            className={`relative flex flex-col md:flex-row gap-8 md:gap-24 items-start ${index % 2 === 0 ? 'md:text-right md:flex-row-reverse' : ''}`}
        >
            {/* Dot Indicator */}
            <motion.div
                className="absolute left-[-42px] md:left-1/2 top-0 w-3 h-3 rounded-full bg-black border border-white/20 -translate-x-1/2 z-20"
                whileInView={{ borderColor: "#D4AF37", backgroundColor: "#D4AF37" }}
                viewport={{ margin: "-20% 0px -20% 0px" }}
            />

            <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                <motion.span
                    className="text-6xl font-black text-white/10 block mb-2"
                    whileInView={{ color: "#D4AF37", opacity: 0.5 }}
                    viewport={{ margin: "-20% 0px -20% 0px" }}

                >
                    {step.num}
                </motion.span>
                <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/60 font-light">{step.desc}</p>
            </div>
            <div className="flex-1 hidden md:block" />
        </motion.div>
    )
}

const BentoItem = ({ title, industry, className }: { title: string, industry: string, className?: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className={`group relative overflow-hidden border border-white/10 bg-white/5 p-8 flex flex-col justify-end transition-all duration-500 hover:border-[#D4AF37]/50 ${className}`}
        >
            {/* Metallic Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 ease-in-out" />
            </div>

            <div className="absolute top-4 right-4 text-white/20 text-xs tracking-widest uppercase border border-white/10 px-2 py-1 rounded-full group-hover:text-[#D4AF37] group-hover:border-[#D4AF37]/30 transition-colors">
                {industry}
            </div>

            <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">{title}</h3>
                <div className="h-[1px] w-12 bg-white/20 group-hover:w-full group-hover:bg-[#D4AF37] transition-all duration-500" />
            </div>
        </motion.div>
    )
}

const Specialization = () => {
    return (
        <section className="py-32 px-4 md:px-20 relative z-10 bg-[#0c0c0c] overflow-hidden">
            {/* Architectural Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-white max-w-xl">
                        Curated Sectors of <span style={{ color: THEME.gold }}>Excellence</span>.
                    </h2>
                    <p className="text-white/50 max-w-xs text-sm">
                        Specialized methodologies tailored for high-stakes industries.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[800px] md:h-[600px]">
                    <BentoItem
                        title="Real Estate"
                        industry="Assets"
                        className="md:col-span-2 md:row-span-2 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-blend-overlay bg-black/80"
                    />
                    <BentoItem
                        title="Technology"
                        industry="Innovation"
                        className="md:col-span-2 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-blend-overlay bg-black/80"
                    />
                    <BentoItem
                        title="Wealth Mgmt"
                        industry="Private"
                        className="md:col-span-1 bg-[url('https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2064&auto=format&fit=crop')] bg-cover bg-blend-overlay bg-black/80"
                    />
                    <BentoItem
                        title="Energy"
                        industry="Industrial"
                        className="md:col-span-1 bg-[url('https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-blend-overlay bg-black/80"
                    />
                </div>
            </div>
        </section>
    )
}

const Services = () => {
    return (
        <section className="min-h-screen w-full py-24 px-4 md:px-20 flex flex-col justify-center relative z-10">
            <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ margin: "-10%" }}
                className="text-4xl md:text-6xl font-bold mb-20 text-center"
                style={{ color: THEME.white }}
            >
                Our Expertise
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
                <ServiceCard
                    index={0}
                    title="Strategic Tax"
                    description="Optimizing liabilities through advanced regulatory foresight and structural planning."
                />
                <ServiceCard
                    index={1}
                    title="Global Audit"
                    description="Uncompromising verification ensuring absolute transparency and stakeholder confidence."
                />
                <ServiceCard
                    index={2}
                    title="Advisory"
                    description="Data-driven insights to navigate complex mergers, acquisitions, and market expansions."
                />
            </div>
        </section>
    )
}

const MetricItem = ({ value, label, variant = "dark" }: { value: string, label: string, variant?: "dark" | "light" }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Animate opacity based on visibility percentage
    const opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0]);
    const scale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.8, 1, 0.8]);

    const textColor = variant === "light" ? "text-black" : "text-[#D4AF37]";
    const labelColor = variant === "light" ? "text-black/60" : "text-white/50";

    return (
        <motion.div
            ref={ref}
            style={{ opacity, scale }}
            className="flex flex-col items-center justify-center text-center p-10"
        >
            <div className={`text-6xl md:text-8xl font-black mb-2 ${textColor}`}>
                {value}
            </div>
            <div className={`text-xl uppercase tracking-widest ${labelColor}`}>{label}</div>
        </motion.div>
    )
}

const Metrics = () => {
    return (
        <section className="h-[70vh] w-full flex items-center justify-center relative z-10 bg-[#D4AF37] text-black">
            {/* Decorative pattern for gold section */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-7xl relative z-20">
                <MetricItem value="15+" label="Years Experience" variant="light" />
                <MetricItem value="$2B+" label="Assets Audited" variant="light" />
                <MetricItem value="500+" label="Global Clients" variant="light" />
            </div>
        </section>
    )
}

export default function LandingPage() {
    return (
        <div className="bg-black w-full overflow-x-hidden selection:bg-[#D4AF37] selection:text-black relative">
            <TexturedBackground />
            <FloatingHeader />
            <Hero />
            <About />
            <Specialization />
            <WorkProtocol />
            <Services />
            <Metrics />
            <footer className="py-10 text-center text-white/20 text-sm border-t border-white/5">
                &copy; {new Date().getFullYear()} ZECHNAS. All Rights Reserved.
            </footer>
        </div>
    );
}
