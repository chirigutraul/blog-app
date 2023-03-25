//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require("mongoose");
const res = require("express/lib/response");

const homeStartingContent = "Hello there, visitor! This is a blog posting application. It is created with Node.js, Express.js, EJS and MongoDB. You can create your own blog posts by going to 'Compose' page.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

const port = process.env.PORT || 3000;
const URL = process.env.URL;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(URL);

const postSchema = new mongoose.Schema({
  name:String,
  postText:String
});

const blogPost=mongoose.model('post', postSchema);



app.get("/", function(req, res){
    blogPost.find(function(err,posts){
      if(err){
        console.log(err);
      } else{
          res.render("home",{
            startingContent:homeStartingContent,
            posts:posts
          })
        }
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const composedPost = new blogPost({
    name: req.body.postTitle,
    postText: req.body.postBody
  });
   composedPost.save(function(err){
     if(!err){
      res.redirect("/");
     }
   });


});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  
  blogPost.findOne({_id:requestedPostId},function(err,post){
    if(err){
      console.log(err);
    } else {
      res.render("post",{
        title:post.name,
        content:post.postText
      })
    }
  })

});

app.listen(port, function() {
  console.log("Server started on port 3000");
});
