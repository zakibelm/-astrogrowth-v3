import { motion } from 'framer-motion';

export default function Features() {
    return (
        <section className="section py-32 px-8 max-w-[1400px] mx-auto z-10 relative" id="features">
            <div className="text-center mb-20">
                <div className="inline-block bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-600 px-6 py-3 rounded-full font-bold mb-6">
                    🎯 Complete Automation
                </div>
                <h2 className="section-title">
                    Everything you need to<br />
                    <span className="text-gradient">dominate your market</span>
                </h2>
                <p className="text-xl text-gray-500 max-w-[700px] mx-auto">
                    A comprehensive platform managing every aspect of your digital marketing, end-to-end
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
                <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-[32px] p-12 shadow-sm border border-black/5 md:col-span-8"
                >
                    <div className="text-6xl mb-8">🔍</div>
                    <h3 className="text-3xl font-bold mb-6 text-gray-900">AstroLeads</h3>
                    <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                        Automated lead generation with Google Maps scraping and intelligent enrichment worldwide
                    </p>
                    <ul className="feature-list space-y-4">
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Automatic Google Maps scraping</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Smart data enrichment</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Prospect validation & scoring</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Integrated CRM export</li>
                    </ul>
                </motion.div>

                <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-[32px] p-12 shadow-sm border border-black/5 md:col-span-4"
                >
                    <div className="text-6xl mb-8">✨</div>
                    <h3 className="text-3xl font-bold mb-6 text-gray-900">AstroMedia</h3>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        AI-powered professional marketing content creation, ready to publish in seconds
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-[32px] p-12 shadow-sm border border-black/5 md:col-span-6"
                >
                    <div className="text-6xl mb-8">💼</div>
                    <h3 className="text-3xl font-bold mb-6 text-gray-900">LinkedIn Distribution</h3>
                    <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                        Smart automatic LinkedIn publishing with optimized timing
                    </p>
                    <ul className="feature-list space-y-4">
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Scheduled auto-publishing</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Timing optimization</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Multi-account management</li>
                    </ul>
                </motion.div>

                <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-[32px] p-12 shadow-sm border border-black/5 md:col-span-6"
                >
                    <div className="text-6xl mb-8">🤖</div>
                    <h3 className="text-3xl font-bold mb-6 text-gray-900">48 Specialized AI Agents</h3>
                    <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                        A complete AI team working 24/7 to grow your business
                    </p>
                    <ul className="feature-list space-y-4">
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Content creation genius</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Lead hunting specialist</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Distribution publisher</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Continuous optimization</li>
                    </ul>
                </motion.div>
            </div>
        </section>
    );
}
