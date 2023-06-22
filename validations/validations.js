import { body } from "express-validator";

export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Укажите имя").isLength({ min: 3 }),
  body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
];

export const dishCreateValidation = [
  body("title", "Введите название блюда").isLength({ min: 3 }).isString(),
  body("description", "Введите состав блюда через запятую").optional().isLength({ min: 5 }).isString(),
  body("titleEN", "Введите название блюда на английском").isLength({ min: 3 }).isString(),
  body("descriptionEN", "Введите состав блюда через запятую на английском").optional().isLength({ min: 5 }).isString(),
  body("price", "Введите цену в фунтах").isLength({ min: 1 }).isInt(),
  body("category", "Введите категорию в числах (1 - салаты, 2 - Горячее, 3 - Супы, 4 - Десерты, 5 - Соусы, 6 - Напитки)").isLength({ min: 1 }).isInt(),
  body("raiting", "Введите райтинг").isLength({ min: 1 }).isInt(),
  body("weight", "Введите массу").isLength({ min: 1 }).isInt(),
  body("imageUrl", "Неверная ссылка на аватарку").optional().isURL(),
];
