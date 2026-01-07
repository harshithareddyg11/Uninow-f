
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import Logo from '../components/Logo';

interface LoginPageProps {
    onLogin: (isOrganizer: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent, isOrganizer: boolean) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError('Email and password are required.');
            return;
        }
        setError('');
        // In a real app, you'd validate credentials here.
        // For this mock, we'll just call the onLogin callback.
        onLogin(isOrganizer);
        navigate(isOrganizer ? '/organizer' : '/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4">
            <GlassCard className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <Logo className="h-12 w-12 mx-auto text-teal-400" />
                    <h2 className="mt-4 text-3xl font-extrabold text-white">
                        Welcome to UniNow
                    </h2>
                    <p className="mt-2 text-slate-400">Sign in to continue</p>
                </div>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                placeholder="you@mbu.asia"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                placeholder="********"
                            />
                        </div>
                    </div>
                    
                    {error && <p className="text-red-400 text-sm text-center pt-2">{error}</p>}

                    <div className="flex flex-col space-y-4 pt-4">
                         <Button type="submit" onClick={(e) => handleSubmit(e, false)} className="w-full">
                            Login as Student
                         </Button>
                         <Button type="submit" onClick={(e) => handleSubmit(e, true)} variant="secondary" className="w-full">
                            Login as Organizer
                         </Button>
                    </div>

                    <div className="text-center pt-2">
                        <p className="text-sm text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-medium text-teal-400 hover:text-teal-300">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

export default LoginPage;
