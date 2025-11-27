import React from "react";
import { X, Check, Store, Star, Shield, Zap } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

const SubscriptionModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header with Gradient */}
                <div className="relative h-32 bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
                    >
                        <X size={20} />
                    </button>
                    <div className="text-center text-white">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Store className="text-yellow-300 fill-yellow-300" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold">Mode Kiosque</h2>
                        <p className="text-indigo-100 text-sm font-medium">Passez au niveau supérieur</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Capacité Étendue</h3>
                                <p className="text-sm text-slate-500">Jusqu'à 35 participants simultanés dans votre room.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                                <Shield size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Contrôle Total</h3>
                                <p className="text-sm text-slate-500">Outils de modération avancés et gestion des priorités.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-pink-50 text-pink-600 rounded-xl">
                                <Star size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Badge Pro</h3>
                                <p className="text-sm text-slate-500">Un badge exclusif sur votre profil et vos rooms.</p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
                        <p className="text-slate-500 text-sm mb-1">Abonnement Mensuel</p>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-3xl font-bold text-slate-900">9.99€</span>
                            <span className="text-slate-500">/mois</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Annulable à tout moment</p>
                    </div>

                    <Button
                        onClick={() => alert("Redirection vers la page de paiement...")}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200"
                    >
                        Commencer l'essai gratuit
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionModal;
