import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

// Configuração do banco de dados PostgreSQL
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "minhamae1",
  port: 5432,
});

db.connect()
  .then(() => console.log('Conectado ao banco de dados'))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Rota para exibir os itens
app.get("/", async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM items');
    const data = result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: data,
    });
  } catch (err) {
    console.error("Erro ao recuperar itens: ", err);
    res.status(500).send('Erro ao recuperar itens');
  }
});

// Rota para adicionar um novo item
app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query('INSERT INTO items (title) VALUES ($1)', [item]);
    res.redirect("/");
  } catch (err) {
    console.error("Erro ao criar item: ", err);
    res.status(500).send('Erro ao criar item');
  }
});

// Rota para editar um item existente
app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;
  try {
    await db.query('UPDATE items SET title = $1 WHERE id = $2', [title, id]);
    res.redirect("/");
  } catch (err) {
    console.error("Erro ao atualizar item: ", err);
    res.status(500).send('Erro ao atualizar item');
  }
});

// Rota para excluir um item
app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query('DELETE FROM items WHERE id = $1', [id]);
    res.redirect("/");
  } catch (err) {
    console.error("Erro ao deletar item: ", err);
    res.status(500).send('Erro ao deletar item');
  }
});

// Inicializando o servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
