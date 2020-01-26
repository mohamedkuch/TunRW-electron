const TeamMember = require("../models/teamMembers");
const Notification = require("../models/notifications");
const User = require("../models/user");


exports.createTeamMember = (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new TeamMember({
      title : req.body.title,
      position : req.body.position,
      imagePath: url + "/images/" + req.files[0].filename,
      creator: req.userData.userId
    });
    User.find().select('_id')
    .then(documents => {
      const notification = new Notification({
        text : 'created a new Team Member',
        section : "About",
        watched : documents,
        creator : req.userData.username
      });
      post.save().then(result => {
        notification.save().then(notResult => {
          res.status(201).json({
            message: 'Post added Successfully',
            teamMember: {
              ...result,
              id: result._id
            },
            notification: {
              ...notResult,
              id: notResult._id
            }
          });

        });
      })
      .catch(err =>{
        res.status(500).json({
          message : "Creating Team Member Failed!"
        });
      });
    });
  }
  exports.getAllTeamMembers = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = TeamMember.find();
    let fetchedPosts;
    if( pageSize && currentPage) {
      postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    postQuery.find().then(documents => {
          fetchedPosts = documents
          return TeamMember.count();
      }).then(count =>{
        res.status(200).json({
          message: 'Team Members fetched Succesfully!',
          teamMembers: fetchedPosts,
          maxPosts: count
        });
      });
  
  }
  exports.getOneTeamMember = (req, res, next) => {
    TeamMember.findById(req.params.id).then(post =>{
     if(post){
        res.status(200).json(post);
     } else {
       res.status(404).json({message: 'Team Member not found!'});
     }
  
    });
  }

  exports.updateTeamMember = (req, res, next) => {
    let imageURL = req.body.imagePath;

    if(req.files){
      const url = req.protocol + '://' + req.get("host");
      imageURL = url + "/images/" + req.files[0].filename;
    }


    const post = new TeamMember({
      _id: req.body.id,
      title : req.body.title,
      position : req.body.position,
      imagePath : imageURL,
      creator: req.body.userId
    });
    User.find().select('_id')
    .then(documents => {
      const notification = new Notification({
        text : 'updated a Team Member',
        section : "About",
        watched : documents,
        creator : req.userData.username
      });
      TeamMember.updateOne({ _id: req.params.id },  post).then(result =>{
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
          message : "Update Team Member Failed!"
        });
      });
    });
  }

  exports.deleteTeamMember = (req, res, next) => {
    User.find().select('_id')
    .then(documents => {
      const notification = new Notification({
        text : 'deleted a Team Member',
        section : "About",
        watched : documents,
        creator : req.userData.username
      });
      TeamMember.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result =>{
        if(result.n > 0){
          notification.save().then(notResult => {
            res.status(200).json({ 
              message: "Team Member  Deleted !",
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
          message : "Deleting Team Member Failed!"
        });
      });
    });
  
  }