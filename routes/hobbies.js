const express = require("express");
const Hobby = require("../models/hobbies");
const dailyLogs = require("../models/dailyLogs");
const router = express.Router();
const axios = require("axios");
const { moodQueries, keyWords } = require("../utils/recommendations");
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const Groq = require("groq-sdk");

const YOUTUBE_TOKEN = process.env.YOUTUBE_TOKEN;
console.log("✅ hobbies route file loaded");

//  Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.get("/", (req, res) => {
  res.render("mainPage/main");
});

router.get("/hobbies", wrapAsync(async (req, res) => {
  try {
    const hobbies = await Hobby.find({}); // get all hobbies
    res.render("hobbies/show", { hobbies }); // pass to view
  } catch (err) {
    console.error(err);
  }
}));

router.get("/hobbies/:id", isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let hobby = await Hobby.findById(id);
  const logs = await dailyLogs.find({ hobby: id, user: req.user._id }).sort({ date: 1 });

  const todayDate = new Date().toDateString();
  const hasTodayLog = logs.some(log => new Date(log.date).toDateString() == todayDate);

  let sessionVideos = req.session.hobbyResults?.videos || [];
let sessionGroq = req.session.hobbyResults?.groqOutput || "";

req.session.hobbyResults = null;

res.render("hobbies/hobbyPage", {
  hobby,
  logs,
  hasTodayLog,
  videos: sessionVideos,
  groqOutput: sessionGroq
});

}));

router.post("/hobbies/:id/dailyLogs", isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params; //iska mtlb hain sirf id find karna
  let { text, mood } = req.body;
  let hobby = await Hobby.findById(id); //iska mtlb yeh ki id ki puri info nikalna from hobby model
  
  if (!mood || !text) {
    req.flash("error", "You need to fill the requied details to update streak 😇");
    return res.redirect(`/hobbies/${id}`);
  }

  //streak logic flashes  
  const latestLog = await dailyLogs
    .findOne({ user: req.user._id, hobby: id })
    .sort({ date: -1 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (latestLog) {
    const lastDate = new Date(latestLog.createdAt);
    lastDate.setHours(0, 0, 0, 0);

    const diff = (today - lastDate) / (1000 * 60 * 60 * 24);

    // Case 1 → Already submitted today
    if (diff === 0) {
      req.flash("error", "You already submitted today! Come back tomorrow 😊");
      return res.redirect(`/hobbies/${id}`);
    }

    // Case 2 → Submitted yesterday
    if (diff === 1) {
      req.flash("success", "🔥 Great consistency! You're building a streak!");
    }

    // Case 3 → Gap more than 1 day
    if (diff > 1) {
      req.flash("info", "Your streak broke, but you're still moving forward 🌱");
    }
  }

  const moodRec = moodQueries[mood];
  const hobbyRec = keyWords[hobby.hobby];

  let moodTerm = "";
  if (moodRec) {
    moodTerm = moodRec.join(" ");
  }
  let hobbyTerm = "";
  if (hobbyRec) {
    hobbyTerm = hobbyRec.join(" ");
  }
  const query = `${hobby.hobby} ${hobbyTerm} ${moodTerm} motivation`;

  const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
    params: {
      key: YOUTUBE_TOKEN,
      part: "snippet",
      q: query,
      maxResults: 10,
      type: "video",
    },
  });

  const videos = response.data.items;

  //below is the ai groq api usage code
  let moodFirst = mood;
  let textFirst = text;

  let username = req.user.username;

  let groqOutput = "";
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a warm, friendly personal mentor.
Always speak like you're talking directly to the user.
Use their name in a natural way. Avoid robotic tone.
Give emotional support + one actionable step for their specific hobby.
Keep responses human  and natural.
          `,
        },
        {
          role: "user",
          content: 
          `User: ${username}
Hobby: ${hobby.hobby}
Mood: ${moodFirst}
Reflection: ${textFirst}

Write:
1) One short, genuine emotional sentence addressing ${username} personally
2) One specific, actionable step for their hobby: ${hobby.hobby}
Avoid lists or labels. Talk like a supportive friend.
          `,
        },
      ],
    });

    groqOutput = completion.choices[0]?.message?.content || "Keep going! You're doing great.";
  } catch (err) {
    console.error("❌ Groq AI error:", err);
    groqOutput = "Couldn't fetch motivation right now, but keep pushing forward!";
  }

  const newLog = new dailyLogs({
    text,
    mood,
    hobby: id,
    user: req.user,
    groqOutput: groqOutput,
  });
  await newLog.save();

  // ⭐ STORE AI + videos in session temporarily
  req.session.hobbyResults = {
    videos,
    groqOutput
  };

  return res.redirect(`/hobbies/${id}`);
}));



router.get("/hobbies/:id/dailyLogs", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let hobby = await Hobby.findById(id);
  const logs = await dailyLogs.find({ hobby: id, user: req.user._id}).populate("user").sort({createdAt: -1});
  res.render("hobbies/textRecords", { logs, hobby });
}));

router.get("/myPage", isLoggedIn,  wrapAsync(async (req, res) => {
  //already registered user ki id fetch kari
  let logs = await dailyLogs.find({ user: req.user._id }); //this means from users model passport which has store user details we r just fetching id
  //ek hobbyid kar ek empty array create kiya in which logs will be stored
  let hobbyId = [];
  //we go through these logs, and unn log ki job hobby hain usko store karenge array
  for (let i = 0; i < logs.length; i++) {
    hobbyId.push(logs[i].hobby);
  }
  //this is for the below line
  // We now have a list of hobby IDs (like: "Gardening", "Singing", "Gym")
  // So to show cards on MyPage, we need full hobby details (name, description, image, etc.)
  // So we ask MongoDB: “Give me all the HOBBIES whose _id is inside this hobbyId list.”
  let hobbies = await Hobby.find({ _id: hobbyId });
  res.render("hobbies/myPage", { hobbies });
}));

router.delete("/myPage/:id", isLoggedIn, async(req,res)=>{
  let { id } = req.params;
  
  await dailyLogs.deleteMany({
    user: req.user._id, //dailylogs mei user dhundho and delete
    hobby: id //hobby dhundho and delete
});
  res.status(200).json({success:true});
});

module.exports = router;
