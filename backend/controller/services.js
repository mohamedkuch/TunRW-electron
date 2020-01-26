const Service = require("../models/services");
const Notification = require("../models/notifications");
const User = require("../models/user");

exports.createService = (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
    const postQuery = Service.find();

    // 4 services only
    postQuery.find().then(count =>{
      if(count.length >= 4) {
        res.status(401).json({
          message : "Creating Service Failed , you reach the limit !"
        });
      }else {
        User.find().select('_id')
        .then(documents => {
          const notification = new Notification({
            text : 'created a new Service',
            section : "Service",
            watched : documents,
            creator : req.userData.username
          });
          const post = new Service({
            icon: req.body.icon,
            title : req.body.title,
            description : req.body.description,
            creator: req.userData.userId
          });
      
          post.save().then(result => {
              // save notification
            notification.save().then(notResult => {
              res.status(201).json({
                message: 'Post added Successfully',
                service: {
                  ...result,
                  id: result._id
                },
                notification: {
                  ...notResult,
                  id: notResult._id
                }
              });

            });

          }).catch(err =>{
            res.status(500).json({
              message : "Creating Service Failed!"
            });
      
          });
        });
      }
  

    });
  }
  exports.getAllServices = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Service.find();
    let fetchedPosts;
    if( pageSize && currentPage) {
      postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    postQuery.find().then(documents => {
          fetchedPosts = documents
          return Service.count();
      }).then(count =>{
        res.status(200).json({
          message: 'Services fetched Succesfully!',
          services: fetchedPosts,
          maxPosts: count
        });
      }).catch(error => {
        res.status(500).json({
          message : "Services fetching Failed!"
        });
      });
  
  }
  exports.getOneService= (req, res, next) => {
    Service.findById(req.params.id).then(post =>{
     if(post){
        res.status(200).json(post);
     } else {
       res.status(404).json({message: 'Service not found!'});
     }
  
    });
  }

  exports.updateService = (req, res, next) => {
    const post = new Service({
      _id: req.body.id,
      icon: req.body.icon,
      title : req.body.title,
      description : req.body.description,
      creator: req.body.userId
    });
    User.find().select('_id')
    .then(documents => {
      const notification = new Notification({
        text : 'updated a Service',
        section : "Service",
        watched : documents,
        creator : req.userData.username
      });
      Service.updateOne({ _id: req.params.id }, post).then(result =>{
        if(result.n > 0){
          notification.save().then(notResult => {
            res.status(200).json({ 
              message: "Update Successful !",
              notification: {
                ...notResult,
                id: notResult._id
              }
            });
          });
        }else {
          res.status(401).json({  message : "Not Authorized!"});
        }
      }).catch(error => {
        res.status(500).json({
          message : "Update Service Failed!",
          err: error
        });
      });
    });
  }

exports.deleteService = (req, res, next) => {
  User.find().select('_id')
  .then(documents => {

      const notification = new Notification({
        text : 'deleted a Service',
        section : "Service",
        watched : documents,
        creator : req.userData.username
      });


    Service.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result =>{

      if(result.n > 0){
        notification.save().then(notResult => {
          res.status(200).json({ 
            message: "Service Deleted !",
            notification: {
              ...notResult,
              id: notResult._id
            }
          });
        });

      }else {
        res.status(401).json({  message : "Not Authorized!"});
      }
    }).catch(error => {
      res.status(500).json({
        message : "Deleting Service Failed!"
      });
    });

  });
  
}