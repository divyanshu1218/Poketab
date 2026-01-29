import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, error, loading, isAuthenticated } = useAuth();

    const from = (location.state as any)?.from?.pathname || '/scan';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleLogin = async (data: { email: string; password: string }) => {
        try {
            await login(data);
            // Navigation handled by useEffect
        } catch (err) {
            // Error handled by AuthContext
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
                    <CardDescription className="text-center">
                        Login to continue your Pokémon journey
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm onSubmit={handleLogin} error={error} loading={loading} />

                    <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground">Don't have an account? </span>
                        <Link to="/register" className="text-primary hover:underline font-medium">
                            Register here
                        </Link>
                    </div>

                    <div className="mt-4 text-center">
                        <Link to="/" className="text-sm text-muted-foreground hover:underline">
                            ← Back to home
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
