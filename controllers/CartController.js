import CartModel from "../models/Cart.js";
// import CartDishModel from "../models/CartDish.js";

export const getCart = async (req, res) => {
  console.log(req.query.userId);
  try {
    const cart = await CartModel.find({ userId: req.query.userId });
    res.json(cart[0].dishes);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить корзину пользователя",
    });
  }
};
// export const getCategoryCount = async (req, res) => {

//   try {
//     const dishesCount = await DishModel.find({category:req.query.category?req.query.category:{
//       $exists: true
//     }}).count();
//     console.log(dishesCount)
//     res.json(dishesCount);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Не удалось получить количество блюд",
//     });
//   }
// };
// export const getOne = async (req, res) => {
//   try {
//     const dishId = req.params.id;
//     const dish = await DishModel.findOne({ _id: dishId });
//     if (!dish) {
//       res.status(404).json({
//         message: "Не удалось найти блюдо",
//       });
//       return;
//     }
//     res.json(dish);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Не удалось вернуть блюдо",
//     });
//   }
// };

// export const remove = async (req, res) => {
//   try {
//     const dishId = req.params._id;
//     const dish = await DishModel.findOneAndDelete({ id: dishId });
//     if (!dish) {
//       res.status(404).json({
//         message: "Не удалось найти удаляемое блюдо",
//       });
//       return;
//     }
//     res.json({
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Не удалось удалить блюдо",
//     });
//   }
// };

// export const create = async (req, res) => {
//   console.log(req.body.title)
//   try {

//     const cart = new CartModel({
//       userId: req.body.userId,
//       dishes:[
//         {title: req.body.title,
//       titleEN: req.body.titleEN,
//       price: req.body.price,
//       weight: req.body.weight,
//       imageUrl: req.body.imageUrl,
//       }
//     ]

//     });

//     await cart.save();

//     res.json(cart);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Не удалось создать блюдо",
//     });
//   }
// };
export const createUserCart = async (req, res) => {
  console.log(req.body);
  try {
    const cart = new CartModel({
      userId: req.body.userId,
      dishes: [],
      totalPrice: 1,
    });

    await cart.save();

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать блюдо",
    });
  }
};

export const addToCart = async (req, res) => {
  // console.log(req.body);
  try {
    // const dishId = req.params.id;
    const userId = req.body.userId;

    // console.log(req.body);
    const dish = await CartModel.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          dishes: {
            _id: req.body._id,
            title: req.body.title,
            titleEN: req.body.titleEN,
            price: req.body.price,
            weight: req.body.weight,
            imageUrl: req.body.imageUrl,
            count: 1,
          },
        },
      }
    );
    if (!dish) {
      res.status(404).json({
        message: "Не удалось найти обновляемое блюдо",
      });
      return;
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось обновить блюдо",
    });
  }
};

export const plusItem = async (req, res) => {
  console.log(req.body);
  try {
     const dishId = req.params.id;
    const userId = req.body.userId;

    // console.log(req.body);
    const dish = await CartModel.findOneAndUpdate(
      {   dishes:{ $elemMatch: {_id: dishId}} },
      {
        
          dishes: {
            count: req.body.count,
          },
        
      }
    );
    if (!dish) {
      res.status(404).json({
        message: "Не удалось найти обновляемое блюдо",
      });
      return;
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось обновить блюдо",
    });
  }
};
