var dog, happydog, database, foodS, foodStock;
var saddogImage, happydogImage;
var addFood, foodobj;
var fedTime, lastFed;


function preload(){
  saddogImage=loadImage("Images/Dog.png");
  happyDogImage=loadImage("Images/happy dog.png");
}

function setup() {

  database = firebase.database();

  createCanvas(1000,400);

  foodObj = new Food();

  dog=createSprite(800,200,150,150);
  dog.addImage(saddogImage);
  dog.scale=0.15;

  foodStock = database.ref('food');
  foodStock.on("value", readStock);

  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDogs);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);

  if(foodStock !== undefined){
    foodObj.display();
  }

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed : "+lastFed%12 + " PM",350,30);
  }else if(lastFed==0){
    text("Last Feed : 12 AM",350,30);
  }else{
    text("Last Fed : "+ lastFed + " AM", 350,30);
  }

  drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDogs(){
  dog.addImage(happyDogImage);

  if(foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else {
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    fedTime:hour()
  });
}

function addFoods(){
  foodS++;
  database.ref('/').update({food:foodS});
}
