import express from "express";
import multer from "multer"; // библиотека для загрузки картинок
import cors from "cors";

import mongoose from "mongoose";

import bodyParser from "body-parser"


import {
  registerValidation,
  loginValidation,
  dishCreateValidation,
} from "./validations/validations.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import { UserController, PostController } from "./controllers/index.js";

mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.mf1g6f3.mongodb.net/familyfood?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB ok");
  })
  .catch((err) => {
    console.log("DB ERROR"), err;
  });

  
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Hello World");
});

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "src/assets/uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/src/assets/uploads", express.static("src/assets/uploads"));

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/dish", PostController.getAll);
app.get("/dish/:id", PostController.getOne);
app.post("/dish", checkAuth, dishCreateValidation, PostController.create);
app.delete("/dish/:id", checkAuth, PostController.remove);
app.patch("/dish/:id", checkAuth, dishCreateValidation, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
