
const STORAGE_KEY = "quno_users";
const SESSION_KEY = "quno_session";

export const authService = {
    getUsers: () => {
        const users = localStorage.getItem(STORAGE_KEY);
        return users ? JSON.parse(users) : [];
    },

    saveUsers: (users) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    },

    register: (username, email, password) => {
        const users = authService.getUsers();

        if (users.find((u) => u.email === email)) {
            return { success: false, message: "Cet email est déjà utilisé." };
        }

        const newUser = {
            id: Date.now(),
            username,
            email,
            password, // In a real app, hash this!
            avatar: "bg-indigo-100", // Default avatar
        };

        users.push(newUser);
        authService.saveUsers(users);

        return { success: true, user: newUser };
    },

    login: (email, password) => {
        const users = authService.getUsers();
        const user = users.find((u) => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(user));
            return { success: true, user };
        }

        return { success: false, message: "Email ou mot de passe incorrect." };
    },

    logout: () => {
        localStorage.removeItem(SESSION_KEY);
    },

    getCurrentUser: () => {
        const user = localStorage.getItem(SESSION_KEY);
        return user ? JSON.parse(user) : null;
    }
};
