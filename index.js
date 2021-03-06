require("dotenv/config");

const express = require("express");
const pool = require("./db");
const path = require("path");
const app = express();
const cors = require("cors");
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const PORT = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//fileupload
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString()+".pdf");
    },
  }),
});

app.post("/upload", upload.single("pdf"), function (req, res, next) {
  res.send(req.file);
});

app.post("/personal", async (req, res) => {
  try {
    const form = req.body;
    console.log(form);
    const newTodo = await pool.query(
      "INSERT INTO personal (firstname,lastname,preferredname,email,phonenumber,address,city,province,country,websiteone,websitetwo,websitethree,resumelink) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *",
      [form.firstName,form.lastName,form.prefName,form.email,form.phonenumber,form.address,form.city,form.province,"CANADA",form.web1,form.web2,form.web3,form.resumelink]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});


if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.listen(PORT, () => {
  console.log(`server at port ${PORT}`);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/public/index.html"));
});
