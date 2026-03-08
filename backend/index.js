const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// =====================
// ENDPOINTS DE CATEGORIAS
// =====================

// LIST
app.get("/api/categories", async (req, res) => {
    const items = await prisma.category.findMany({
        orderBy: { id: "desc" }
    });
    res.json(items);
});

// GET ONE
app.get("/api/categories/:id", async (req, res) => {
    const id = Number(req.params.id);
    const item = await prisma.category.findUnique({ where: { id } });
    if (!item) {
        return res.status(404).json({ error: "Categoria no encontrada" });
    }
    res.json(item);
});

// CREATE
app.post("/api/categories", async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "El nombre es requerido" });
    }
    const created = await prisma.category.create({
        data: {
            name: String(name).trim()
        }
    });
    res.status(201).json(created);
});

// UPDATE
app.put("/api/categories/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { name } = req.body;
    const updated = await prisma.category.update({
        where: { id },
        data: {
            name: name === undefined ? undefined : String(name).trim()
        }
    });
    res.status(200).json(updated);
});

// DELETE
app.delete("/api/categories/:id", async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prisma.category.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: "Categoria no encontrada" });
    }
});

// =====================
// ENDPOINTS DE PRODUCTOS
// =====================

// LIST
app.get("/api/products", async (req, res) => {
    const items = await prisma.product.findMany({
        orderBy: { id: "desc" },
        include: { category: true }
    });
    res.json(items);
});

// GET ONE
app.get("/api/products/:id", async (req, res) => {
    const id = Number(req.params.id);
    const item = await prisma.product.findUnique({
        where: { id },
        include: { category: true }
    });
    if (!item) {
        return res.status(404).json({ error: "Product not found" });
    }
    res.json(item);
});

// CREATE
app.post("/api/products", async (req, res) => {
    const { name, description, price, categoryId } = req.body;
    if (!name || !price || !categoryId) {
        return res.status(400).json({ error: "Datos requeridos!" });
    }
    const created = await prisma.product.create({
        data: {
            name: String(name).trim(),
            description: description ? String(description).trim() : null,
            price: Number(price),
            categoryId: Number(categoryId)
        },
        include: { category: true }
    });
    res.status(201).json(created);
});

// UPDATE
app.put("/api/products/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { name, description, price, categoryId } = req.body;
    const updated = await prisma.product.update({
        where: { id },
        data: {
            name: name === undefined ? undefined : String(name).trim(),
            description: description === undefined ? undefined : (description ? String(description).trim() : null),
            price: price === undefined ? undefined : Number(price),
            categoryId: categoryId === undefined ? undefined : Number(categoryId)
        },
        include: { category: true }
    });
    res.status(200).json(updated);
});

// DELETE
app.delete("/api/products/:id", async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prisma.product.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});

app.listen(4000, () => console.log("Server is running on http://localhost:4000"));