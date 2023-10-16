const fs = require('fs');

class ProductManager {

    constructor() {
        this.products = [];
        this.lastId = 0;
        this.path = './products.json';
    }

    getProducts = async (silent = false) => {
        try {
            const fileExists = fs.existsSync(this.path);
            if (fileExists) {
                
                const listProducts = await fs.promises.readFile(this.path, 'utf-8');
                this.products = JSON.parse(listProducts)
                this.lastId = Math.max(...this.products.map(product => product.id));
                if (!silent) {
                    //console.log(this.products);
                }
                return this.products
            } else {
                this.products = []
                if (!silent) {
                    console.log(this.products);
                }
            }
        } catch (error) {
            console.error('Error al leer el archivo:', error);
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            await this.getProducts(true);
            if (this.products.length === 0) {
                this.lastId = 0;
            }
            const id = this.lastId + 1;
            const product = {
                id,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            };
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log("ERROR: Todos los campos son obligatorios");
                return;
            }
            const codeExists = this.products.some(p => p.code === code);
            if (codeExists) {
                console.log(`ERROR: El código '${code}' ya existe.`);
                return;
            }
            this.products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(this.products), 'utf-8');
            this.lastId = id;
            console.log('Producto agregado correctamente');
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error.message}`);
        }
    }

    getProductsById = async (id) => {
        try {
            await this.getProducts(true);
            const product = this.products.find(product => product.id === id)
            if (product) {
                return product
            } else {
                console.log('ERROR: Producto no encontrado')
            }
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error.message}`);
        }
    }

    deleteProduct = async (id) => {
        try {
            await this.getProducts(true);
            const productToDelete = this.products.findIndex(product => product.id === id)
            if (productToDelete !== -1) {
                this.products.splice(productToDelete, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(this.products), 'utf-8');
                console.log(`El producto ${id} ha sido eliminado correctamente`)
            } else {
                console.log('ERROR: Producto no encontrado');
            }
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error.message}`);
        }
    }

    updateProduct = async (id, updatedFields) => {
        try {
            await this.getProducts(true);
            const productToUpdate = this.products.findIndex(product => product.id === id)
            if (productToUpdate === -1) {
                console.log('ERROR: Producto no encontrado');
                return;
            }
            const existingProduct = this.products[productToUpdate]
            for (const field in updatedFields) {
                if (existingProduct.hasOwnProperty(field)) {
                    existingProduct[field] = updatedFields[field]
                } else {
                    console.log('ERROR: El campo que esta intentando modificar no existe');
                    return;
                }
            }
            this.products[productToUpdate] = existingProduct;
            await fs.promises.writeFile(this.path, JSON.stringify(this.products), 'utf-8');
            console.log(`El producto ${id} ha sido actualizado correctamente`)
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error.message}`);
        }
    }
}

module.exports = ProductManager;



