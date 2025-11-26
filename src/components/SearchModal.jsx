import React, { useState, useEffect } from "react";
import { X, Search, Plus, Loader2, Music } from "lucide-react";

const SearchModal = ({ isOpen, onClose, onAddTrack }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState("");

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    // Fetch results
    useEffect(() => {
        if (!debouncedQuery) {
            setResults([]);
            return;
        }

        const searchMusic = async () => {
            setIsLoading(true);
            try {
                // Using iTunes Search API (Free, no key required)
                const response = await fetch(
                    `https://itunes.apple.com/search?term=${encodeURIComponent(
                        debouncedQuery
                    )}&media=music&entity=song&limit=20`
                );
                const data = await response.json();
                setResults(data.results);
            } catch (error) {
                console.error("Error searching music:", error);
            } finally {
                setIsLoading(false);
            }
        };

        searchMusic();
    }, [debouncedQuery]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-md transition-all duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 pb-10 shadow-2xl h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

                <header className="flex justify-between items-center mb-6 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-900">Ajouter un titre</h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-slate-500"
                    >
                        <X size={20} />
                    </button>
                </header>

                {/* Search Input */}
                <div className="relative mb-6 flex-shrink-0">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Rechercher une musique, un artiste..."
                        className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all"
                        autoFocus
                    />
                    {isLoading && (
                        <div className="absolute right-4 top-3.5">
                            <Loader2 size={20} className="animate-spin text-indigo-500" />
                        </div>
                    )}
                </div>

                {/* Results List */}
                <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2">
                    {results.length === 0 && !isLoading && query && (
                        <div className="text-center py-10 text-slate-400">
                            <p>Aucun résultat trouvé pour "{query}"</p>
                        </div>
                    )}

                    {results.length === 0 && !query && (
                        <div className="text-center py-10 text-slate-400 flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-300">
                                <Music size={32} />
                            </div>
                            <p>Commencez à taper pour rechercher</p>
                        </div>
                    )}

                    {results.map((track) => (
                        <div
                            key={track.trackId}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-colors group cursor-pointer"
                            onClick={() => {
                                onAddTrack({
                                    id: track.trackId,
                                    title: track.trackName,
                                    artist: track.artistName,
                                    cover: track.artworkUrl100, // Note: This is a URL, existing app uses tailwind classes for covers mostly but we should handle URLs
                                    previewUrl: track.previewUrl,
                                });
                                onClose();
                            }}
                        >
                            <img
                                src={track.artworkUrl100}
                                alt={track.trackName}
                                className="w-12 h-12 rounded-xl object-cover shadow-sm"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 truncate">
                                    {track.trackName}
                                </h4>
                                <p className="text-xs text-slate-500 truncate">
                                    {track.artistName}
                                </p>
                            </div>
                            <button className="p-2 bg-indigo-50 text-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-100">
                                <Plus size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
