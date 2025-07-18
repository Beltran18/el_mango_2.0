import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Estado de autenticación
  user: null,
  isAuthenticated: false,
  
  // Estados de datos
  productos: [],
  usuarios: [],
  ventas: [],
  proveedores: [],
  
  // Estado del carrito
  carrito: [],
  
  // Estado de UI
  isLoading: false,
  currentSection: 'productos',
  
  // Acciones de autenticación
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false, carrito: [] }),
  
  // Acciones de navegación
  setCurrentSection: (section) => set({ currentSection: section }),
  
  // Acciones de loading
  setLoading: (loading) => set({ isLoading: loading }),
  
  // Acciones de productos
  setProductos: (productos) => set({ productos }),
  addProducto: (producto) => set((state) => ({
    productos: [...state.productos, producto]
  })),
  updateProducto: (id, producto) => set((state) => ({
    productos: state.productos.map(p => p.id_producto === id ? { ...p, ...producto } : p)
  })),
  deleteProducto: (id) => set((state) => ({
    productos: state.productos.filter(p => p.id_producto !== id)
  })),
  
  // Acciones de usuarios
  setUsuarios: (usuarios) => set({ usuarios }),
  addUsuario: (usuario) => set((state) => ({
    usuarios: [...state.usuarios, usuario]
  })),
  updateUsuario: (documento, usuario) => set((state) => ({
    usuarios: state.usuarios.map(u => u.documento === documento ? { ...u, ...usuario } : u)
  })),
  deleteUsuario: (documento) => set((state) => ({
    usuarios: state.usuarios.filter(u => u.documento !== documento)
  })),
  
  // Acciones de ventas
  setVentas: (ventas) => set({ ventas }),
  addVenta: (venta) => set((state) => ({
    ventas: [...state.ventas, venta]
  })),
  
  // Acciones de proveedores
  setProveedores: (proveedores) => set({ proveedores }),
  addProveedor: (proveedor) => set((state) => ({
    proveedores: [...state.proveedores, proveedor]
  })),
  updateProveedor: (id, proveedor) => set((state) => ({
    proveedores: state.proveedores.map(p => p.id_proveedor === id ? { ...p, ...proveedor } : p)
  })),
  deleteProveedor: (id) => set((state) => ({
    proveedores: state.proveedores.filter(p => p.id_proveedor !== id)
  })),
  
  // Acciones del carrito
  addToCarrito: (producto) => set((state) => {
    const existingItem = state.carrito.find(item => item.id_producto === producto.id_producto);
    if (existingItem) {
      return {
        carrito: state.carrito.map(item =>
          item.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      };
    } else {
      return {
        carrito: [...state.carrito, { ...producto, cantidad: 1 }]
      };
    }
  }),
  
  removeFromCarrito: (id) => set((state) => ({
    carrito: state.carrito.filter(item => item.id_producto !== id)
  })),
  
  updateCarritoQuantity: (id, cantidad) => set((state) => ({
    carrito: state.carrito.map(item =>
      item.id_producto === id ? { ...item, cantidad } : item
    )
  })),
  
  clearCarrito: () => set({ carrito: [] }),
  
  // Getters computados
  getCarritoTotal: () => {
    const { carrito } = get();
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  },
  
  getCarritoItemCount: () => {
    const { carrito } = get();
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  }
}));

export default useStore;