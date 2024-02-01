import request from "request";
import CartModel from "../models/Cart.js";
// import CartDishModel from "../models/CartDish.js";

export const getCart = async (req, res) => {
 // console.log(req.query.userId);
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

export const remove = async (req, res) => {
 // console.log(req.query);
  try {
    const userId = req.query.userId;

    const dish = await CartModel.findOneAndDelete({ userId: userId });
    if (!dish) {
      res.status(404).json({
        message: "Не удалось найти удаляемое блюдо",
      });
      return;
    }
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось удалить блюдо",
    });
  }
};

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
  //(req.body);
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
export const sendMessage = async (req, res) => {
  // console.log(req.query)
  const cart = await CartModel.find({ userId: req.query.userId });
    // res.json(cart[0].dishes);
    // console.log(cart[0].dishes)
    let msg = "";
    let price = 0;
    cart[0].dishes.forEach(dish=>{
      msg += '<b>Название</b>: ' + dish.title + '<b> Количество</b>: '+ dish.count + '<b> Цена</b>: '+ dish.price+ '\n'
      price+=Number(dish.count)*Number(dish.price)
      //console.log(price)
    })

    // console.log(price)
    msg+='\n'+"Общая стоимость: "+price
   msg = encodeURI(msg)
  try {
    request.post(
      `https://api.telegram.org/bot6219944438:AAGWlBXrHn17IvWiX7Nk6RUG_67HWJ5wUgU/sendMessage?chat_id=-1001911528979&parse_mode=HTML&text=${msg}`,
      function (error, response, body) {
        //не забываем обработать ответ
        console.log("error:", error);
        console.log("statusCode:", response && response.statusCode);
        console.log("body:", body);
        if (response.statusCode === 200) {
           res.status(200).json({ status: "ok", message: "Успешно отправлено!" });
        }
        if (response.statusCode !== 200) {
          res.status(400).json({ status: "error", message: "Произошла ошибка!" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось  совершить заказ",
    });
  }
};

export const addToCart = async (req, res) => {
  // console.log(req.body);

  // app.get('http://api.telegram.org/bot6219944438:AAGWlBXrHn17IvWiX7Nk6RUG_67HWJ5wUgU/sendMessage?chat_id=-1001911528979&parse_mode=HTML&text=gergdgd')

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

export const changeCountItem = async (req, res) => {
  try {
    const dishId = req.body._id;
    const userId = req.body.userId;
   // console.log(req.body);
    const dish = await CartModel.findOneAndUpdate(
      { userId: userId, dishes: { $elemMatch: { _id: dishId } } },
      {
        $set: { "dishes.$.count": req.body.countDish },
      },
      { new: true }
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
export const clearDish = async (req, res) => {
  try {
    const dishId = req.body._id;
    const userId = req.body.userId;
    //console.log(req.body);
    const dish = await CartModel.findOneAndUpdate(
      { userId: userId },
      {
        // $set: { "dishes.$.count": req.body.countDish },
        $pull: { dishes: { _id: dishId } },
      },
      { multi: true }
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
