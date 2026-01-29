import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';

const Register = () => {
    const navigate = useNavigate();
    const { register, error, loading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/scan', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleRegister = async (data: { username: string; email: string; password: string }) => {
        try {
            await register(data);
            // Navigation handled by useEffect after auto-login
        } catch (err) {
            // Error handled by AuthContext
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
                    <CardDescription className="text-center">
                        Join PokéTab and start your collection
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm onSubmit={handleRegister} error={error} loading={loading} />

                    <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Login here
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

export default Register;
