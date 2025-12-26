const express = require("express");
const session = require("express-session");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "hub-secret",
  resave: false,
  saveUninitialized: false
}));

let projects = [];

// 🔐 ΕΛΕΓΧΟΣ LOGIN
app.use((req, res, next) => {
  if (!req.session.logged) {
    return res.send("Not logged in");
  }
  next();
});

app.get("/", (req, res) => {
  res.send(`
    <h2>Project Hub</h2>

    <input id="title" placeholder="Title"><br>
    <textarea id="story" placeholder="Story"></textarea><br>
    <textarea id="code" placeholder="Arduino code"></textarea><br>
    <button onclick="send()">Publish</button>

    <div id="list"></div>

    <script>
      function send() {
        fetch("/add", {
          method:"POST",
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
            title: title.value,
            story: story.value,
            code: code.value
          })
        }).then(load);
      }

      function load() {
        fetch("/all")
          .then(r=>r.json())
          .then(d=>{
            list.innerHTML = d.map(p =>
              '<h3>'+p.title+'</h3><pre>'+p.code+'</pre>'
            ).join("");
          });
      }
      load();
    </script>
  `);
});

app.post("/add", (req, res) => {
  projects.push(req.body);
  res.sendStatus(200);
});

app.get("/all", (req, res) => {
  res.json(projects);
});

app.listen(3002, () =>
  console.log("Project Hub running on port 3002")
);