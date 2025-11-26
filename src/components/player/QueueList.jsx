import React from "react";
import {
    X,
    Plus,
    ThumbsUp,
    Clock,
    RotateCcw,
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import { MOCK_HISTORY } from "../../data/mocks";

const QueueList = ({
    isHost,
    queueTab,
    setQueueTab,
    setShowManageModal,
    queue,
    moveTrack,
}) => {
    return (
        <div className="flex-1 space-y-4 pb-20">
            <div className="flex items-center justify-between px-2 mb-2">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setQueueTab("queue")}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${queueTab === "queue"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        File d'attente
                    </button>
                    <button
                        onClick={() => setQueueTab("history")}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${queueTab === "history"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Historique
                    </button>
                </div>

                {queueTab === "queue" && (
                    <button
                        onClick={() => isHost && setShowManageModal(true)}
                        className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                        {isHost ? "Gérer" : "Suggérer"}
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {queueTab === "queue" ? (
                    <>
                        {queue.slice(1).map((track, idx) => (
                            <div
                                key={track.id}
                                className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-50 shadow-sm animate-in fade-in"
                            >
                                <span className="text-slate-300 font-bold w-4 text-center">
                                    {idx + 1}
                                </span>
                                <div className={`w-12 h-12 rounded-xl ${track.cover}`}></div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-900 truncate">
                                        {track.title}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-slate-500 truncate">
                                            {track.artist}
                                        </p>
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">
                                            par {track.addedBy}
                                        </span>
                                    </div>
                                </div>
                                {isHost ? (
                                    <div className="flex items-center gap-1">
                                        <div className="flex flex-col">
                                            <button
                                                onClick={() => moveTrack(idx, -1)}
                                                disabled={idx === 0}
                                                className="p-1 text-slate-300 hover:text-indigo-600 disabled:opacity-30"
                                            >
                                                <ChevronUp size={16} />
                                            </button>
                                            <button
                                                onClick={() => moveTrack(idx, 1)}
                                                disabled={idx === queue.slice(1).length - 1}
                                                className="p-1 text-slate-300 hover:text-indigo-600 disabled:opacity-30"
                                            >
                                                <ChevronDown size={16} />
                                            </button>
                                        </div>
                                        <button className="text-slate-300 hover:text-red-500 p-2">
                                            <X size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <button
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-slate-400 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                                            title="Ajouter à ma bibliothèque"
                                        >
                                            <Plus size={18} />
                                        </button>
                                        <div className="w-px h-8 bg-gray-100"></div>
                                        <div className="flex flex-col items-center gap-0.5 min-w-[1.5rem]">
                                            <ThumbsUp
                                                size={16}
                                                className="text-green-500 fill-current"
                                            />
                                            <span className="text-xs font-bold text-slate-600">
                                                {track.votes}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add Button Placeholder */}
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors">
                            <Plus size={24} />
                            <span className="text-sm font-medium">Ajouter un titre</span>
                        </div>
                    </>
                ) : (
                    /* HISTORY VIEW */
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        {MOCK_HISTORY.map((track) => (
                            <div
                                key={track.id}
                                className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl border border-transparent"
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl ${track.cover} opacity-80 grayscale-[0.3]`}
                                ></div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-700 truncate">
                                        {track.title}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-slate-400 truncate">
                                            {track.artist}
                                        </p>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded-md shadow-sm">
                                            <Clock size={10} />
                                            <span>{track.playedAt}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-400 hover:text-indigo-600 shadow-sm transition-colors"
                                        title="Rejouer"
                                    >
                                        <RotateCcw size={16} />
                                    </button>
                                    <button
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-400 hover:text-pink-500 shadow-sm transition-colors"
                                        title="Sauvegarder"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="text-center py-4">
                            <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
                                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                                Début de la session : 22:00
                                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QueueList;
