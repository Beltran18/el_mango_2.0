import { useState } from 'react';
import { Menu, User, ShoppingCart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import useStore from '@/stores/useStore';
import CarritoModal from '../Modals/CarritoModal';

const Header = () => {
  const { user, logout, currentSection, setCurrentSection, getCarritoItemCount } = useStore();
  const [showCarrito, setShowCarrito] = useState(false);
  const carritoCount = getCarritoItemCount();

  const menuItems = [
    { id: 'productos', label: 'Productos', icon: '📦' },
    { id: 'usuarios', label: 'Usuarios', icon: '👥' },
    { id: 'ventas', label: 'Ventas', icon: '💰' },
    { id: 'proveedores', label: 'Proveedores', icon: '🏪' },
  ];

  const handleLogout = () => {
    logout();
    setCurrentSection('productos');
  };

  return (
    <>
      <header className="bg-gradient-primary shadow-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-primary-foreground">
                🥭 ElMango 2.0
              </div>
            </div>

            {/* Navegación principal */}
            <nav className="hidden md:flex space-x-1">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentSection === item.id ? "secondary" : "ghost"}
                  className={`text-primary-foreground hover:bg-primary-light/20 ${
                    currentSection === item.id ? 'bg-primary-foreground/20' : ''
                  }`}
                  onClick={() => setCurrentSection(item.id)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* Acciones del usuario */}
            <div className="flex items-center space-x-2">
              {/* Carrito */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCarrito(true)}
                className="relative text-primary-foreground hover:bg-primary-light/20"
              >
                <ShoppingCart className="h-5 w-5" />
                {carritoCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {carritoCount}
                  </Badge>
                )}
              </Button>

              {/* Usuario info - solo en desktop */}
              <div className="hidden md:flex items-center text-primary-foreground text-sm">
                <User className="h-4 w-4 mr-2" />
                <span>{user?.email || 'Usuario'}</span>
              </div>

              {/* Botón directo de cerrar sesión - SIEMPRE VISIBLE */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="bg-destructive/10 border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground font-medium"
                title="Cerrar Sesión"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Cerrar Sesión</span>
              </Button>

              {/* Menú móvil */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-light/20">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {menuItems.map((item) => (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => setCurrentSection(item.id)}
                      className={`cursor-pointer ${currentSection === item.id ? 'bg-accent' : ''}`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Modal del carrito */}
      <CarritoModal 
        isOpen={showCarrito} 
        onClose={() => setShowCarrito(false)} 
      />
    </>
  );
};

export default Header;