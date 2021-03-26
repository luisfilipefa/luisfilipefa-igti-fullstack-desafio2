import express from "express";
import { promises as fs } from "fs";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const grades = JSON.parse(await fs.readFile(global.gradesFile));

    res.send(grades);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const grades = JSON.parse(await fs.readFile(global.gradesFile));

    const { student, subject, type, value } = req.body;

    const newGrade = {
      id: grades.nextId++,
      student,
      subject,
      type,
      value,
      timestamp: new Date(),
    };

    grades.grades.push(newGrade);

    await fs.writeFile(global.gradesFile, JSON.stringify(grades));

    res.send(newGrade);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const grades = JSON.parse(await fs.readFile(global.gradesFile));

    const { student, subject, type, value } = req.body;

    const studentIndex = grades.grades.findIndex(
      (grade) => grade.id === Number(req.params.id)
    );

    const newGrade = {
      id: Number(req.params.id),
      student,
      subject,
      type,
      value,
    };

    grades.grades[studentIndex] = newGrade;

    await fs.writeFile(global.gradesFile, JSON.stringify(grades));

    res.send(newGrade);
  } catch (err) {
    next(err);
  }
});

/*
[] - Crie um endpoint para atualizar uma grade. Este endpoint deverá receber como parâmetros o id da grade a ser alterada e os campos student, subject, type e value. O endpoint deverá validar se a grade informada existee,caso não exista,deverá retornar um erro. Caso exista, o endpoint deverá atualizar as informações recebidas por parâmetros no registro e realizar sua atualização com os novos dados alterados no arquivo grades.json.
*/

router.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send("something went wrong, check console.");
});
export default router;
