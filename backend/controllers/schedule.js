const Schedule = require("../models/schedule");

exports.scheduleCreate =
(req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const schedule = new Schedule({
    service: req.body.service,
    details: req.body.details,
    imagePath: url + "/images/" + req.file.filename,
    date: req.body.date,
    hour: req.body.hour,
    creator: req.userData.userId
  });
  schedule.save().then(createdSchedule => {
    res.status(201).json({
      message: "Schedule added successfully",
      schedule: {
        //...createdPost,
        id: createdSchedule._id,
        service: createdSchedule.service,
        details: createdSchedule.details,
        imagePath: createdSchedule.imagePath,
        date: createdSchedule.date,
        hour: createdSchedule.hour,
        creator: createdSchedule.userId
      }
    });

  }).catch(error =>{
      res.status(500).json({
        message : "Created schedule is failed!"
      });
  });
}

exports.scheduleUpdate = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file){
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const schedule = new Schedule({
    _id: req.body.id,
    service: req.body.service,
    details: req.body.details,
    imagePath:imagePath,
    date: req.body.date,
    hour: req.body.hour,
    creator: req.userData.userId
  });
  Schedule.updateOne({ _id: req.params.id, creator: req.userData.userId }, schedule).then(result => {
      if(result.n> 0){
        res.status(200).json({ message: "Update successful!" });
      }else{
        res.status(401).json({ message: "Authorization is failed nothing was changed"});
      }
  }).catch(error => {
    res.status(500).json({
      message: "Couldn´t update post autentication failed or issues on the connection!"
    });
  });
}

exports.fetchingSchedules = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const scheduleQuery = Schedule.find();
  let scheduledPosts;

  //Logic to manipulate page on backend also count quantity of posts on screen
  if (pageSize && currentPage){
    scheduleQuery
      .skip(pageSize * (currentPage - 1))
      .limit (pageSize);
  }
    scheduleQuery.then(documents => {
      scheduledPosts = documents;
      return Schedule.count();
      })
      .then( count => {
        res.status(200).json({
          message: "Schedules fetched successfully!",
          schedule: scheduledPosts,
          maxSchedules: count

      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching schedules is failed!"
      });
    });
  }

exports.scheduleFindId = (req, res, next) => {
  Schedule.findById(req.params.id).then(schedule => {
    if (schedule) {
      res.status(200).json(schedule);
    } else {
      res.status(404).json({ message: "Schedule not found!" });
    }
  })
  .catch(error => {
      res.status(500).json({
        message: "Schedule post is failed !"
      });
  });
}

exports.deleteSchedule = (req, res, next) => {
  Schedule.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    console.log(result);

    if(result.n > 0){
      res.status(200).json({ message: "Schedule deleted!" });
    }else{
      res.status(401).json({ message: "Deletion with error!" });
    }

  })
  .catch(error => {
    res.status(500).json({
      message: "Error on deletion scheduleId"
    });
  });
}
