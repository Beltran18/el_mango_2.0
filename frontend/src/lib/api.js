import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // URL del backend
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Funciones para Productos
export const productosAPI = {
  getAll: () => api.get('/productos'),
  getById: (id) => api.get(`/productos/${id}`),
  create: (producto) => api.post('/productos', producto),
  update: (id, producto) => api.put(`/productos/${id}`, producto),
  delete: (id) => api.delete(`/productos/${id}`),
};

// Funciones para Usuarios
export const usuariosAPI = {
  getAll: () => api.get('/usuarios'),
  getById: (documento) => api.get(`/usuarios/${documento}`),
  create: (usuario) => api.post('/usuarios', usuario),
  update: (documento, usuario) => api.put(`/usuarios/${documento}`, usuario),
  delete: (documento) => api.delete(`/usuarios/${documento}`),
  login: (credentials) => api.post('/usuarios/login', credentials),
  register: (usuario) => api.post('/usuarios/register', usuario),
};

// Funciones para Ventas
export const ventasAPI = {
  getAll: () => api.get('/ventas'),
  getById: (id) => api.get(`/ventas/${id}`),
  create: (venta) => api.post('/ventas', venta),
  getDetalle: (id) => api.get(`/ventas/${id}/detalle`),
};

// Funciones para Proveedores
export const proveedoresAPI = {
  getAll: () => api.get('/proveedores'),
  getById: (id) => api.get(`/proveedores/${id}`),
  create: (proveedor) => api.post('/proveedores', proveedor),
  update: (id, proveedor) => api.put(`/proveedores/${id}`, proveedor),
  delete: (id) => api.delete(`/proveedores/${id}`),
};

export default api;