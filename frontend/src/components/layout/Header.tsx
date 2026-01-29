import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scan, Search, User, Zap, Package, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { path: '/', label: 'Home', icon: Zap },
  { path: '/scan', label: 'Scan', icon: Scan },
  { path: '/browse', label: 'Browse', icon: Search },
  { path: '/collection', label: 'Collection', icon: Package },
];

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-primary/20"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              className="relative w-10 h-10 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg group-hover:bg-primary/40 transition-colors" />
              <span className="relative text-2xl">⚡</span>
            </motion.div>
            <span className="font-bold text-xl tracking-tight">
              <span className="text-primary">Poké</span>
              <span className="text-foreground">tab</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              const isProtected = item.path !== '/';

              // Don't show protected routes if not authenticated
              if (isProtected && !isAuthenticated) return null;

              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="relative"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary/20 rounded-md -z-10"
                        transition={{ type: 'spring', bounce: 0.3 }}
                      />
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Auth Button / User Menu */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/collection" className="cursor-pointer">
                    <Package className="w-4 h-4 mr-2" />
                    My Collection
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link to="/login">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-t border-primary/10">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const isProtected = item.path !== '/';

            // Don't show protected routes if not authenticated
            if (isProtected && !isAuthenticated) return null;

            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </motion.header>
  );
};
