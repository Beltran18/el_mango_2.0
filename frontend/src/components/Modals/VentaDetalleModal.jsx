import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DollarSign, Package } from 'lucide-react';

const VentaDetalleModal = ({ isOpen, onClose, venta }) => {
  if (!venta) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Detalle de Venta #{venta.id_venta}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información general */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Fecha</p>
                <p className="font-medium">{formatDate(venta.fecha)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-primary">
                  {formatPrice(venta.total)}
                </p>
              </div>
            </div>
          </div>

          {/* Lista de productos */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Productos ({venta.productos?.length || 0})
            </h4>
            
            <div className="space-y-3">
              {venta.productos?.map((producto, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h5 className="font-medium">{producto.nombre}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">
                        Cant: {producto.cantidad}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatPrice(producto.precio_unitario)} c/u
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatPrice(producto.subtotal)}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-muted-foreground text-center py-4">
                  No hay productos en esta venta
                </p>
              )}
            </div>
          </div>

          {/* Resumen */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Final:</span>
              <span className="text-primary">{formatPrice(venta.total)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VentaDetalleModal;