const express = require("express"); // es para crear el servidor
const cors = require("cors");// es para permitir que el frontend pueda hacer peticiones al backend sin problemas de CORS
const { PrismaClient } = require("@prisma/client");// es para conectarnos a la base de datos y hacer consultas a través de Prisma, que es un ORM (Object-Relational Mapping) que nos facilita el trabajo con la base de datos

const app = express();// es para crear una instancia de la aplicación Express, que es el framework que vamos a usar para crear el servidor
const prisma = new PrismaClient();// es para crear una instancia de Prisma Client, que nos permite interactuar con la base de datos

app.use(cors());// es para habilitar CORS en el servidor, lo que permite que el frontend pueda hacer peticiones al backend sin problemas de CORS
app.use(express.json());// es para habilitar el parsing de JSON en las peticiones, lo que nos permite recibir datos en formato JSON desde el frontend

// LIST
app.get("/api/products", async (req, res) => {
    const items = await prisma.product.findMany({
        orderBy: { id: "desc" }
    });
    res.json(items);
});

//GET ONE
app.get("/api/products/:id", async (req, res) => {// sirve para manejar las peticiones GET a la ruta "/api/notes/:id", donde ":id" es un parámetro que representa el ID de la nota que queremos obtener. Esta ruta se utiliza para obtener una nota específica de la base de datos
    const id = Number(req.params.id);// es para obtener el ID de la nota que queremos obtener desde los parámetros de la ruta, y convertirlo a un número, ya que los parámetros de la ruta son cadenas de texto por defecto
    const item = await prisma.product.findUnique({ where: { id: parseInt(id) } });// es para obtener la nota específica de la base de datos usando Prisma Client, buscando por el ID que hemos obtenido de los parámetros de la ruta
    if (!item) {// es para verificar si la nota existe en la base de datos. Si no existe, se devuelve un error 404 al cliente
        return res.status(404).json({ error: "Product not found" });
    }
    res.json(item);// es para enviar la respuesta al cliente en formato JSON, que es el formato que el frontend espera recibir
});

//CREATE
app.post("/api/products", async (req, res) => {// es para manejar las peticiones POST a la ruta "/api/notes", que es la ruta que vamos a usar para crear una nueva nota en la base de datos
    const { name, description, price } = req.body;// es para obtener los datos de la nueva nota desde el cuerpo de la petición, que se espera que esté en formato JSON
    if (!name || !description || !price) {// es para verificar que se han proporcionado todos los datos necesarios para crear la nueva nota. Si falta algún dato, se devuelve un error 400 al cliente
        return res.status(400).json({ error: "Datos requeridos!" });
    }

    const created = await prisma.product.create({
        data: {
            name: String(name).trim(),
            description: description ? String(description).trim() : null,
            price: Number(price),
        },
    });// es para crear una nueva nota en la base de datos usando Prisma Client, pasando los datos que hemos obtenido del cuerpo de la petición

    res.status(201).json(created);// es para enviar la respuesta al cliente en formato JSON, que es el formato que el frontend espera recibir
});

//UPDATE
app.put("/api/products/:id", async (req, res) => {// es para manejar las peticiones PUT a la ruta "/api/notes/:id", donde ":id" es un parámetro que representa el ID de la nota que queremos actualizar. Esta ruta se utiliza para actualizar una nota específica en la base de datos
    const id = Number(req.params.id);// es para obtener el ID de la nota que queremos actualizar desde los parámetros de la ruta, y convertirlo a un número, ya que los parámetros de la ruta son cadenas de texto por defecto
    const { name, description, price } = req.body;// es para obtener los datos actualizados de la nota desde el cuerpo de la petición, que se espera que esté en formato JSON

    const updated = await prisma.product.update({
        where: { id },
        data: {
            name: name === undefined ? undefined : String(name).trim(),
            description: description === undefined ? undefined : (description ? String(description).trim() : null),
            price: price === undefined ? undefined : Number(price),
        },
    });
    res.status(200).json(updated);  // es para actualizar la nota específica en la base de datos usando Prisma Client, buscando por el ID que hemos obtenido de los parámetros de la ruta, y pasando los datos actualizados que hemos obtenido del cuerpo de la petición 
});

//DELETE
app.delete("/api/products/:id", async (req, res) => {// es para manejar las peticiones DELETE a la ruta "/api/notes/:id", donde ":id" es un parámetro que representa el ID de la nota que queremos eliminar. Esta ruta se utiliza para eliminar una nota específica de la base de datos
    const id = Number(req.params.id);// es para obtener el ID de la nota que queremos eliminar desde los parámetros de la ruta, y convertirlo a un número, ya que los parámetros de la ruta son cadenas de texto por defecto
    try {
        await prisma.product.delete({ where: { id } });// es para eliminar la nota específica de la base de datos usando Prisma Client, buscando por el ID que hemos obtenido de los parámetros de la ruta
        res.status(204).send(); // es para enviar una respuesta al cliente con el código de estado 204 (No Content), lo que indica que la eliminación fue exitosa pero no hay contenido que enviar en la respuesta
    }
    catch (error) {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});

app.listen(4000, () => console.log("Server is running on http://localhost:4000"));// es para iniciar el servidor y hacer que escuche en el puerto 4000, lo que significa que el servidor estará disponible en la dirección http://localhost:4000
    