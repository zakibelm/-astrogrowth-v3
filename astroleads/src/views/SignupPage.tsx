
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Rocket, Mail, Lock, ArrowRight, User, Briefcase } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/stores';

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const { signup, isLoading } = useAuthStore();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        companyName: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password || !formData.fullName) {
            setError('Veuillez remplir les champs obligatoires');
            return;
        }

        const success = await signup(formData.email, formData.password, {
            full_name: formData.fullName,
            company_name: formData.companyName
        });

        if (success) {
            navigate('/dashboard', { replace: true });
        } else {
            setError('Erreur lors de l\'inscription');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-astro-gold/10 border border-astro-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                        <Rocket className="text-astro-gold" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-white neon-text-glow-small">Créer un compte</h1>
                    <p className="text-neutral-500">Rejoignez l'élite de la prospection</p>
                </div>

                <div className="neon-glass-card p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Nom complet"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            leftIcon={<User size={18} />}
                        />

                        <Input
                            label="Entreprise"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Acme Corp"
                            leftIcon={<Briefcase size={18} />}
                        />

                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="vous@entreprise.com"
                            leftIcon={<Mail size={18} />}
                        />

                        <Input
                            label="Mot de passe"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            leftIcon={<Lock size={18} />}
                        />

                        {error && (
                            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                            rightIcon={<ArrowRight size={18} />}
                        >
                            S'inscrire
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-neutral-400">
                            Déjà un compte ?{' '}
                            <Link to="/login" className="text-astro-gold hover:text-white transition-colors">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
