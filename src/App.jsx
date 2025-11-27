import React, { useState, useEffect } from "react";
import {
  Music,
  Users,
  Settings,
  Plus,
  Search,
  QrCode,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ThumbsUp,
  MoreHorizontal,
  Share2,
  LogOut,
  Wifi,
  Radio,
  Disc,
  ArrowLeft,
  CheckCircle2,
  X,
  Edit2,
  Link as LinkIcon,
  Check,
  Smartphone,
  ScanLine,
  Keyboard,
  Clock,
  RotateCcw,
  Youtube,
  Copy,
  ChevronRight,
  Hash,
  Lock,
  Store,
  GripVertical,
  Trash2,
  UserPlus,
  ChevronDown,
  Power,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { authService } from "./services/auth";
import logo from "./assets/Logo_Basique.svg";
import SearchModal from "./components/SearchModal";
import SubscriptionModal from "./components/modals/SubscriptionModal";

// --- Mock Data ---

const MOCK_FRIENDS = [
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
];

const MOCK_QUEUE = [
  {
    id: 1,
    title: "Midnight City",
    artist: "M83",
    votes: 12,
    addedBy: "Alice",
    cover: "bg-gradient-to-br from-purple-500 to-indigo-600",
  },
  {
    id: 2,
    title: "Get Lucky",
    artist: "Daft Punk",
    votes: 8,
    addedBy: "Lucas",
    cover: "bg-gradient-to-br from-yellow-400 to-orange-500",
  },
  {
    id: 3,
    title: "Instant Crush",
    artist: "Daft Punk",
    votes: 5,
    addedBy: "Moi",
    cover: "bg-gradient-to-br from-gray-700 to-black",
  },
];

const MOCK_HISTORY = [
  {
    id: 101,
    title: "One More Time",
    artist: "Daft Punk",
    addedBy: "Lucas",
    cover: "bg-blue-400",
    playedAt: "22:15",
  },
  {
    id: 102,
    title: "Starboy",
    artist: "The Weeknd",
    addedBy: "Alice",
    cover: "bg-red-500",
    playedAt: "22:10",
  },
  {
    id: 103,
    title: "Nightcall",
    artist: "Kavinsky",
    addedBy: "Chloé",
    cover: "bg-indigo-900",
    playedAt: "22:05",
  },
];

const MOCK_PARTICIPANTS_DATA = [
  { id: 1, name: "Alice M.", avatar: "bg-pink-200", isBlocked: false },
  { id: 2, name: "Lucas D.", avatar: "bg-blue-200", isBlocked: false },
  { id: 3, name: "Chloé B.", avatar: "bg-green-200", isBlocked: false },
  { id: 4, name: "Thomas R.", avatar: "bg-yellow-200", isBlocked: false },
];

const MODES = [
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

const MOCK_RECENTS = [

  {
    id: 1,
    name: "Soirée Samedi",
    host: "Lucas",
    service: "Spotify",
    status: "En cours",
    cover: "bg-gradient-to-r from-pink-500 to-rose-500",
    icon: <Music size={20} />,
    participants: MOCK_PARTICIPANTS_DATA,
    history: MOCK_HISTORY,
  },
  {
    id: 2,
    name: "Roadtrip Sud",
    host: "Moi",
    service: "Apple Music",
    status: "Terminée hier",
    cover: "bg-gray-200",
    icon: <Radio size={20} />,
    participants: [
      { id: 1, name: "Alice M.", avatar: "bg-pink-200" },
      { id: 2, name: "Lucas D.", avatar: "bg-blue-200" },
    ],
    history: [
      {
        id: 101,
        title: "One More Time",
        artist: "Daft Punk",
        cover: "bg-blue-400",
        playedAt: "22:15",
      },
    ],
  },
];

// --- Components ---

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  icon: Icon,
}) => {
  const baseStyle =
    "flex items-center justify-center font-medium transition-all active:scale-95 rounded-2xl px-6 py-3.5 w-full";
  const variants = {
    primary:
      "bg-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-slate-800",
    secondary: "bg-gray-100 text-slate-900 hover:bg-gray-200",
    ghost: "bg-transparent text-slate-500 hover:bg-gray-50",
    danger: "bg-red-50 text-red-500 hover:bg-red-100",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={20} className="mr-2" />}
      {children}
    </button>
  );
};

