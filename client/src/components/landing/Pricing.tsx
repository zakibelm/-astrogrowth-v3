import { motion } from 'framer-motion';
import { Link } from "wouter";

export default function Pricing() {
    return (
        <section className="section py-32 px-8 max-w-[1400px] mx-auto z-10 relative" id="pricing">
            <div className="text-center mb-20">
                <div className="inline-block bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-600 px-6 py-3 rounded-full font-bold mb-6">
                    💰 Simple Pricing
                </div>
                <h2 className="section-title">
                    Choose your <span className="text-gradient">Perfect Plan</span>
                </h2>
                <p className="text-xl text-gray-500 max-w-[700px] mx-auto">
                    Transparent, accessible pricing for businesses of all sizes
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1200px] mx-auto">
                {/* Starter Plan */}
                <motion.div
                    whileHover={{ y: -20 }}
                    className="bg-white rounded-[32px] p-12 shadow-xl border border-black/5 relative overflow-hidden"
                >
                    <h3 className="text-2xl font-extrabold mb-6 text-gray-900">Starter</h3>
                    <div className="mb-2">
                        <span className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-emerald-500 to-blue-500">$499</span>
                        <span className="text-gray-400 text-lg">/month</span>
                    </div>

                    <ul className="feature-list space-y-4 mb-12 mt-8">
                        <li className="flex items-center gap-4 text-gray-600 font-medium">10 active AI agents</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">500 leads/month</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">50 content pieces/month</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">2 LinkedIn accounts</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Email support</li>
                    </ul>

                    <Link href="/dashboard">
                        <button className="w-full py-4 rounded-full font-bold text-lg bg-gray-100 text-gray-900 hover:bg-emerald-500/10 hover:text-emerald-600 hover:-translate-y-1 transition-all">
                            Get Started
                        </button>
                    </Link>
                </motion.div>

                {/* Professional Plan */}
                <motion.div
                    whileHover={{ y: -30, scale: 1.05 }}
                    className="bg-white rounded-[32px] p-12 shadow-2xl border-4 border-emerald-500/20 relative overflow-hidden transform scale-105 z-10"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-2 rounded-b-xl font-bold text-sm shadow-lg">
                        🔥 POPULAR
                    </div>

                    <h3 className="text-2xl font-extrabold mb-6 text-gray-900 mt-4">Professional</h3>
                    <div className="mb-2">
                        <span className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-emerald-500 to-blue-500">$999</span>
                        <span className="text-gray-400 text-lg">/month</span>
                    </div>

                    <ul className="feature-list space-y-4 mb-12 mt-8">
                        <li className="flex items-center gap-4 text-gray-600 font-medium">48 active AI agents</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">2,000 leads/month</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">200 content pieces/month</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">10 LinkedIn accounts</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">24/7 priority support</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Custom training</li>
                    </ul>

                    <Link href="/dashboard">
                        <button className="w-full py-4 rounded-full font-bold text-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all">
                            Start Now
                        </button>
                    </Link>
                </motion.div>

                {/* Enterprise Plan */}
                <motion.div
                    whileHover={{ y: -20 }}
                    className="bg-white rounded-[32px] p-12 shadow-xl border border-black/5 relative overflow-hidden"
                >
                    <h3 className="text-2xl font-extrabold mb-6 text-gray-900">Enterprise</h3>
                    <div className="mb-2">
                        <span className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-emerald-500 to-blue-500">Custom</span>
                        <span className="text-gray-400 text-lg">/tailored</span>
                    </div>

                    <ul className="feature-list space-y-4 mb-12 mt-8">
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Unlimited AI agents</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Unlimited leads</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Unlimited content</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Unlimited accounts</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Dedicated account manager</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">99.9% SLA guaranteed</li>
                        <li className="flex items-center gap-4 text-gray-600 font-medium">Custom integrations</li>
                    </ul>

                    <Link href="/dashboard">
                        <button className="w-full py-4 rounded-full font-bold text-lg bg-gray-100 text-gray-900 hover:bg-emerald-500/10 hover:text-emerald-600 hover:-translate-y-1 transition-all">
                            Contact Us
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
