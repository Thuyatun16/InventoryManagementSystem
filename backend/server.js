require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const supplierRouters = require('./routes/supplierRoute');
const categorieRoutes = require('./routes/categoryRoutes');
const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  'https://inventory-management-system-eight-alpha.vercel.app,http://localhost:3000'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser or same-origin requests without Origin header.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'user-id', 'is-admin'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Direct routes without /api prefix to match your frontend
app.use('/', userRoutes); //
app.use('/', productRoutes); // For all product routes
app.use('/', purchaseOrderRoutes); // For all purchase order routes
app.use('/', customerRoutes);
app.use('/', supplierRouters);
app.use('/', categorieRoutes);
// Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
