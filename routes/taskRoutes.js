const router = require("express").Router();
const Task = require("../models/Task");
const MiddleAuth = require("../middlewares/authentication");
router.use(MiddleAuth);

router.post("/create", async (req, res) => {
  const { title, status, description, due_date } = req.body;

  if (!title) {
    res.status(422).json({ error: "Título é obrigatório!" });
    return;
  }

  const taskExist = await Task.findOne({ title: title, id_user: req.user_id });
  console.log(taskExist && taskExist.id_user, req.user_id);

  if (taskExist) {
    return res
      .status(422)
      .json({ msg: "Já existe uma tarefa com esse título." });
  }

  const task = {
    id_user: req.user_id,
    title,
    status: status ? status : 1,
    description,
    due_date,
  };

  try {
    await Task.create(task);
    res.status(201).json({ message: "Tarefa criada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ id_user: req.user_id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.patch("/update/:id", async (req, res) => {
  const id = req.params.id;

  const { title, status, description, due_date } = req.body;

  if (status > 3 || status < 0) {
    return res.status(422).json({ msg: "Selecione o status da tarefa." });
  }

  const task = {
    title,
    status,
    description,
    due_date,
  };

  try {
    const updateTask = await Task.updateOne(
      { _id: id, id_user: req.user_id },
      task
    );

    if (updateTask.matchedCount === 0) {
      res.status(422).json({ message: "Tarefa não encontrado." });
      return;
    }
    res.status(200).json({ message: "Tarefa atualizada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  const deleteTask = await Task.findOne({ _id: id, id_user: req.user_id });

  if (!deleteTask) {
    res.status(422).json({ message: "Tarefa não encontrada" });
    return;
  }
  try {
    await Task.deleteOne({ _id: id });
    res.status(200).json({ message: "Tarefa removida com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
