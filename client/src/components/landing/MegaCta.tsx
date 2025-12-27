import { motion } from 'framer-motion';
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function MegaCta() {
    return (
        <section className="py-20 px-8 max-w-[1400px] mx-auto z-10 relative">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-[48px] p-16 md:p-32 text-center relative overflow-hidden shadow-2xl"
            >
                <div className="absolute inset-0 opacity-30 pattern-bg"></div>

                <div className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 drop-shadow-md">
                        Ready to Transform Your Marketing?
                    </h2>
                    <p className="text-xl md:text-2xl text-white/90 max-w-[800px] mx-auto mb-12 font-medium leading-relaxed">
                        Join businesses that have multiplied their growth by 10x with AstroGrowth, worldwide
                    </p>
                    <Link href="/dashboard">
                        <button className="bg-white text-emerald-600 text-lg md:text-xl font-bold py-6 px-16 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300">
                            🚀 Start Free - No Credit Card Required
                        </button>
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
