import React from "react";
import { X, UserPlus, Ban, UserMinus } from "lucide-react";
import Avatar from "../ui/Avatar";
import { MOCK_FRIENDS } from "../../data/mocks";

const ManageModal = ({
    setShowManageModal,
    participants,
    toggleBlockUser,
    kickUser,
}) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-md transition-all duration-300 animate-in fade-in"
            onClick={() => setShowManageModal(false)}
        >
            <div
                className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Gestion Room</h2>
                        <p className="text-slate-500 text-sm">
                            {participants.length} participants
                        </p>
                    </div>
                    <button
                        onClick={() => setShowManageModal(false)}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-slate-500"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="space-y-6">
                    {/* Invite Section */}
                    <div className="bg-indigo-50 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-xl text-indigo-600 shadow-sm">
                                <UserPlus size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-900 text-sm">
                                    Code: SAT-2024
                                </h4>
                                <p className="text-indigo-600/70 text-xs">
                                    Inviter des participants
                                </p>
                            </div>
                        </div>
                        <button className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-full shadow-sm hover:bg-indigo-700 transition-colors">
                            Copier
                        </button>
                    </div>

                    {/* Invite Friends List */}
                    <div className="space-y-1">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                            Inviter des amis
                        </h3>
                        {MOCK_FRIENDS.filter((f) => !f.inRoom).map((friend) => (
                            <div
                                key={friend.id}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar name={friend.name} color={friend.avatar} />
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">
                                            {friend.name}
                                        </h4>
                                        <p className="text-[10px] text-slate-500">
                                            {friend.status}
                                        </p>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
                                    Inviter
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Participants List */}
                    <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                            Participants
                        </h3>
                        {participants.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar name={user.name} color={user.avatar} />
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">
                                            {user.name}
                                        </h4>
                                        {user.isBlocked && (
                                            <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded-md">
                                                Bloqué
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleBlockUser(user.id)}
                                        title={
                                            user.isBlocked ? "Débloquer" : "Bloquer les suggestions"
                                        }
                                        className={`p-2 rounded-full transition-colors ${user.isBlocked
                                                ? "bg-red-100 text-red-600"
                                                : "bg-gray-100 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                            }`}
                                    >
                                        <Ban size={18} />
                                    </button>
                                    <button
                                        onClick={() => kickUser(user.id)}
                                        title="Expulser"
                                        className="p-2 bg-gray-100 text-slate-400 rounded-full hover:bg-slate-200 hover:text-slate-600 transition-colors"
                                    >
                                        <UserMinus size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {participants.length === 0 && (
                            <p className="text-center text-slate-400 text-sm py-4">
                                La room est vide.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageModal;
