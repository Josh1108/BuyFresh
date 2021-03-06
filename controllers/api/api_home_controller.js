const request = require('async-request');
const Item = require('../../models/item');
const User=require('../../models/User');
const jwt = require('jsonwebtoken');
module.exports.api_home = (req, res) => {
    return res.json(200, {
        message: "hii"
    });
}
module.exports.whetherReport = async (req, res) => {
    try {
        console.log(req.query);
        let options = {
            method: 'GET',
        }

        let response = await request(`http://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.lon}&appid=be50af9722a691e8eeb67031b90caaa3`, options);

        return res.json(200, {
            message: "whether",
            data: {
                data: JSON.parse(response.body).main
            }
        });
    } catch (e) {
        console.log(e);
    }

}
module.exports.getAllPRoducts = async (req, res) => {
    try {
       let farmer=await User.find({emailOrPhone:req.params.id})
        let items = await Item.find({ farmer: farmer._id });
        return res.json(200,{
            message: "All products for the requsting farmer",
            data: {
                items: items
            }
        });
    } catch (e) {
        console.log(e);
        return res.json(500,{
            message: "internal server error"
        });
    }

}
module.exports.addProduct = (req, res) => {

    Items.uploadedImage(req, res, async function (err) {
    try {
        console.log("here");
        if (err) {
            console.log("multer error", err);
            return;
        }
        if (!req.file) {
            console.log("image not uploaded");
            return;
        } else {
            let Options = {
                method: "GET"
            };
            let mlResponse = await request(URI, options);

            newItem.price = mlResponse.price;
            let newItem = await Items.create({
                title: mlResponse.name,
                farmer: req.user._id,
                price: mlResponse.price,
                description: mlResponse.description
            });
            newItem.image = `${Items.imagePath}/${req.file.filename}`;


            (await newItem).save();

            return res.json({
                status : 200,
                id : newItem._id,
                message: "item Successfully uploaded",
                data: {
                    item: newItem
                }
            });
        }


    } catch (error) {
        console.log(error);
        return res.json(500,{
            message: "internal server error"
        });
    }
    });

}
module.exports.updateProduct = async (req, res) => {
    try {
        let item = await Item.findById(req.body.itemId);
        // if (req.user != item.farmer) {
        //     return res.json(404,{
        //         message: "UNAUTHORIZED"
        //     });
        // }

        item = await Item.findByIdAndUpdate({
            title: req.body.name,
            price: req.body.price,
            description: req.body.descripton
        });
        return res.json({
            status : 200,
            message: "updated successfully",
            data: {
                item: item
            }
        });
    } catch (e) {
        console.log(e);
        return res.json(500,{
            message: "internal server error"
        });
    }
}
module.exports.createUser = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {

            console.log(req.body);

        let user = await User.findOne({
            emailOrPhone: req.body.phone
        });

        if (!user) {
            let newuser = await User.create({
                name: req.body.name,
                emailOrPhone: req.body.phone,
                password: req.body.password
            });
            // if (req.body.userType == "Farmer") {
            //     newuser.isFarmer = true;
            //     newuser.isBuyer = false;
            //     await newuser.save();
            // } else {
            //     newUser.isFarmer = false;
            //     newuser.isBuyer = true;
            //     await newuser.save();

            // }
            return res.json(201,{
            message:"Registered Successfully",
            status:201
            });
        } else {
            return res.json(202,{
                message:"already exists",
                status:202
            });
        }


    } catch (err) {
        console.log(err);
        return res.json(500,{
            message:"internal server error"
        });
    }

}


module.exports.createSession = async function (req, res) {
    try {
        console.log(req.body)
        
        let user = await User.findOne({ emailOrPhone: req.body.emailOrphone });
   
        if (!user || user.password != req.body.password) {
            return res.json(422, {
                message: 'invalid username or password'
            });

        } else {
            return res.json(200, {
                message: 'signed in successfully',
                data: {
                    token: jwt.sign(user.toJSON(), 'WjIJ64zP3PwOdSyJzYjYo1uZBtA31GcW', { expiresIn: 100000 })
                }
            });
        }
    } catch (err) {
        console.log("error in authentication",err);

    }

}