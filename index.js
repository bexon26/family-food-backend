import express from "express";
import multer from "multer"; // библиотека для загрузки картинок
import cors from "cors";

// import request from "request";

import mongoose from "mongoose";

import {
  registerValidation,
  loginValidation,
  dishCreateValidation,
} from "./validations/validations.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import {
  UserController,
  PostController,
  CartController,
} from "./controllers/index.js";



//console.log(client.on);
// Test the connection
// client.on("connect", () => {
//   console.log("Connected to Redis server");
// });

mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.mf1g6f3.mongodb.net/familyfood?retryWrites=true&w=majority"
  )
  .then(() => {
    // const db = mongoose.connection
    console.log("DB ok");
  })
  .catch((err) => {
    console.log("DB ERROR"), err;
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "/uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
// app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

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
//Загрузка картинки при добавлении блюда
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// //Configuring Redis

// import redis from "redis";
// import  {promisify}  from "util";
// // Create a Redis client
// const client = await redis.createClient({
//   host: "127.0.0.1", // Redis server host
//   port: 6379, // Redis server port
// }).on('error', err => console.log('Redis Client Error', err))
// .connect(console.log("Connected to Redis server"));

//  export const getAsync = promisify(client.get).bind(client);
//  export const setAsync = promisify(client.set).bind(client);

 


app.get("/dish", PostController.getAll); //Получение всех блюд
// Route handler
// app.get("/dish", async (req, res) => {
 
//   // Check if data is in cache
  
//   let dishAll = JSON.parse(await getAsync("dishAll"));
//   if (!dishAll) {
//     dishAll = PostController.getAll
//     console.log("dishAll")
//     await setAsync("dishAll", JSON.stringify(user))
//   }


// });



app.get("/dish/count", PostController.getCategoryCount); // Получение количества блюд для пагинации
app.get("/dish/:id", PostController.getOne);
app.post("/dish", checkAuth, dishCreateValidation, PostController.create);
app.delete("/dish/:id", checkAuth, PostController.remove);
app.patch("/dish/:id", checkAuth, dishCreateValidation, PostController.update);

app.get("/cart", CartController.getCart);
app.post("/cart", CartController.createUserCart);
app.patch("/cart", CartController.addToCart);
app.patch("/cart/plus", CartController.changeCountItem);
app.delete("/cart/clear", CartController.remove);
app.patch("/cart/clearDish", CartController.clearDish);
app.post("/cart/sendMessage", CartController.sendMessage);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});

// request.post(
//   `https://api.telegram.org/bot6219944438:AAGWlBXrHn17IvWiX7Nk6RUG_67HWJ5wUgU/sendMessage?chat_id=-1001911528979&parse_mode=HTML&text=gergdgd`,
//   function (error, response, body) {
//     //не забываем обработать ответ
//     console.log("error:", error);
//     console.log("statusCode:", response && response.statusCode);
//     console.log("body:", body);
//     if (response.statusCode === 200) {
//       // response.status(200).json({ status: "ok", message: "Успешно отправлено!" });
//     }
//     if (response.statusCode !== 200) {
//       // response.status(400).json({ status: "error", message: "Произошла ошибка!" });
//     }
//   }
// );
