const { db } = require('../config/db');
// const cron = require('node-cron');

// // Define the scheduled task
// cron.schedule('0 0 * * *', async () => {
//     try {
//         console.log('Running scheduled analytics update...');
//         // Your aggregation and update logic here
//         const query = `
//             INSERT INTO sales_analytics (
//                 date,
//                 barcode,
//                 item_name,
//                 total_sales,
//                 revenue,
//                 avg_price,
//                 stock_level
//             )
//             SELECT
//                 DATE(oh.order_date) AS date,
//                 i.barcode,
//                 i.name AS item_name,
//                 SUM(oi.quantity) AS total_sales,
//                 SUM(oi.subtotal) AS revenue,
//                 AVG(oi.price_at_time) AS avg_price,
//                 i.quantity AS stock_level
//             FROM
//                 order_items oi
//             JOIN
//                 order_history oh ON oi.order_id = oh.order_id
//             JOIN
//                 items i ON oi.item_id = i.id
//             WHERE
//                 oh.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY)
//             GROUP BY
//                 DATE(oh.order_date), i.barcode, i.name, i.quantity
//             ON DUPLICATE KEY UPDATE
//                 total_sales = VALUES(total_sales),
//                 revenue = VALUES(revenue),
//                 avg_price = VALUES(avg_price),
//                 stock_level = VALUES(stock_level);
//         `;
//         await db.promise().query(query);
//     } catch (error) {
//         console.error('Error during scheduled analytics update:', error);
//     }
// });

