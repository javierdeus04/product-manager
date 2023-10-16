const ProductManager = require('./productManager')
const express = require('express')

const app = express();
app.use(express.urlencoded({ extended: true }))

const productManagerOne = new ProductManager();

app.get('/products', async (req, res) => {
    try {
        const products = await productManagerOne.getProducts();
        const {query} = req;
        const {limit} = query;
        if (!limit) {
            res.json(products)
        } else {
            const result = products.slice(0, limit)
            res.json(result)
        }        
    } catch {
        res.status(500).send({ error: 'Error al obtener productos' });       
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid)
        const product = await productManagerOne.getProductsById(id)   
        if (!product) {
            res.json({error: 'Producto no encontrado'})
        } else {            
            res.json(product) 
        }            
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener productos' });
    }
})

app.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080')
})
