import DishModel from "../models/Dish.js";

export const getAll = async (req, res) => {
  try {
    const dishes = await DishModel.find();
    res.json(dishes);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить блюда",
    });
  }
};
export const getOne = async (req, res) => {
  try {
    const dishId = req.params.id;
    const dish = await DishModel.findOne({ _id: dishId });
    if (!dish) {
      res.status(404).json({
        message: "Не удалось найти блюдо",
      });
      return;
    }
    res.json(dish);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось вернуть блюдо",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const dishId = req.params._id;
    const dish = await DishModel.findOneAndDelete({ id: dishId });
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

export const create = async (req, res) => {
  try {
    const dish = new DishModel({
      id: req.body.id,
      title: req.body.title,
      description: req.body.description,
      titleEN: req.body.titleEN,
      descriptionEN: req.body.descriptionEN,
      price: req.body.price,
      category: req.body.category,
      raiting: req.body.raiting,
      weight: req.body.weight,
      imageUrl: req.body.imageUrl,
    //   image: {
    //     data: readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
    //     contentType: 'image/png'
    // },
      user: req.userId,
    });

    await dish.save();

    res.json(dish);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать блюдо",
    });
  }
};

export const update = async (req, res) => {
  console.log(req.params)
  try {
    const dishId = req.params.id;
    const dish = await DishModel.findOneAndUpdate(
      { _id: dishId },
      {
        
        title: req.body.title,
        description: req.body.description,
        titleEN: req.body.titleEN,
        descriptionEN: req.body.descriptionEN,
        price: req.body.price,
        category: req.body.category,
        raiting: req.body.raiting,
        weight: req.body.weight,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );
    if (!dish) {
      res.status(404).json({
        message: "Не удалось найти обновляемое блюдо",
      });
      return;
    }

    res.json({
      success:true
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось обновить блюдо",
    });
  }
};
