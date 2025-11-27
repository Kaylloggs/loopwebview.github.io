import React from "react";
import { Check, X, Music } from "lucide-react";

const RoomInvitationsMenu = ({ invitations, onJoin, onDecline, onClose }) => {
    return (
        <>
            {/* Backdrop to close menu when clicking outside */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            ></div>

            <div className="absolute top-12 right-0 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-3 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-900">Invitations de Room</h3>
                    <span className="text-xs text-slate-400">{invitations.length} en attente</span>
                </div>

                <div className="max-h-64 overflow-y-auto">
                    {invitations.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs">
                            Aucune invitation pour le moment
                        </div>
                    ) : (
                        <div className="p-2 space-y-2">
                            {invitations.map((inv) => (
                                <div key={inv.id} className="bg-gray-50 p-3 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-10 h-10 rounded-lg ${inv.cover} flex items-center justify-center text-white shadow-sm`}>
                                            <Music size={16} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-900">{inv.roomName}</h4>
                                            <p className="text-xs text-slate-500">Invité par {inv.from}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onJoin(inv)}
                                            className="flex-1 bg-slate-900 text-white py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-slate-800 transition-colors"
                                        >
                                            <Check size={12} /> Rejoindre
                                        </button>
                                        <button
                                            onClick={() => onDecline(inv.id)}
                                            className="flex-1 bg-white border border-gray-200 text-slate-600 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
                                        >
                                            <X size={12} /> Refuser
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default RoomInvitationsMenu;
