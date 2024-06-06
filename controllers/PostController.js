import DishModel from "../models/Dish.js";


//Configuring Redis

import redis from "redis";
import  {promisify}  from "util";
// Create a Redis client
const client = await redis.createClient({
  host: "127.0.0.1", // Redis server host
  port: 6379, // Redis server port
}).on('error', err => console.log('Redis Client Error', err))
.connect(console.log("Connected to Redis server"));

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

export const getAll = async (req, res) => {
  
  try {
    //Ищем блюда определенной категории в редис
    let dishes = JSON.parse(await client.get(`dishes_category${req.query.category}`));
    
    if (!dishes) {
      //Ищем блюда определенной категории в MongoDB
      dishes = await DishModel.find({category:req.query.category?req.query.category:{
        $exists: true
      }});
      console.log("Загрузка из базы")
      //Записываем блюда определленной категории в редис
      setAsync(`dishes_category${req.query.category}`, JSON.stringify(dishes));
    } else {
      console.log("Загрузка из redis")
    }
    
    //
    const  orderASCorDESC = function(){
      return req.query.order === 'desc'?  -1 : 1
    }
    
    //Сортировка и Фильтр количества вывода на одну страницу  
    
    res.json(dishes.sort((a, b) => a[`${req.query.sortBy}`] > b[`${req.query.sortBy}`] ? orderASCorDESC() : -orderASCorDESC()).filter((el,i,array)=>{
      if (i>=(Number(req.query.page-1))*8 & i<(Number(req.query.page))*8){
        return el
      } 
       //return req.query.category? String(el.category) === req.query.category:el
    }));
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить блюда",
    });
  }
};
export const getCategoryCount = async (req, res) => {
  let dishesCount = JSON.parse(await client.get(`dishes_count_category${req.query.category}`));
  try {
    dishesCount = await DishModel.find({category:req.query.category?req.query.category:{
      $exists: true
    }}).count();
    //console.log(dishesCount)
    setAsync(`dishes_count_category${req.query.category}`, JSON.stringify(dishesCount));
    res.json(dishesCount);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить количество блюд",
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
      user: req.body.userId,
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