const getInventoryAnalytics = async (req, res) => {
    try {
        //console.log('fetching analytics -----------');
        // Check if user is admin
        // if (!req.user?.isAdmin) {
        //     return res.status(403).json({ message: 'Admin access required' });
        // }

        const timeRange = req.query.timeRange || 'month'; // Default to 'month'

        // Define date range based on timeRange
        let dateCondition = '';
        switch (timeRange) {
            case 'week':
                dateCondition = 'DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)';
                break;
            case 'month':
                dateCondition = 'DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)';
                break;
            case 'year':
                dateCondition = 'DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR)';
                break;
            default:
                dateCondition = 'DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)';
        }
        //TOtal order
        const [totalOrdersResult] = await db.promise().query(`
            SELECT COUNT(order_id) as totalOrders
            FROM order_history
            WHERE order_date >= ${dateCondition}
        `);

        const totalOrders = totalOrdersResult[0].totalOrders || 0;
        //console.log(totalOrders, 'totalOrders');
        // Get revenue growth
        const [currentPeriodRevenue] = await db.promise().query(`
            SELECT
                SUM(revenue) as totalRevenue
            FROM
                sales_analytics
            WHERE
                date >= ${dateCondition}
        `);
        const [previousPeriodRevenue] = await db.promise().query(`
            SELECT
                SUM(revenue) as totalRevenue
            FROM
                sales_analytics
            WHERE
                date >= DATE_SUB(CURRENT_DATE, INTERVAL 2 ${timeRange.toUpperCase()})
                AND date < DATE_SUB(CURRENT_DATE, INTERVAL 1 ${timeRange.toUpperCase()})    
        `);
        const currentRevenue = currentPeriodRevenue[0].totalRevenue || 0;
        const previousRevenue = previousPeriodRevenue[0].totalRevenue || 0;
        //console.log(currentPeriodRevenue[0],'This is current period revenue');//testing
        const growth = previousRevenue > 0 ?
            ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
        const revenueGrowth = Math.round(growth);
        // Get product analytics
        const productQuery = `
    SELECT 
        sa.barcode,
        sa.item_name,
        MAX(sa.date) AS latest_date,
        i.quantity AS stock_level
    FROM 
        sales_analytics sa
    JOIN 
        items i ON sa.barcode = i.barcode
    WHERE 
        sa.date >= ${dateCondition}
    GROUP BY 
        sa.barcode, sa.item_name, i.quantity
`;
        //orderGrowth
        const [currentPeriodOrders] = await db.promise().query(`
         SELECT COUNT(order_id) as total_orders
        FROM order_history
        WHERE order_date >= ${dateCondition}`);
        const [previousPeriodOrders] = await db.promise().query(`
      SELECT COUNT(order_id) as total_orders
      FROM order_history
     WHERE order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 2 ${timeRange.toUpperCase()})
     AND order_date < DATE_SUB(CURRENT_DATE, INTERVAL 1 ${timeRange.toUpperCase()})`);
        const currentOrders = currentPeriodOrders[0].total_orders || 0;
        const previousOrders = previousPeriodOrders[0].total_orders || 0;
        const orderGrowth = previousOrders > 0 ?Math.round(
            ((currentOrders - previousOrders) / previousOrders)) * 100 : 0;
        //console.log(orderGrowth, 'orderGrowth');


        // Get monthly profit trends
        const monthlyProfitQuery1 = `
            SELECT 
                DATE_FORMAT(date, '%Y-%m') as month,
                SUM(revenue) as totalRevenue,
                SUM(total_sales * avg_price) as total_cost,
                SUM(revenue - (total_sales * avg_price)) as total_profit
            FROM sales_analytics1
            WHERE date >= ${dateCondition}
            GROUP BY DATE_FORMAT(date, '%Y-%m')
            ORDER BY month ASC
        `;
        const monthlyProfitQuery = `SELECT 
    DATE_FORMAT(oh.order_date, '%Y-%m') AS month,
    SUM(((oh.final_amount / oh.total_amount) * oi.price_at_time - i.price) * oi.quantity) AS total_profit
FROM 
    order_items oi
JOIN 
    items i ON oi.item_id = i.id
JOIN 
    order_history oh ON oi.order_id = oh.order_id
WHERE 
    oh.order_date >= ${dateCondition}
GROUP BY 
    DATE_FORMAT(oh.order_date, '%Y-%m')`;
           
        // Get top products
        const topProductsQuery = `
            SELECT 
                item_name,
                SUM(total_sales) as sales
            FROM sales_analytics
            WHERE date >= ${dateCondition}
            GROUP BY item_name
            ORDER BY sales DESC
            LIMIT 5
        `;

        // Get sales summary
        const salesSummaryQuery = `
            SELECT 
                SUM(revenue) as totalRevenue,
                COUNT(DISTINCT barcode) as activeProducts
            FROM sales_analytics
            WHERE date >= ${dateCondition}
        `;

        // Get recent orders
        const recentOrdersQuery = `
            SELECT 
                oh.order_id,
                oh.order_date,
                oh.total_amount,
                u.username as customer_name
            FROM order_history oh
            JOIN user_table u ON oh.user_id = u.id
            WHERE oh.order_date >= ${dateCondition}
            ORDER BY oh.order_date DESC
            LIMIT 5
        `;

        // Get inventory alerts
        // Get inventory alerts
const inventoryAlertsQuery = `
    SELECT 
        i.id,
        i.name AS product_name,
        i.quantity AS stock_level,
        CASE 
            WHEN i.quantity <= 10 THEN 'Low Stock'
            ELSE 'Normal'
        END AS type,
        CASE 
            WHEN i.quantity <= 10 THEN CONCAT('Only ', i.quantity, ' units left!')
            ELSE 'Stock level is normal.'
        END AS message
    FROM 
        items i
    WHERE 
        i.quantity <= 10
    ORDER BY 
        i.quantity ASC
`;

        // Execute all queries
        const [productResults] = await db.promise().query(productQuery);
        const [profitResults] = await db.promise().query(monthlyProfitQuery);
        const [topProductsResults] = await db.promise().query(topProductsQuery);
        const [salesSummaryResults] = await db.promise().query(salesSummaryQuery);
        const [recentOrdersResults] = await db.promise().query(recentOrdersQuery);
        const [inventoryAlertsResults] = await db.promise().query(inventoryAlertsQuery);
        console.log(productResults, 'Product results');
        res.json({
            productAnalytics: productResults,
            monthlyProfits: profitResults,
            topProducts: topProductsResults,
            salesSummary: {
                totalRevenue: salesSummaryResults[0].totalRevenue,
                activeProducts: salesSummaryResults[0].activeProducts,
                revenueGrowth: revenueGrowth,
                orderGrowth: orderGrowth,
                totalOrders: totalOrders,
                averageOrderValue: totalOrders > 0 ? Math.round(salesSummaryResults[0].totalRevenue / totalOrders) : 0
            }, // Single object
            recentOrders: recentOrdersResults,
            inventoryAlerts: inventoryAlertsResults,


        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
};
//updateAnalytics table
const updateAnalytics = async (req, res) => {
    try {
        const { orderId } = req.body;
        const orderDetails = await db.promise().query(`
            SELECT oi.item_id, oi.quantity, oi.subtotal, i.name, i.barcode
            FROM order_items oi
            JOIN items i ON oi.item_id = i.id
            WHERE oi.order_id = ?
        `, [orderId]);
        //console.log(orderDetails[0], 'orderDetails');//testing

        for (const item of orderDetails[0]) {
            // First, get the current stock level
            const [stockResult] = await db.promise().query(
                'SELECT quantity FROM items WHERE id = ?',
                [item.item_id]
            );
            const currentStock = stockResult[0]?.quantity || 0;

            const query = `
                INSERT INTO sales_analytics (
                    date,
                    barcode,
                    item_name,
                    total_sales,
                    revenue,
                    avg_price,
                    stock_level
                )
                VALUES (
                    CURRENT_DATE,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?  /* Using direct stock level value instead of subquery */
                )
                ON DUPLICATE KEY UPDATE
                    total_sales = total_sales + VALUES(total_sales),
                    revenue = revenue + VALUES(revenue),
                    avg_price = (avg_price + VALUES(avg_price)) / 2,
                    stock_level = ?;  /* Using the same stock level for update */
            `;
               
            await db.promise().query(query, [
                item.barcode,
                item.name,
                item.quantity,
                item.subtotal,
                item.subtotal / item.quantity,
                currentStock,  // For INSERT
                currentStock   // For UPDATE
            ]);
        }
       
        res.status(200).json({ message: 'Analytics updated successfully', orderDetails: orderDetails[0] });
    }
    catch (error) {
        console.error('Error updating analytics:', error);
        res.status(500).json({ message: 'Error updating analytics', error: error.message });
    }
};
module.exports = {
    getInventoryAnalytics, updateAnalytics
};