import React from "react";
import { X, ScanLine, ArrowLeft, Keyboard, Play } from "lucide-react";
import Avatar from "../ui/Avatar";
import { MOCK_FRIENDS } from "../../data/mocks";

const JoinModal = ({ setShowJoinModal, joinRoom }) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-md transition-all duration-300 animate-in fade-in"
            onClick={() => setShowJoinModal(false)}
        >
            <div
                className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Rejoindre</h2>
                    <button
                        onClick={() => setShowJoinModal(false)}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-slate-500"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="space-y-6">
                    {/* Option 1: Scanner */}
                    <button
                        onClick={joinRoom}
                        className="w-full bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between group hover:bg-slate-800 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-white/10 p-3 rounded-xl">
                                <ScanLine size={24} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-lg">Scanner un QR</h3>
                                <p className="text-slate-400 text-xs">Utiliser la caméra</p>
                            </div>
                        </div>
                        <ArrowLeft className="rotate-180 text-slate-500 group-hover:text-white transition-colors" />
                    </button>

                    {/* Option 2: Code Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                            <Keyboard size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Entrer le code de la room..."
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl pl-12 pr-4 py-4 font-medium text-slate-900 outline-none transition-all"
                        />
                        <button
                            onClick={joinRoom}
                            className="absolute inset-y-2 right-2 bg-indigo-50 text-indigo-600 px-4 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors"
                        >
                            Go
                        </button>
                    </div>

                    <div className="w-full h-px bg-gray-100"></div>

                    {/* Option 3: Amis actifs */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
                            Amis en écoute
                        </h3>
                        <div className="space-y-2">
                            {MOCK_FRIENDS.filter((f) => f.inRoom).map((friend) => (
                                <div
                                    key={friend.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-50 hover:border-indigo-100 hover:bg-white transition-all cursor-pointer"
                                    onClick={joinRoom}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar name={friend.name} color={friend.avatar} size="sm" />
                                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-bold text-sm text-slate-900">
                                                {friend.name}
                                            </h4>
                                            <p className="text-[10px] text-slate-500">
                                                Soirée Samedi
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-2 rounded-full text-indigo-500 shadow-sm">
                                        <Play size={14} fill="currentColor" />
                                    </div>
                                </div>
                            ))}
                            {MOCK_FRIENDS.filter((f) => f.inRoom).length === 0 && (
                                <p className="text-center text-sm text-slate-400 py-2">
                                    Aucun ami actif pour le moment.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinModal;
