import React from "react";
import {
    ArrowLeft,
    QrCode,
    Disc,
    Radio,
    SkipBack,
    Pause,
    Play,
    SkipForward,
    MoreHorizontal,
    ThumbsUp,
} from "lucide-react";

const Player = ({
    isHost,
    isPlaying,
    setIsPlaying,
    currentSongIndex,
    setCurrentSongIndex,
    queue,
    goHome,
    setShowQR,
}) => {
    const currentTrack = queue[currentSongIndex] || queue[0];

    return (
        <div
            className={`rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 mb-6 relative overflow-hidden transition-colors flex-shrink-0 ${isHost ? "bg-indigo-50/50 border-2 border-indigo-100" : "bg-white"
                }`}
        >
            {/* Background Blur for Art */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <button
                    onClick={goHome}
                    className="p-2 -ml-2 text-slate-400 hover:text-slate-900"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-indigo-500 tracking-wide uppercase bg-indigo-50 px-3 py-1 rounded-full mb-1">
                        {isHost ? "Hôte" : "Invité"}
                    </span>
                    <h3 className="text-slate-500 text-xs">Room: Soirée Samedi</h3>
                </div>
                <button
                    onClick={() => setShowQR(true)}
                    className="p-2 -mr-2 text-slate-400 hover:text-slate-900"
                >
                    <QrCode size={24} />
                </button>
            </div>

            <div className="flex flex-col items-center mb-8 relative z-10">
                {currentTrack?.cover?.startsWith("http") ? (
                    <div className="w-48 h-48 rounded-2xl shadow-2xl mb-6 overflow-hidden relative">
                        <img
                            src={currentTrack.cover}
                            alt={currentTrack.title}
                            className="w-full h-full object-cover animate-[spin_10s_linear_infinite] rounded-full" // Making it spin like a record if desired, or just square. The original had a spinning Disc icon. Let's keep the square art but maybe add a spinning effect or just keep it static. The user likes "Dynamic Design". Let's make it a spinning record style if it's a song? Or just a nice album art. The original was a square div with a spinning disc inside.
                        // Let's stick to standard album art display for now, maybe with a subtle shadow.
                        />
                        {/* Overlay for spinning disc effect if we want, but simple image is safer for now */}
                    </div>
                ) : (
                    <div
                        className={`w-48 h-48 rounded-2xl ${currentTrack?.cover || "bg-gradient-to-br from-indigo-500 to-purple-600"
                            } shadow-2xl mb-6 flex items-center justify-center text-white/20`}
                    >
                        <Disc size={80} className="animate-[spin_10s_linear_infinite]" />
                    </div>
                )}
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">
                    {currentTrack?.title || "Midnight City"}
                </h2>
                <p className="text-slate-500 font-medium">
                    {currentTrack?.artist || "M83"}
                </p>
            </div>

            <div className="space-y-2 mb-8 relative z-10">
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-slate-900 rounded-full"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>1:12</span>
                    <span>4:03</span>
                </div>
            </div>

            <div className="flex items-center justify-between px-4 relative z-10">
                {isHost ? (
                    <>
                        <button className="text-slate-300 hover:text-slate-600 transition-colors">
                            <Radio size={20} />
                        </button>
                        <button
                            title="Précédent"
                            onClick={() =>
                                setCurrentSongIndex((prev) =>
                                    prev === 0 ? queue.length - 1 : prev - 1
                                )
                            }
                            className="w-12 h-12 flex items-center justify-center text-slate-900 hover:scale-110 transition-transform bg-white rounded-full shadow-sm"
                        >
                            <SkipBack size={24} />
                        </button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95 transition-all"
                        >
                            {isPlaying ? (
                                <Pause size={28} fill="currentColor" />
                            ) : (
                                <Play size={28} fill="currentColor" className="ml-1" />
                            )}
                        </button>
                        <button
                            title="Suivant"
                            onClick={() =>
                                setCurrentSongIndex((prev) => (prev + 1) % queue.length)
                            }
                            className="w-12 h-12 flex items-center justify-center text-slate-900 hover:scale-110 transition-transform bg-white rounded-full shadow-sm"
                        >
                            <SkipForward size={24} />
                        </button>
                        <button className="text-slate-300 hover:text-slate-600 transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </>
                ) : (
                    <>
                        <button className="text-slate-300 hover:text-red-500 transition-colors">
                            <ThumbsUp size={24} className="rotate-180" />
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-slate-400 font-medium">
                                Prochain titre
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                                Get Lucky
                            </span>
                        </div>
                        <button className="text-slate-300 hover:text-green-500 transition-colors">
                            <ThumbsUp size={24} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Player;
