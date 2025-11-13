'use client'; 
import DashboardLayout from '@/components/layout/DashboardLayout';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext'; 
import { RocketIcon, CrossCircledIcon } from '@radix-ui/react-icons'; 
import { PlusIcon, Trash2Icon } from 'lucide-react'; 

// Definisikan tipe data ToDo yang diharapkan dari backend
interface Todo {
    id: number;
    userId: number;
    title: string;
    description: string | null;
    isCompleted: boolean;
    createdAt: string;
}

const DashboardContent = () => {
    // --- SEMUA LOGIC HOOKS HARUS DIMULAI DI SINI ---
    const { token } = useAuth(); 
    
    // 1. STATE MANAGEMENT
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // State untuk form input
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    // FUNGSI HELPER BARU UNTUK FETCH DATA (Hanya butuh token)
    const secureFetch = useCallback(async (endpoint: string, options?: RequestInit) => {
        if (!token) {
            setError(`Sesi kedaluwarsa. Silakan login ulang.`);
            setIsLoading(false);
            throw new Error('No token available');
        }
        
        const fullPath = `/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

        const response = await fetch(fullPath, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Sertakan token
                ...options?.headers,
            },
        });
        
        return response;
    }, [token, setError, setIsLoading]); 

    // 2. DATA FETCHING (READ /todos) - Dibuat Reusable
    const fetchTodos = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await secureFetch('/todos', { method: 'GET' });
            const result = await response.json();
            
            if (response.ok && result.todos) { 
                setTodos(result.todos);
            } else {
                setError(result.message || `Gagal mengambil data To-Do List.`);
            }
        } catch (_e) {
            console.error("Fetch Todos Failed:", _e);
        }

        setIsLoading(false);
    }, [secureFetch]); 

    // Panggil fetchTodos saat component mount
    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]); 
    
    
    // 3. LOGIC HANDLE CREATE TODO (POST /todos)
    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodoTitle.trim()) return; 

        setIsPosting(true);

        const response = await secureFetch('/todos', { 
            method: 'POST',
            body: JSON.stringify({ 
                title: newTodoTitle.trim(),
                description: null 
            }),
        });

        const result = await response.json();
        
        if (response.ok && result.todo)
        {
            setTodos(prevTodos => [result.todo as Todo, ...prevTodos]); 
            setNewTodoTitle(''); 
        } else {
            alert(`Gagal membuat To-Do: ${result.message}`);
        }

        setIsPosting(false);
    };

    // --- LOGIC HANDLE UPDATE STATUS (PUT /todos/[id]) ---
    const handleToggleComplete = async (todoId: number, currentStatus: boolean) => {
        // Optimistic Update: Update UI dulu sebelum API merespons, untuk UX yang cepat
        setTodos(prevTodos => 
            prevTodos.map(t => 
                t.id === todoId ? { ...t, isCompleted: !currentStatus } : t
            )
        );

        // Panggil API PUT ke Dynamic Route
        const response = await secureFetch(`/todos/${todoId}`, { 
            method: 'PUT',
            body: JSON.stringify({ isCompleted: !currentStatus }),
        });

        if (!response.ok) {
            // Rollback jika API gagal
            setTodos(prevTodos => 
                prevTodos.map(t => 
                    t.id === todoId ? { ...t, isCompleted: currentStatus } : t // Balikkan status
                )
            );
            const result = await response.json();
            alert(result.message || `Gagal update status!`);
        }
    };

    // --- LOGIC HANDLE DELETE TODO (DELETE /todos/[id]) ---
    const handleDeleteTodo = async (todoId: number) => {
        if (!confirm(`Yakin ingin menghapus To-Do ini?`)) return; 

        // Optimistic delete: Hapus dari UI dulu
        const originalTodos = [...todos]; // Simpan state lama
        setTodos(prevTodos => prevTodos.filter(t => t.id !== todoId));

        // Panggil API DELETE ke Dynamic Route
        const response = await secureFetch(`/todos/${todoId}`, { 
            method: 'DELETE',
        });

        if (!response.ok) {
            // Rollback jika API gagal
            setTodos(originalTodos); 
            const result = await response.json(); 
            alert(`Gagal menghapus To-Do: ` + (result.message || response.statusText));
        }
    };

    // 4. LOGIC PERHITUNGAN STATUS
    const completedTodosCount = todos.filter(t => t.isCompleted).length;
    const totalTodos = todos.length;
    const progress = totalTodos > 0 ? Math.round((completedTodosCount / totalTodos) * 100) : 0;

    // --- RENDER KONTEN DINAMIS DIMULAI DI SINI ---
    return (
        <>
            {/* ... JSX Dashboard Content ... */}
            <h1 className="text-3xl font-bold mb-4">Affiliate Dashboard, Boss! 🌟</h1>
            
            {/* Cards Section (Statistik) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Sales & Komisi - HARDCODE untuk sementara, butuh API Analytics */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-rose-gold">
                    <p className="text-sm text-gray-500 font-semibold">Total Sales (MoM)</p>
                    <p className="text-3xl font-extrabold mt-1">Rp 12.540.000</p>
                    <p className="text-sm text-green-500 mt-2">▲ 12% dari bulan lalu</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-pink-600">
                    <p className="text-sm text-gray-500 font-semibold">Komisi Menanti</p>
                    <p className="text-3xl font-extrabold mt-1">Rp 1.254.000</p>
                    <p className="text-sm text-gray-500 mt-2">Pembayaran berikutnya: 25 Okt</p>
                </div>
                {/* To-Do Selesai Card (MENGGUNAKAN LOGIC BARU) */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
                    <p className="text-sm text-gray-500 font-semibold">To-Do Selesai</p>
                    <p className="text-3xl font-extrabold mt-1">{progress}%</p>
                    <p className="text-sm text-blue-500 mt-2">Selesai: {completedTodosCount} / {totalTodos}</p>
                </div>
            </div>

            {/* To-Do List Section */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">Your Priority To-Do List</h2>
                
                {/* --- Konten Dinamis --- */}
                {isLoading ? (
                    <div className="text-center py-8 text-gray-500">
                         <RocketIcon className="animate-spin w-6 h-6 mx-auto mb-2" />
                         <p>Mengambil data To-Do List...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-600 bg-red-50 rounded-lg">
                        <CrossCircledIcon className="w-6 h-6 mx-auto mb-2" />
                        <p>Error koneksi: {error}</p>
                    </div>
                ) : (
                    <ul className="space-y-3 mb-6">
                        {todos.length === 0 ? (
                            <div className="text-center py-4 text-gray-500 border border-dashed p-4 rounded-lg">
                                <p>🎉 Semua To-Do Selesai! Saatnya santai, Bro.</p>
                            </div>
                            ) : (
                            todos.map((todo) => (
                                <li 
                                    key={todo.id} 
                                    className={`p-4 rounded-lg shadow-sm flex justify-between items-center transition-all ${
                                            todo.isCompleted 
                                                ? 'bg-green-50 text-gray-500 line-through' 
                                                : 'bg-white hover:shadow-lg hover:bg-pale-pink/50' 
                                        }`}
                                >
                                    <div className='flex items-center space-x-3'>
                                        {/* CHECKBOX/TOGGLE STATUS */}
                                        <input 
                                            type="checkbox" 
                                            checked={todo.isCompleted} 
                                            onChange={() => handleToggleComplete(todo.id, todo.isCompleted)} 
                                            className="h-5 w-5 text-rose-gold border-gray-300 rounded focus:ring-rose-gold cursor-pointer"
                                        />
                                        <div>
                                            <span className="text-gray-800">{todo.title}</span>
                                            {todo.description && <p className='text-xs text-gray-400 mt-1'>{todo.description}</p>}
                                        </div>
                                    </div>
                                    
                                    {/* ACTION BUTTONS (Delete) */}
                                    <button 
                                        onClick={() => handleDeleteTodo(todo.id)} 
                                        className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors"
                                        aria-label="Delete todo"
                                    >
                                        <Trash2Icon className="w-5 h-5" />
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                )}
                {/* --- FORM TAMBAH TODO BARU (Fix Styling & Logic) --- */}
                <form onSubmit={handleAddTodo} className="mt-4 flex space-x-2 items-center"> 
                    <input 
                        type="text"
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                        placeholder="Tambahkan tugas baru..."
                        // Fix glitch visual: Tambah flex-grow
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-rose-gold focus:border-rose-gold transition-colors" 
                        disabled={isPosting}
                    />

                    <button 
                        type="submit" 
                        // Logic disable: Hanya aktif jika ada teks dan tidak sedang posting
                        disabled={isPosting || !newTodoTitle.trim()} 
                        // Fix glitch visual: Pastikan button memiliki ukuran tetap
                        className="bg-rose-gold text-white font-semibold px-4 py-3 rounded-lg flex items-center justify-center transition-opacity hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed flex-none"
                    >
                        {isPosting ? '...' : <PlusIcon className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </>
    );
}

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <DashboardContent />
        </DashboardLayout>
    );
}