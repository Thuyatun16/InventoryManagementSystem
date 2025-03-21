require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const supplierRouters = require('./routes/supplierRoute');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Direct routes without /api prefix to match your frontend
app.use('/', userRoutes); // For /login and /register
app.use('/', productRoutes); // For all product routes
app.use('/', purchaseOrderRoutes); // For all purchase order routes
app.use('/',customerRoutes);
app.use('/',supplierRouters);
// Error Handler
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});