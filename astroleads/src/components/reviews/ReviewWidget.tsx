/**
 * Review Widget Component
 * Triggered after user gets first qualified lead
 * Incentivizes reviews with 1 month free offer
 */

import React, { useState } from 'react';
import { Star, Gift, X } from 'lucide-react';
import { Button, Modal, ModalBody, Textarea } from '@/components/ui';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui';

interface ReviewWidgetProps {
    isOpen: boolean;
    onClose: () => void;
    trigger?: 'firstQualifiedLead' | 'milestone' | 'manual';
}

export const ReviewWidget: React.FC<ReviewWidgetProps> = ({ isOpen, onClose, trigger = 'firstQualifiedLead' }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.warning('Veuillez sélectionner une note');
            return;
        }

        if (!reviewText.trim()) {
            toast.warning('Veuillez écrire un avis');
            return;
        }

        setIsSubmitting(true);

        try {
            // Save review to database
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error('Vous devez être connecté pour laisser un avis');
                return;
            }

            const { error } = await supabase
                .from('reviews')
                .insert({
                    user_id: user.id,
                    rating,
                    text: reviewText,
                    trigger,
                    incentive_claimed: false
                });

            if (error) throw error;

            toast.success('Merci pour votre avis!', 'Vous recevrez 1 mois gratuit dans les 24h');
            onClose();
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Erreur lors de la soumission');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getMessage = () => {
        switch (trigger) {
            case 'firstQualifiedLead':
                return {
                    title: '🎉 Félicitations pour votre premier lead qualifié!',
                    subtitle: 'Aidez-nous à faire découvrir AstroLeads'
                };
            case 'milestone':
                return {
                    title: '🚀 Vous avez atteint un jalon important!',
                    subtitle: 'Partagez votre expérience avec la communauté'
                };
            default:
                return {
                    title: '⭐ Votre avis compte',
                    subtitle: 'Aidez-nous à améliorer AstroLeads'
                };
        }
    };

    const message = getMessage();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
            <ModalBody className="space-y-6">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">{message.title}</h3>
                    <p className="text-neutral-400">{message.subtitle}</p>
                </div>

                {/* Incentive banner */}
                <div className="bg-gradient-to-r from-astro-gold/20 to-yellow-500/20 border border-astro-gold/30 rounded-xl p-4 flex items-center gap-3">
                    <Gift className="w-8 h-8 text-astro-gold flex-shrink-0" />
                    <div>
                        <p className="text-white font-semibold">Recevez 1 mois gratuit!</p>
                        <p className="text-sm text-neutral-400">En laissant un avis, vous débloquez 1 mois d'accès Premium</p>
                    </div>
                </div>

                {/* Rating stars */}
                <div>
                    <label className="block text-sm font-medium text-white mb-3">
                        Comment évalueriez-vous AstroLeads?
                    </label>
                    <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    size={40}
                                    className={`${star <= (hoverRating || rating)
                                        ? 'fill-astro-gold text-astro-gold'
                                        : 'text-neutral-600'
                                        } transition-colors`}
                                />
                            </button>
                        ))}
                    </div>
                    {rating > 0 && (
                        <p className="text-center text-neutral-400 text-sm mt-2">
                            {rating === 5 && '⭐ Excellent!'}
                            {rating === 4 && '😊 Très bon'}
                            {rating === 3 && '👍 Bon'}
                            {rating === 2 && '😐 Moyen'}
                            {rating === 1 && '😞 À améliorer'}
                        </p>
                    )}
                </div>

                {/* Review text */}
                <div>
                    <label className="block text-sm font-medium text-white mb-2">
                        Qu'est-ce que vous aimez le plus? *
                    </label>
                    <Textarea
                        placeholder="Ex: La qualité des leads, le scoring intelligent, l'intégration facile..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={4}
                        className="w-full"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                        Votre avis pourrait apparaître publiquement sur notre site
                    </p>
                </div>

                {/* Submit button */}
                <Button
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    disabled={rating === 0 || !reviewText.trim()}
                    className="w-full"
                >
                    Soumettre mon avis et recevoir 1 mois gratuit
                </Button>

                {/* Additional links */}
                <div className="text-center space-y-2">
                    <p className="text-xs text-neutral-500">
                        Vous pouvez aussi laisser un avis sur:
                    </p>
                    <div className="flex gap-3 justify-center">
                        <a
                            href="https://www.g2.com/products/astroleads/reviews"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-astro-gold hover:underline"
                        >
                            G2 →
                        </a>
                        <a
                            href="https://www.capterra.com/p/astroleads/reviews/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-astro-gold hover:underline"
                        >
                            Capterra →
                        </a>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

/**
 * Hook to trigger review widget at appropriate moments
 */
export const useReviewTrigger = () => {
    const [showReview, setShowReview] = useState(false);
    const [trigger, setTrigger] = useState<'firstQualifiedLead' | 'milestone' | 'manual'>('manual');

    const checkAndTriggerReview = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Check if user has already left a review
            const { data: existingReview } = await supabase
                .from('reviews')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (existingReview) return; // Already reviewed

            // Check if user has qualified leads
            const { data: leads } = await supabase
                .from('leads')
                .select('id, score')
                .gte('score', 80)
                .limit(1);

            if (leads && leads.length > 0) {
                setTrigger('firstQualifiedLead');
                setShowReview(true);
            }
        } catch (error) {
            console.error('Error checking review trigger:', error);
        }
    };

    return {
        showReview,
        setShowReview,
        trigger,
        checkAndTriggerReview
    };
};
