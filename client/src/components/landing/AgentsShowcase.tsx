import { motion } from 'framer-motion';

export default function AgentsShowcase() {
    const agents = [
        { emoji: '🎨', name: 'Content Genius', role: 'Content Creation', desc: 'Generates personalized, engaging marketing content in all major world languages' },
        { emoji: '🔎', name: 'Lead Hunter', role: 'Smart Prospecting', desc: 'Automatically finds and qualifies the best prospects for your business' },
        { emoji: '📱', name: 'Social Publisher', role: 'Auto Distribution', desc: 'Publishes your content at optimal times across all social networks' },
        { emoji: '📊', name: 'Analytics Pro', role: 'Continuous Optimization', desc: 'Analyzes performance and automatically optimizes your marketing campaigns' },
        { emoji: '🎯', name: 'Campaign Manager', role: 'Complete Orchestration', desc: 'Coordinates all your agents to create coherent, effective marketing campaigns' },
        { emoji: '💡', name: 'Strategy Advisor', role: 'Strategic Insights', desc: 'Analyzes your market and recommends the best strategies to achieve your goals' },
    ];

    return (
        <section className="section py-32 px-8 max-w-[1400px] mx-auto z-10 relative" id="agents">
            <div className="text-center mb-20">
                <div className="inline-block bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-600 px-6 py-3 rounded-full font-bold mb-6">
                    🤖 Artificial Intelligence
                </div>
                <h2 className="section-title">
                    Meet your <span className="text-gradient">AI Agents</span>
                </h2>
                <p className="text-xl text-gray-500 max-w-[700px] mx-auto">
                    48 specialized agents working together to automate your marketing
                </p>
            </div>

            <div className="agents-grid">
                {agents.map((agent, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -20, scale: 1.05 }}
                        className="agent-card group"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="agent-emoji group-hover:scale-125 group-hover:rotate-[360deg] transition-transform duration-500">{agent.emoji}</div>
                        <h3 className="text-2xl font-extrabold mb-3 text-gray-900 group-hover:text-emerald-600 transition-colors">{agent.name}</h3>
                        <p className="text-emerald-500 font-bold mb-6">{agent.role}</p>
                        <p className="text-gray-500 leading-relaxed">
                            {agent.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
