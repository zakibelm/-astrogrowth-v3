export default function Footer() {
    return (
        <footer className="bg-white pt-24 pb-12 border-t border-black/5 relative z-10">
            <div className="max-w-[1400px] mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-20">
                    <div className="md:col-span-2">
                        <h3 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-600">
                            AstroGrowth
                        </h3>
                        <p className="text-gray-500 text-lg leading-relaxed mb-8">
                            The AI-powered marketing automation platform for all businesses. From prospecting to conversion on autopilot, worldwide.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-8">Product</h4>
                        <ul className="space-y-4">
                            <li><a href="#features" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">Features</a></li>
                            <li><a href="#agents" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">AI Agents</a></li>
                            <li><a href="#pricing" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">Pricing</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">Integrations</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-8">Resources</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">Documentation</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">Blog</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">Case Studies</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">Support</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-8">Company</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">About</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">Careers</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">Contact</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">Legal</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-black/5 pt-12 text-center">
                    <p className="text-gray-500 font-medium">
                        © 2025 AstroGrowth. Powered by <strong className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500">Zakibelm</strong> 🚀
                    </p>
                </div>
            </div>
        </footer>
    );
}
