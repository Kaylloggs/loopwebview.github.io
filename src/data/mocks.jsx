import React from "react";
import { Disc, Radio, Store, ThumbsUp } from "lucide-react";

export const MOCK_FRIENDS = [
    {
        id: 1,
        name: "Alice M.",
        status: "En ligne",
        inRoom: false,
        avatar: "bg-pink-200",
    },
    {
        id: 2,
        name: "Lucas D.",
        status: 'Dans "Soirée Samedi"',
        inRoom: true,
        avatar: "bg-blue-200",
    },
    {
        id: 3,
        name: "Chloé B.",
        status: "Hors ligne",
        inRoom: false,
        avatar: "bg-green-200",
    },
    {
        id: 4,
        name: "Thomas R.",
        status: "En ligne",
        inRoom: false,
        avatar: "bg-yellow-200",
    },
];

export const MOCK_HISTORY = [
    {
        id: 101,
        title: "Get Lucky",
        artist: "Daft Punk",
        cover: "bg-orange-400",
        playedAt: "22:15",
    },
    {
        id: 102,
        title: "Midnight City",
        artist: "M83",
        cover: "bg-purple-500",
        playedAt: "22:10",
    },
    {
        id: 103,
        title: "Nightcall",
        artist: "Kavinsky",
        cover: "bg-red-900",
        playedAt: "22:05",
    },
];

export const MOCK_QUEUE = [
    {
        id: 1,
        title: "Midnight City",
        artist: "M83",
        cover: "bg-purple-500",
        addedBy: "Moi",
        votes: 12,
    },
    {
        id: 2,
        title: "Get Lucky",
        artist: "Daft Punk",
        cover: "bg-orange-400",
        addedBy: "Lucas",
        votes: 8,
    },
    {
        id: 3,
        title: "Instant Crush",
        artist: "Daft Punk",
        cover: "bg-slate-800",
        addedBy: "Moi",
        votes: 5,
    },
    {
        id: 4,
        title: "Nightcall",
        artist: "Kavinsky",
        cover: "bg-red-900",
        addedBy: "Alice",
        votes: 3,
    },
];

export const MOCK_PARTICIPANTS_DATA = [
    { id: 1, name: "Alice M.", avatar: "bg-pink-200", isBlocked: false },
    { id: 2, name: "Lucas D.", avatar: "bg-blue-200", isBlocked: false },
    { id: 3, name: "Chloé B.", avatar: "bg-green-200", isBlocked: false },
    { id: 4, name: "Thomas R.", avatar: "bg-yellow-200", isBlocked: false },
];

export const MODES = [
    {
        id: "classic",
        name: "Classique",
        icon: <Disc size={20} />,
        desc: "Tout le monde ajoute, le host décide.",
    },
    {
        id: "vote",
        name: "Democratie",
        icon: <ThumbsUp size={20} />,
        desc: "Les sons les plus votés passent avant.",
    },
    {
        id: "discovery",
        name: "Découverte",
        icon: <Radio size={20} />,
        desc: "Chacun propose 2 pépites obligatoires.",
    },
    {
        id: "kiosk",
        name: "Kiosque",
        icon: <Store size={20} />,
        desc: "Mode Pro : 35 participants max.",
        locked: true,
        price: "10$/mois",
    },
];
