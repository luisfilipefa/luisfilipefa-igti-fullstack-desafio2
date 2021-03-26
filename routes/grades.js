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

/*
- [ ]  Crie um endpoint para criar uma grade. Este endpoint deverá receber como parâmetros os campos student, subject, type e value,conforme descritos acima. Esta grade deverá ser salva no arquivo json grades.json, e deverá ter um id único associado. No campo timestamp,deverá ser salvo a data e hora do momento da inserção. O endpoint deverá retornar o objeto da grade que foi criada. A API deverá garantir oincremento automático deste identificador, de forma que ele não se repita entre os registros. Dentro do arquivo grades.json,que foi fornecido para utilização no desafio,o campo nextId já está com um valor definido. Após a inserção,é preciso que esse nextId seja incrementado e salvo no próprio arquivo, de forma que na próxima inserção ele possa ser utilizado.
*/

router.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send("something went wrong, check console.");
});
export default router;
