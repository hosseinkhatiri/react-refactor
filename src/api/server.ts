import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser'

import orm from "./orm";

import { ToDoItem } from "../types/ToDoItem";

const app = express();
const port = 3001;

app.use(cors())
app.use(bodyParser.json())

function wait(timeout: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, timeout))
}

const ToDoItems: Record<number, ToDoItem> = {
  1: { id: 1, description: "Buy milk", completed: true },
  2: { id: 2, description: "Pick up dog from daycare", completed: true },
  3: {
    id: 3,
    description: `Make playlist for mom's birthday party`,
    completed: false,
  },
  4: { id: 4, description: "Sign up for gym", completed: true },
  5: {
    id: 5,
    description: "Watch the season finale of Silicon Valley",
    completed: false,
  },
  6: {
    id: 6,
    description: `Book flights for cousin's wedding`,
    completed: false,
  },
};

app.get("/items", async (req, res) => {
  await wait(Math.random() * 250 + 50)
  res.send(orm.getList())
});

app.get("/users", async (req, res) => {
  await wait(Math.random() * 250 + 50)
  res.send(orm.getUsers())
});

app.delete("/items/:id", async (req, res) => {
  await wait(Math.random() * 250 + 50)
  orm.deleteItem(Number(req.params.id))
  res.send()
});

app.post("/items", async (req, res) => {
  await wait(Math.random() * 250 + 50)
  console.log(req.body)
  const item = orm.addItem(req.body)
  res.send(item)
});

app.put("/items/:id/toggle", async (req, res) => {
  await wait(Math.random() * 250 + 50)
  orm.toggleItem(Number(req.params.id))
  res.send()
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
