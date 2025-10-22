// src/lib/Auth.ts (Versi Final untuk Auth dan Profil)

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser'; // Key baru untuk menyimpan data profil

// Definisikan tipe data user sesuai dengan data yang dikirim backend saat login
interface User {
    id: number;
    email: string;
    fullName: string;
    phone?: string | null;
    shopeeAccount?: string | null;
    address?: string | null;
}

export const AuthService = {
    // 1. Fungsi Baru: Menyimpan Token DAN Data User
    setAuth: (token: string, user: User) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token);
            // Simpan objek user sebagai string JSON
            localStorage.setItem(USER_KEY, JSON.stringify(user)); 
        }
    },

    // 2. Mengambil Token (tetap sama)
    getToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(TOKEN_KEY);
        }
        return null;
    },

    // 3. Fungsi Baru: Mengambil Data Profil User
    getUser: (): User | null => {
        if (typeof window !== 'undefined') {
            const userString = localStorage.getItem(USER_KEY);
            if (userString) {
                try {
                    return JSON.parse(userString) as User;
                } catch (e) {
                    console.error("Error parsing user data:", e);
                    return null;
                }
            }
        }
        return null;
    },

    // 4. Menghapus Token DAN Data User (Logout)
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY); // Hapus data user
        }
    },

    // 5. Mengecek status login (tetap sama)
    isLoggedIn: (): boolean => {
        return !!AuthService.getToken() && !!AuthService.getUser();
    }
};

export type { User }; // Export tipe data user agar bisa digunakan di komponen lain