const Card = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-3xl p-5 shadow-sm border border-gray-100 ${className}`}
  >
    {children}
  </div>
);

const Avatar = ({ name, color, size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  };
  return (
    <div
      className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-slate-700 font-bold shadow-inner`}
    >
      {name.substring(0, 2).toUpperCase()}
    </div>
  );
};

const SortableItem = ({ id, children, isHost }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: "relative",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 ${isDragging ? "opacity-50" : ""}`}
    >
      {isHost && (
        <div
          {...attributes}
          {...listeners}
          className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing p-1 touch-none"
        >
          <GripVertical size={20} />
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
};

// --- Main App Component ---

export default function QunoApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [view, setView] = useState("nav");

  // User Data
  const [username, setUsername] = useState("Alexandre");
  const [userAvatar, setUserAvatar] = useState("bg-indigo-100");
  const [friendCode, setFriendCode] = useState("ALEX#8821");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login', 'register', 'guest'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Initialize Auth from LocalStorage
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setUsername(user.username);
      setUserAvatar(user.avatar || "bg-indigo-100");
      setIsAuthenticated(true);
    }
  }, []);

  // Room State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentMode, setCurrentMode] = useState("classic");
  const [showQR, setShowQR] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  const [participants, setParticipants] = useState(MOCK_PARTICIPANTS_DATA);
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [friends, setFriends] = useState(MOCK_FRIENDS);
  const [isHosting, setIsHosting] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null); // { id, role, name }
  const [recentRooms, setRecentRooms] = useState(MOCK_RECENTS);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [showRoomDetailsModal, setShowRoomDetailsModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setQueue((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Queue Tab State (New)
  const [queueTab, setQueueTab] = useState("queue"); // 'queue' or 'history'

  // Navigation Logic
  const goHome = () => {
    setView("nav");
    setActiveTab("home");
  };

  const startRoom = (mode) => {
    // Create new room object
    const newRoom = {
      id: Date.now(),
      name: "Ma Session",
      host: username,
      service: "Spotify",
      status: "En cours",
      cover: "bg-gradient-to-r from-indigo-500 to-purple-500",
      icon: <Music size={20} />,
    };

    // Add to recents
    setRecentRooms((prev) => [newRoom, ...prev]);

    // Set active room state
    setActiveRoom({ id: newRoom.id, role: "host", name: newRoom.name });
    setCurrentMode(mode);
    setIsHosting(true);
    setView("room-host");
  };

  const stopRoom = () => {
    // Mark room as finished in recents and save history
    if (activeRoom) {
      setRecentRooms((prev) =>
        prev.map((room) =>
          room.id === activeRoom.id
            ? {
              ...room,
              status: "Terminée",
              participants: participants,
              history: queue, // Saving current queue as history for now
            }
            : room
        )
      );
    }
    setIsHosting(false);
    setActiveRoom(null);
    setQueue(MOCK_QUEUE);
    goHome();
  };

  const leaveRoom = () => {
    setActiveRoom(null);
    goHome();
  };

  const joinRoom = () => {
    if (activeRoom) {
      alert("Vous êtes déjà dans une room active ! Quittez-la d'abord.");
      return;
    }
    setActiveRoom({ id: 999, role: "guest", name: "Room rejointe" });
    setShowJoinModal(false); // Close modal if open
    setView("room-guest");
  };

  const handleRecentClick = (room) => {
    // Check if user is already in this active room
    if (activeRoom && activeRoom.id === room.id) {
      // Restore view based on role
      if (activeRoom.role === "host") {
        setView("room-host");
      } else {
        setView("room-guest");
      }
      return;
    }

    // If room is finished, show details
    if (room.status === "Terminée" || room.status.includes("Terminée")) {
      setSelectedRoom(room);
      setShowRoomDetailsModal(true);
      return;
    }

    // Block if in another active room
    if (activeRoom) {
      alert("Vous êtes déjà dans une room active ! Quittez-la d'abord.");
      return;
    }

    // Join logic for inactive/new room (Mock behavior for now)
    // In a real app, this would join the specific room ID
    joinRoom();
  };

  const handleLogin = () => {
    if (email && password) {
      const result = authService.login(email, password);
      if (result.success) {
        setUsername(result.user.username);
        setUserAvatar(result.user.avatar);
        setIsAuthenticated(true);
      } else {
        alert(result.message);
      }
    }
  };

  const handleRegister = () => {
    if (email && password && username) {
      const result = authService.register(username, email, password);
      if (result.success) {
        // Auto login after register
        const loginResult = authService.login(email, password);
        if (loginResult.success) {
          setUsername(loginResult.user.username);
          setUserAvatar(loginResult.user.avatar);
          setIsAuthenticated(true);
        }
      } else {
        alert(result.message);
      }
    }
  };

  const handleGuestLogin = () => {
    if (username) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    setAuthMode("login");
  };

  const toggleBlockUser = (id) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isBlocked: !p.isBlocked } : p))
    );
  };

  const kickUser = (id) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDeleteFriend = (id) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
  };

  const addToQueue = (track) => {
    const newTrack = {
      id: track.id, // Keep original ID or generate unique if needed
      title: track.title,
      artist: track.artist,
      votes: 0,
      addedBy: username, // Current user
      cover: track.cover, // URL
      previewUrl: track.previewUrl,
    };
    setQueue((prev) => [...prev, newTrack]);
  };

  // --- Sub-Pages Renderers ---

  const renderAuth = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <img src={logo} alt="Quno Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Quno</h1>
          <p className="text-slate-500">La musique se vit ensemble.</p>
        </div>

        {authMode === "login" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@exemple.com"
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-2 focus:ring-slate-900/10 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-2 focus:ring-slate-900/10 outline-none transition-all"
              />
            </div>
            <Button onClick={handleLogin} className="mt-4">
              Se connecter
            </Button>
            <div className="flex flex-col items-center gap-4 mt-6">
              <button
                onClick={() => setAuthMode("register")}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                Pas encore de compte ?{" "}
                <span className="text-indigo-600 font-bold">S'inscrire</span>
              </button>
              <div className="w-full h-px bg-gray-100"></div>
              <button
                onClick={() => setAuthMode("guest")}
                className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Continuer en tant qu'invité
              </button>
            </div>
          </div>
        )}

        {authMode === "register" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Alexandre"
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-2 focus:ring-slate-900/10 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@exemple.com"
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-2 focus:ring-slate-900/10 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-2 focus:ring-slate-900/10 outline-none transition-all"
              />
            </div>
            <Button onClick={handleRegister} className="mt-4">
              Créer un compte
            </Button>
            <div className="text-center mt-6">
              <button
                onClick={() => setAuthMode("login")}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                Déjà un compte ?{" "}
                <span className="text-indigo-600 font-bold">Se connecter</span>
              </button>
            </div>
          </div>
        )}

        {authMode === "guest" && (
          <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-2xl mb-6">
              <p className="text-sm text-indigo-800 text-center">
                Le mode invité est limité. Vous ne pourrez pas créer de rooms.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Votre pseudo
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Invité"
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-2 focus:ring-slate-900/10 outline-none transition-all"
              />
            </div>
            <Button onClick={handleGuestLogin} className="mt-4">
              Accéder à l'app
            </Button>
            <div className="text-center mt-6">
              <button
                onClick={() => setAuthMode("login")}
                className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Retour à la connexion
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Bonjour, {username.split(" ")[0]}
          </h1>
          <p className="text-slate-500">Prêt à écouter quoi aujourd'hui ?</p>
        </div>
        <div
          onClick={() => setActiveTab("settings")}
          className="cursor-pointer"
        >
          <Avatar name={username} color={userAvatar} />
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {/* Bouton Créer */}
        <Card
          onClick={() => setActiveTab("create")}
          className="col-span-1 cursor-pointer hover:bg-gray-50 transition-all active:scale-95 group h-40"
        >
          <div className="h-full flex flex-col justify-between">
            <div className="bg-slate-900 text-white w-10 h-10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Créer</h3>
              <p className="text-slate-500 text-sm">une Room</p>
            </div>
          </div>
        </Card>

        {/* Bouton Rejoindre */}
        <Card
          onClick={() => setShowJoinModal(true)}
          className="col-span-1 cursor-pointer hover:bg-gray-50 transition-all active:scale-95 group h-40"
        >
          <div className="h-full flex flex-col justify-between">
            <div className="bg-indigo-50 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <QrCode size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Rejoindre</h3>
              <p className="text-slate-500 text-sm">Scanner ou Code</p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Récents</h2>
        <div className="space-y-3">
          {recentRooms
            .sort((a, b) => {
              // Sort by status: "En cours" first
              if (a.status === "En cours" && b.status !== "En cours") return -1;
              if (a.status !== "En cours" && b.status === "En cours") return 1;
              // Then by ID (assuming higher ID is newer)
              return b.id - a.id;
            })
            .map((room) => (
              <Card
                key={room.id}
                onClick={() => handleRecentClick(room)}
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 active:scale-95 transition-all ${room.status !== "En cours" ? "opacity-60" : ""
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${room.cover} flex items-center justify-center text-white shadow-lg`}
                  >
                    {room.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{room.name}</h4>
                    <p className="text-xs text-slate-500">
                      Hôte : {room.host} • {room.service}
                    </p>
                  </div>
                </div>
                {room.status === "En cours" ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      En cours
                    </span>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">{room.status}</p>
                )}
              </Card>
            ))}
        </div>
      </div>
    </div>
  );

  const renderCreateRoom = () => (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Nouvelle Session</h1>
        <p className="text-slate-500">Configurez votre espace musical</p>
      </header>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 ml-1">
          Nom de la room
        </label>
        <input
          type="text"
          placeholder="Ex: Chill Sunday"
          className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none font-medium"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 ml-1">
          Source Audio (Hôte)
        </label>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {["Spotify", "Apple Music", "Deezer"].map((service) => (
            <button
              key={service}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${service === "Spotify"
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "border-gray-200 text-slate-600"
                }`}
            >
              {service}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 ml-1">
          Mode de jeu
        </label>
        <div className="grid gap-3">
          {MODES.map((mode) => (
            <div
              key={mode.id}
              onClick={() =>
                mode.locked ? setShowSubscriptionModal(true) : setCurrentMode(mode.id)
              }
              className={`p-4 rounded-2xl border transition-all flex items-center gap-4 relative overflow-hidden ${mode.locked
                ? "border-gray-100 bg-gray-50 opacity-75 cursor-not-allowed"
                : currentMode === mode.id
                  ? "border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500 cursor-pointer"
                  : "border-gray-100 bg-white hover:border-gray-200 cursor-pointer"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${mode.locked
                  ? "bg-gray-200 text-gray-500"
                  : currentMode === mode.id
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 text-slate-500"
                  }`}
              >
                {mode.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4
                    className={`font-bold text-sm ${currentMode === mode.id
                      ? "text-indigo-900"
                      : "text-slate-900"
                      }`}
                  >
                    {mode.name}
                  </h4>
                  {mode.locked && (
                    <span className="text-[10px] font-bold text-white bg-slate-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock size={8} /> {mode.price}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{mode.desc}</p>
              </div>
              {currentMode === mode.id && !mode.locked && (
                <CheckCircle2 size={18} className="text-indigo-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={() => startRoom(currentMode)}>Lancer la Room</Button>
      </div>
    </div>
  );

  const renderFriends = () => (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Amis</h1>
          <p className="text-slate-500">Gérez vos connexions</p>
        </div>
        <button className="bg-slate-900 text-white p-2 rounded-full hover:bg-slate-800 transition-colors">
          <Plus size={20} />
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Rechercher un ami..."
          className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-3 text-slate-900 focus:ring-2 focus:ring-slate-100 outline-none"
        />
      </div>

      {/* Invitation Section */}
      <Card className="bg-indigo-50 border-indigo-100 flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full text-indigo-600">
            <Share2 size={20} />
          </div>
          <div>
            <h4 className="font-bold text-indigo-900 text-sm">
              Inviter des amis
            </h4>
            <p className="text-indigo-600/70 text-xs">
              Partagez votre lien unique
            </p>
          </div>
        </div>
        <button className="text-xs font-bold bg-white text-indigo-600 px-3 py-1.5 rounded-full shadow-sm hover:bg-indigo-50 transition-colors">
          Copier
        </button>
      </Card>

      <div className="space-y-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2 mt-4 mb-2">
          Vos amis
        </h3>
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar name={friend.name} color={friend.avatar} />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${friend.status === "Hors ligne"
                    ? "bg-gray-300"
                    : "bg-green-500"
                    }`}
                ></div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{friend.name}</h4>
                <p className="text-xs text-slate-500">{friend.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isHosting ? (
                <button
                  onClick={() => alert(`Invitation envoyée à ${friend.name}`)}
                  className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full hover:bg-indigo-100 transition-colors flex items-center gap-1"
                >
                  <UserPlus size={14} />
                  Inviter
                </button>
              ) : friend.inRoom ? (
                <button
                  onClick={joinRoom}
                  className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full hover:bg-indigo-100 transition-colors"
                >
                  Rejoindre
                </button>
              ) : null}

              <button
                onClick={() => handleDeleteFriend(friend.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Supprimer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => {
    // Vue Edition Profil
    if (isEditingProfile) {
      return (
        <div className="space-y-6">
          <header className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingProfile(false)}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">
              Éditer le profil
            </h1>
          </header>

          <div className="flex flex-col items-center gap-6 py-6">
            <div className="relative group cursor-pointer">
              <Avatar name={username} color={userAvatar} size="lg" />
              <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 size={20} className="text-white" />
              </div>
            </div>

            {/* Color Picker */}
            <div className="flex gap-3">
              {[
                "bg-indigo-100",
                "bg-pink-100",
                "bg-blue-100",
                "bg-green-100",
              ].map((c) => (
                <button
                  key={c}
                  onClick={() => setUserAvatar(c)}
                  className={`w-8 h-8 rounded-full ${c} border-2 ${userAvatar === c ? "border-slate-900" : "border-transparent"
                    }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-slate-900 font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={() => setIsEditingProfile(false)}>
              Enregistrer
            </Button>
          </div>
        </div>
      );
    }

    // Vue Principale Paramètres
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
        </header>

        <div
          onClick={() => setIsEditingProfile(true)}
          className="flex items-center justify-between p-4 bg-white rounded-3xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <Avatar name={username} color={userAvatar} size="lg" />
            <div>
              <h3 className="font-bold text-lg text-slate-900">{username}</h3>
              <p className="text-slate-500 text-sm">Appuyez pour modifier</p>
            </div>
          </div>
          <div className="bg-gray-100 p-2 rounded-full text-slate-400 group-hover:text-slate-900 transition-colors">
            <Edit2 size={18} />
          </div>
        </div>

        {/* NEW: Code Ami Section */}
        <section>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-2">
            Mon Compte
          </h4>
          <Card className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-50 p-2 rounded-full text-indigo-600">
                <Hash size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Mon Code Ami
                </h4>
                <p className="text-slate-500 text-xs tracking-wider">
                  {friendCode}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                /* Copy Logic */
              }}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              <Copy size={20} />
            </button>
          </Card>
        </section>

        <div className="space-y-4">
          <section>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-2">
              Intégrations
            </h4>

            {/* NEW: Single Button for Music Services */}
            <Card
              onClick={() => setShowIntegrationsModal(true)}
              className="cursor-pointer hover:bg-gray-50 transition-colors active:scale-95 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Stacked Icons for visual cue */}
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#1DB954] border-2 border-white flex items-center justify-center text-white z-20">
                      <Wifi size={14} />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#FC3C44] border-2 border-white flex items-center justify-center text-white z-10">
                      <Music size={14} />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#FF0000] border-2 border-white flex items-center justify-center text-white z-0">
                      <Youtube size={14} />
                    </div>
                  </div>
                  <div className="ml-2">
                    <span className="font-bold text-slate-900 block text-sm">
                      Services de Streaming
                    </span>
                    <span className="text-green-500 text-xs font-medium">
                      Spotify Connecté
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-slate-300 group-hover:text-slate-600 transition-colors"
                />
              </div>
            </Card>
          </section>

          <section>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-2">
              Application
            </h4>
            <Card className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">
                  Notifications
                </span>
                <div className="w-10 h-6 bg-indigo-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              <div className="w-full h-px bg-gray-100"></div>
              <div
                onClick={handleLogout}
                className="flex items-center justify-between text-red-500 cursor-pointer hover:bg-red-50 p-2 -m-2 rounded-xl transition-colors"
              >
                <span className="font-medium">Déconnexion</span>
                <LogOut size={18} />
              </div>
            </Card>
          </section>
        </div>
      </div>
    );
  };

  const renderManageModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-md transition-all duration-300"
      onClick={() => setShowManageModal(false)}
    >
      <div
        className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 pb-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Gestion de la Room
          </h2>
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
            <div>
              <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">
                Code de la room
              </p>
              <h3 className="text-2xl font-bold text-indigo-900 tracking-widest">
                SAM-2024
              </h3>
            </div>
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-100 transition-colors">
              Inviter un ami
            </button>
          </div>

          {/* Participants List */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              Participants <span className="text-slate-400 font-normal">({participants.length})</span>
            </h3>
            <div className="space-y-2">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={participant.name} color={participant.avatar} size="sm" />
                    <div>
                      <h4 className={`font-bold text-sm ${participant.isBlocked ? "text-slate-400 line-through" : "text-slate-900"}`}>
                        {participant.name}
                      </h4>
                      {participant.isBlocked && (
                        <span className="text-[10px] text-red-500 font-bold">Bloqué</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleBlockUser(participant.id)}
                      className={`p-2 rounded-xl transition-colors ${participant.isBlocked
                        ? "bg-red-100 text-red-600"
                        : "bg-white text-slate-400 hover:text-red-500"
                        }`}
                      title={participant.isBlocked ? "Débloquer" : "Bloquer"}
                    >
                      <Lock size={16} />
                    </button>
                    <button
                      onClick={() => kickUser(participant.id)}
                      className="p-2 bg-white text-slate-400 hover:text-red-500 rounded-xl transition-colors"
                      title="Exclure"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

  );

  // --- ROOM VIEWS ---

  const renderPlayer = ({ isHost }) => (
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
          title="Réduire"
        >
          <ChevronDown size={24} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-indigo-500 tracking-wide uppercase bg-indigo-50 px-3 py-1 rounded-full mb-1">
            {isHost ? "Hôte" : "Invité"}
          </span>
          <h3 className="text-slate-500 text-xs">Room: Soirée Samedi</h3>
        </div>
        <div className="flex items-center -mr-2">
          {isHost ? (
            <button
              onClick={stopRoom}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Arrêter la room"
            >
              <Power size={20} />
            </button>
          ) : (
            <button
              onClick={leaveRoom}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Quitter la room"
            >
              <LogOut size={20} />
            </button>
          )}
          <button
            onClick={() => setShowQR(true)}
            className="p-2 text-slate-400 hover:text-slate-900"
          >
            <QrCode size={24} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center mb-8 relative z-10">
        {queue[currentSongIndex]?.cover?.startsWith("http") ? (
          <div className="w-48 h-48 rounded-2xl shadow-2xl mb-6 overflow-hidden relative">
            <img
              src={queue[currentSongIndex].cover}
              alt={queue[currentSongIndex].title}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        ) : (
          <div className={`w-48 h-48 rounded-2xl ${queue[currentSongIndex]?.cover || "bg-gradient-to-br from-indigo-500 to-purple-600"} shadow-2xl mb-6 flex items-center justify-center text-white/20`}>
            <Disc size={80} className="animate-[spin_10s_linear_infinite]" />
          </div>
        )}
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">
          {queue[currentSongIndex]?.title || "Midnight City"}
        </h2>
        <p className="text-slate-500 font-medium">
          {queue[currentSongIndex]?.artist || "M83"}
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

  const renderQueueList = ({ isHost }) => (
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
            onClick={() => setShowManageModal(true)}
            className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full"
          >
            {isHost ? "Gérer" : "Suggérer"}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {queueTab === "queue" ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={queue.slice(1)}
              strategy={verticalListSortingStrategy}
            >
              {queue.slice(1).map((track, idx) => (
                <SortableItem key={track.id} id={track.id} isHost={isHost}>
                  <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-50 shadow-sm">
                    <span className="text-slate-300 font-bold w-4 text-center">
                      {idx + 1}
                    </span>
                    {track.cover.startsWith("http") ? (
                      <img
                        src={track.cover}
                        alt={track.title}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-xl ${track.cover}`}
                      ></div>
                    )}
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
                      <button className="text-slate-300 hover:text-red-500">
                        <X size={20} />
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-slate-400 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                          title="Voter pour"
                        >
                          <ThumbsUp size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </SortableItem>
              ))}
            </SortableContext>

            {/* Add Button Placeholder */}
            <div
              onClick={() => setShowSearchModal(true)}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <Plus size={24} />
              <span className="text-sm font-medium">Ajouter un titre</span>
            </div>

          </DndContext>
        ) : (
          /* HISTORY VIEW */
          <div className="space-y-3">
            {MOCK_HISTORY.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl border border-transparent"
              >
                {track.cover.startsWith("http") ? (
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-12 h-12 rounded-xl object-cover opacity-80 grayscale-[0.3]"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-xl ${track.cover} opacity-80 grayscale-[0.3]`}
                  ></div>
                )}
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
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-400 hover:text-pink-50 shadow-sm transition-colors"
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
    </div >
  );

  // Vue Hôte (Page 5)
  const renderHostView = () => (
    <div className="h-full flex flex-col">
      {renderPlayer({ isHost: true })}
      {renderQueueList({ isHost: true })}

      {/* QR Code Modal (Simple Overlay) */}
      {showQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-white rounded-[2rem] p-8 w-full max-w-sm flex flex-col items-center text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Soirée Samedi
            </h3>
            <p className="text-slate-500 mb-6">
              Scannez pour rejoindre la playlist
            </p>
            <div className="bg-slate-900 p-4 rounded-3xl mb-6">
              <QrCode size={180} color="white" />
            </div>
            <div className="flex gap-3 w-full">
              <Button variant="secondary" onClick={() => setShowQR(false)}>
                Fermer
              </Button>
              <Button icon={Share2}>Partager</Button>
            </div>
          </div>
        </div>
      )}
      {showManageModal && renderManageModal()}
    </div>
  );

  const renderRoomDetailsModal = () => {
    if (!selectedRoom) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-md transition-all duration-300"
        onClick={() => setShowRoomDetailsModal(false)}
      >
        <div
          className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 pb-10 shadow-2xl h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

          <header className="flex justify-between items-center mb-6 flex-shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedRoom.name}
              </h2>
              <p className="text-slate-500 text-sm">
                {selectedRoom.status === "Terminée"
                  ? "Session terminée"
                  : "Session en cours"}
              </p>
            </div>
            <button
              onClick={() => setShowRoomDetailsModal(false)}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-slate-500"
            >
              <X size={20} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-6">
            {/* Participants Section */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                Participants{" "}
                <span className="text-slate-400 font-normal">
                  ({selectedRoom.participants?.length || 0})
                </span>
              </h3>
              <div className="space-y-2">
                {selectedRoom.participants?.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl"
                  >
                    <Avatar
                      name={participant.name}
                      color={participant.avatar}
                      size="sm"
                    />
                    <span className="font-bold text-sm text-slate-900">
                      {participant.name}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* History Section */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                Historique{" "}
                <span className="text-slate-400 font-normal">
                  ({selectedRoom.history?.length || 0} titres)
                </span>
              </h3>
              <div className="space-y-2">
                {selectedRoom.history?.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl"
                  >
                    {track.cover.startsWith("http") ? (
                      <img
                        src={track.cover}
                        alt={track.title}
                        className="w-10 h-10 rounded-lg object-cover opacity-80"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-lg ${track.cover} opacity-80`}
                      ></div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {track.title}
                      </h4>
                      <p className="text-xs text-slate-500">{track.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  // Vue Participant (Page 6)
  const renderGuestView = () => (
    <div className="h-full flex flex-col">
      {renderPlayer({ isHost: false })}
      {renderQueueList({ isHost: false })}
    </div>
  );

  // --- Wrapper ---

  return (
    <div className="w-full h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 overflow-hidden flex flex-col">
      {!isAuthenticated ? (
        renderAuth()
      ) : (
        <>
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto scrollbar-hide p-6 pb-24 max-w-md mx-auto w-full relative">
            {/* Conditional Rendering based on View State */}
            {view === "nav" && (
              <>
                {activeTab === "home" && renderHome()}
                {activeTab === "create" && renderCreateRoom()}
                {activeTab === "friends" && renderFriends()}
                {activeTab === "settings" && renderSettings()}
              </>
            )}

            {view === "room-host" && renderHostView()}
            {view === "room-guest" && renderGuestView()}

            {/* Modals */}
            {showRoomDetailsModal && renderRoomDetailsModal()}
            <SearchModal
              isOpen={showSearchModal}
              onClose={() => setShowSearchModal(false)}
              onAddTrack={addToQueue}
            />

            <SubscriptionModal
              isOpen={showSubscriptionModal}
              onClose={() => setShowSubscriptionModal(false)}
            />

            {showIntegrationsModal && (
              <div
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-md transition-all duration-300"
                onClick={() => setShowIntegrationsModal(false)}
              >
                <div
                  className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 pb-10 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

                  <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">
                      Intégrations
                    </h2>
                    <button
                      onClick={() => setShowIntegrationsModal(false)}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-slate-500"
                    >
                      <X size={20} />
                    </button>
                  </header>

                  <div className="space-y-4">
                    <Card className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#1DB954] flex items-center justify-center text-white shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
                          <Wifi size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">
                            Spotify
                          </h4>
                          <p className="text-xs text-green-600 font-medium">
                            Connecté tant que Alexandre
                          </p>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    </Card>

                    <Card className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors group opacity-60">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#FC3C44] flex items-center justify-center text-white shadow-lg shadow-red-200 group-hover:scale-110 transition-transform">
                          <Music size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">
                            Apple Music
                          </h4>
                          <p className="text-xs text-slate-500">
                            Non connecté
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-slate-300" />
                    </Card>

                    <Card className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors group opacity-60">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#FF0000] flex items-center justify-center text-white shadow-lg shadow-red-200 group-hover:scale-110 transition-transform">
                          <Youtube size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">
                            YouTube Music
                          </h4>
                          <p className="text-xs text-slate-500">
                            Non connecté
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-slate-300" />
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* JOIN MODAL OVERLAY */}
            {showJoinModal && (
              <div
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-md transition-all duration-300"
                onClick={() => setShowJoinModal(false)}
              >
                <div
                  className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 pb-10 shadow-2xl"
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
                          <p className="text-slate-400 text-xs">
                            Utiliser la caméra
                          </p>
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
                                <Avatar
                                  name={friend.name}
                                  color={friend.avatar}
                                  size="sm"
                                />
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
            )}
          </main>

          {/* Bottom Navigation Bar (Only visible when not in a room) */}
          {view === "nav" && (
            <div className="fixed bottom-0 w-full z-40">
              <div className="max-w-md mx-auto relative">
                {/* Gradient Blur Overlay for seamless look */}
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none"></div>

                <nav className="relative flex justify-around items-center bg-white/80 backdrop-blur-xl border-t border-gray-100/50 px-2 py-4 mb-2 mx-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  {[
                    { id: "home", icon: Wifi, label: "Accueil" },
                    { id: "create", icon: Plus, label: "Créer" },
                    { id: "friends", icon: Users, label: "Amis" },
                    { id: "settings", icon: Settings, label: "Réglages" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 ${activeTab === tab.id
                        ? "text-slate-900 bg-gray-100 px-5"
                        : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                      <tab.icon
                        size={24}
                        strokeWidth={activeTab === tab.id ? 2.5 : 2}
                      />
                      {activeTab === tab.id && (
                        <span className="text-[10px] font-bold">
                          {tab.label}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
