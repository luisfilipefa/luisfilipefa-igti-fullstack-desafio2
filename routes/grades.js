import { EROFS } from "constants";
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

    if (!student || !subject || !type || !value) {
      throw new Error(
        "The following properties are necessary to add a new grade: student, subject, type and value. Check API docs for more info"
      );
    }

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

    if (!student || !subject || !type || !value) {
      throw new Error(
        "The following properties are necessary to add a new grade: student, subject, type and value. Check API docs for more info"
      );
    }

    const studentIndex = grades.grades.findIndex(
      (grade) => grade.id === Number(req.params.id)
    );

    if (studentIndex === -1) {
      throw new Error("Student not found, check id.");
    }

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
  res.status(500).send(err.message);
});
export default router;
