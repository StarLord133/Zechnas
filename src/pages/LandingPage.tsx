import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

const Hero = () => {
    const navigate = useNavigate();
    // Smooth scroll parallax for hero content
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section
            className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center"
            style={{ backgroundColor: THEME.black }}
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
                className="z-10 text-center select-none"
                style={{ y: y1, opacity }}
            >
                <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-6" style={{ color: THEME.white }}>
                    ZECHNAS
                </h1>
                <div className="text-2xl md:text-4xl font-light tracking-widest uppercase">
                    <Typewriter />
                </div>
            </motion.div>

            <motion.button
                onClick={() => navigate('/dashboard')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mt-12 px-8 py-3 bg-transparent border border-[#cca935] text-[#cca935] hover:bg-[#cca935] hover:text-black transition-all duration-300 tracking-widest uppercase text-sm z-20"
            >
                Dashboard Access
            </motion.button>

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
        <section ref={ref} className="min-h-screen w-full flex items-center justify-center py-20 px-4 md:px-20 relative overflow-hidden" style={{ backgroundColor: THEME.black }}>
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

const Services = () => {
    return (
        <section className="min-h-screen w-full py-24 px-4 md:px-20 flex flex-col justify-center" style={{ backgroundColor: THEME.black }}>
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

const MetricItem = ({ value, label }: { value: string, label: string }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Animate opacity based on visibility percentage
    const opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0]);
    const scale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.8, 1, 0.8]);

    return (
        <motion.div
            ref={ref}
            style={{ opacity, scale }}
            className="flex flex-col items-center justify-center text-center p-10"
        >
            <div className="text-6xl md:text-8xl font-black mb-2" style={{ color: THEME.gold }}>
                {value}
            </div>
            <div className="text-xl uppercase tracking-widest text-white/50">{label}</div>
        </motion.div>
    )
}

const Metrics = () => {
    return (
        <section className="h-screen w-full flex items-center justify-center" style={{ backgroundColor: THEME.black }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-7xl">
                <MetricItem value="15+" label="Years Experience" />
                <MetricItem value="$2B+" label="Assets Audited" />
                <MetricItem value="500+" label="Global Clients" />
            </div>
        </section>
    )
}

export default function LandingPage() {
    return (
        <div className="bg-black w-full overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
            <Hero />
            <About />
            <Services />
            <Metrics />
            <footer className="py-10 text-center text-white/20 text-sm border-t border-white/5">
                &copy; {new Date().getFullYear()} ZECHNAS. All Rights Reserved.
            </footer>
        </div>
    );
}
