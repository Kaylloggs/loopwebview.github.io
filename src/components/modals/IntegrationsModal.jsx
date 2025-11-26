import React from "react";
import { X, Wifi, Music, Radio, Youtube } from "lucide-react";

const IntegrationsModal = ({ setShowIntegrationsModal }) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-md transition-all duration-300 animate-in fade-in"
            onClick={() => setShowIntegrationsModal(false)}
        >
            <div
                className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Services de Musique
                    </h2>
                    <button
                        onClick={() => setShowIntegrationsModal(false)}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-slate-500"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="space-y-4">
                    {/* Spotify */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center text-white shadow-lg shadow-green-200">
                                <Wifi size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Spotify</h4>
                                <p className="text-xs text-green-600 font-medium">Connecté</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-white border border-gray-200 text-slate-900 text-xs font-bold rounded-full">
                            Gérer
                        </button>
                    </div>

                    {/* Apple Music */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#FC3C44] flex items-center justify-center text-white">
                                <Music size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Apple Music</h4>
                                <p className="text-xs text-slate-400">Non connecté</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full">
                            Lier
                        </button>
                    </div>

                    {/* Deezer */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
                                <Radio size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Deezer</h4>
                                <p className="text-xs text-slate-400">Non connecté</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full">
                            Lier
                        </button>
                    </div>

                    {/* YouTube Music */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center text-white">
                                <Youtube size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">YouTube Music</h4>
                                <p className="text-xs text-slate-400">Non connecté</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full">
                            Lier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntegrationsModal;
