import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import useStore from '@/stores/useStore';

const LoginForm = ({ onToggleForm }) => {
  const { login } = useStore();
  const [formData, setFormData] = useState({
    email: '',
    contraseña: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // la verificación ahora se hace en el backend mediante /api/usuarios/login


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validar campos
    if (!formData.email || !formData.contraseña) {
      setError('Por favor, completa todos los campos');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, contraseña: formData.contraseña })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Credenciales inválidas');
        return;
      }

      // login exitoso
      login(data);
    } catch (err) {
      console.error('Error en el inicio de sesión:', err);
      setError('Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-elevated animate-scale-in">
      <CardHeader className="text-center pb-6">
        <div className="text-6xl mb-4">🥭</div>
        <CardTitle className="text-2xl font-bold text-center">
          ElMango 2.0
        </CardTitle>
        <p className="text-muted-foreground">Inicia sesión en tu cuenta</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contraseña">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="contraseña"
                name="contraseña"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.contraseña}
                onChange={handleChange}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <Button
              variant="link"
              className="p-0 h-auto text-primary"
              onClick={onToggleForm}
            >
              Regístrate aquí
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;