import Header from './Header';
import useStore from '@/stores/useStore';
import ProductosView from '../Views/ProductosView';
import UsuariosView from '../Views/UsuariosView';
import VentasView from '../Views/VentasView';
import ProveedoresView from '../Views/ProveedoresView';

const MainLayout = () => {
  const { currentSection } = useStore();

  const renderCurrentView = () => {
    switch (currentSection) {
      case 'productos':
        return <ProductosView />;
      case 'usuarios':
        return <UsuariosView />;
      case 'ventas':
        return <VentasView />;
      case 'proveedores':
        return <ProveedoresView />;
      default:
        return <ProductosView />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;