import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ShoppingCart, Package } from 'lucide-react';
import useStore from '@/stores/useStore';
import ProductoModal from '../Modals/ProductoModal';
import ConfirmDialog from '../Common/ConfirmDialog';
import { toast } from '@/hooks/use-toast';

const ProductosView = () => {
  const { 
    productos, 
    setProductos, 
    deleteProducto, 
    addToCarrito,
    isLoading,
    setLoading 
  } = useStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, producto: null });

  // Simulamos datos iniciales
  useEffect(() => {
    if (productos.length === 0) {
      const productosSimulados = [
        {
          id_producto: 1,
          nombre: 'Mango Tommy',
          descripcion: 'Mango premium tipo Tommy, dulce y jugoso',
          precio: 2500
        },
        {
          id_producto: 2,
          nombre: 'Mango Azúcar',
          descripcion: 'Mango tradicional muy dulce',
          precio: 2000
        },
        {
          id_producto: 3,
          nombre: 'Mango Verde',
          descripcion: 'Mango verde para ensaladas',
          precio: 1500
        }
      ];
      setProductos(productosSimulados);
    }
  }, [productos.length, setProductos]);

  const handleEdit = (producto) => {
    setEditingProducto(producto);
    setIsModalOpen(true);
  };

  const handleDelete = (producto) => {
    setDeleteDialog({ open: true, producto });
  };

  const confirmDelete = async () => {
    if (deleteDialog.producto) {
      try {
        setLoading(true);
        // Aquí iría la llamada al backend
        deleteProducto(deleteDialog.producto.id_producto);
        toast({
          title: "Producto eliminado",
          description: `${deleteDialog.producto.nombre} ha sido eliminado correctamente.`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el producto.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
        setDeleteDialog({ open: false, producto: null });
      }
    }
  };

  const handleAddToCarrito = (producto) => {
    addToCarrito(producto);
    toast({
      title: "Producto agregado",
      description: `${producto.nombre} agregado al carrito.`
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            Productos
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tu inventario de productos
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingProducto(null);
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary-dark"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Producto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Productos</p>
                <p className="text-2xl font-bold">{productos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Badge variant="outline" className="h-8 w-8 text-success border-success">
                $
              </Badge>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Precio Promedio</p>
                <p className="text-2xl font-bold">
                  {productos.length > 0 
                    ? formatPrice(productos.reduce((sum, p) => sum + p.precio, 0) / productos.length)
                    : '$0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-warning" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Más Caro</p>
                <p className="text-2xl font-bold">
                  {productos.length > 0 
                    ? formatPrice(Math.max(...productos.map(p => p.precio)))
                    : '$0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      {productos.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay productos</h3>
            <p className="text-muted-foreground mb-4">
              Comienza agregando tu primer producto al inventario
            </p>
            <Button 
              onClick={() => {
                setEditingProducto(null);
                setIsModalOpen(true);
              }}
              className="bg-primary hover:bg-primary-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Primer Producto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <Card key={producto.id_producto} className="card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{producto.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {producto.descripcion}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(producto.precio)}
                  </div>
                  <Badge variant="outline">
                    ID: {producto.id_producto}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(producto)}
                    className="flex-1"
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Editar
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(producto)}
                    className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => handleAddToCarrito(producto)}
                    className="bg-success hover:bg-success/90 text-success-foreground"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <ProductoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProducto(null);
        }}
        producto={editingProducto}
      />

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, producto: null })}
        onConfirm={confirmDelete}
        title="Eliminar Producto"
        description={`¿Estás seguro de que deseas eliminar "${deleteDialog.producto?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};

export default ProductosView;