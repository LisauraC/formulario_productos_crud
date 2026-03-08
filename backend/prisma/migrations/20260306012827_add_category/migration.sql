-- Crear tabla Category
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- Insertar categoría por defecto para productos existentes
INSERT INTO "Category" ("id", "name") VALUES (1, 'Sin categoría');

-- Agregar columna con default para filas existentes
ALTER TABLE "Product" ADD COLUMN "categoryId" INTEGER NOT NULL DEFAULT 1 REFERENCES "Category"("id");