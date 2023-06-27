import CartModel from "../models/Cart.js";

export const getCart = async (req, res) => {
  console.log(req.query)
  try {
    const cart = await CartModel.find();
    res.json(cart.filter((el)=>{
     
      return el
      // return req.query.category? String(el.category) === req.query.category:el
    }));
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить блюда",
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

export const create = async (req, res) => {
  console.log(req.body.title)
  try {
    
    const cart = new CartModel({
      userId: req.body.title,
      dishes:[
        {title: req.body.title,
      titleEN: req.body.titleEN,
      price: req.body.price,
      weight: req.body.weight,
      imageUrl: req.body.imageUrl,
      }
    ]
      
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

// export const update = async (req, res) => {
//   console.log(req.params)
//   try {
//     const dishId = req.params.id;
//     const dish = await DishModel.findOneAndUpdate(
//       { _id: dishId },
//       {
        
//         title: req.body.title,
//         description: req.body.description,
//         titleEN: req.body.titleEN,
//         descriptionEN: req.body.descriptionEN,
//         price: req.body.price,
//         category: req.body.category,
//         raiting: req.body.raiting,
//         weight: req.body.weight,
//         imageUrl: req.body.imageUrl,
//         user: req.userId,
//       }
//     );
//     if (!dish) {
//       res.status(404).json({
//         message: "Не удалось найти обновляемое блюдо",
//       });
//       return;
//     }

//     res.json({
//       success:true
//     })
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Не удалось обновить блюдо",
//     });
//   }
// };
