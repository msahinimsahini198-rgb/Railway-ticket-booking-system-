const mongoose=require("mongoose"); const Train=require("./models/Train");
mongoose.connect("mongodb://127.0.0.1:27017/railway_booking").then(async()=>{
 await Train.deleteMany({});
 await Train.insertMany([
 {trainNumber:"12723",trainName:"Telangana Express",source:"Hyderabad",destination:"New Delhi",departureTime:"06:00",arrivalTime:"06:30",classes:["SL","3A","2A"],fare:650,availableSeats:100},
 {trainNumber:"12760",trainName:"Charminar Express",source:"Hyderabad",destination:"Chennai",departureTime:"18:00",arrivalTime:"08:00",classes:["SL","3A","2A"],fare:550,availableSeats:80},
 {trainNumber:"17015",trainName:"Visakha Express",source:"Hyderabad",destination:"Visakhapatnam",departureTime:"15:00",arrivalTime:"07:00",classes:["SL","3A"],fare:500,availableSeats:90}
 ]); console.log("Sample trains inserted"); process.exit();}).catch(console.error);