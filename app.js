if (process.env.NODE_ENV !== "production") {
	// eğer node evn olarak production yok ise ekle..
	require("dotenv").config();
}

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const mongoose = require("mongoose");

// --Router ---- index sayfası route işlemleri
const indexRouter = require("./routes/index");

// -- View - layout - Static files işlemleri
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout"); // bütün viewlar burada gösterilecek aslında...
app.use(expressLayouts); // layout olarak express-ejs-layouts modülünü kullanacağımızı belirttik..
app.use(express.static("public")); // static dosyalarımızın path'ini belirttik..

// ----- database işlemleri ----
mongoose
	.connect(process.env.DATABASE_URL, {
		// process.env.DATABASE_URL herokuda yayınlamak istediğimiz için oradaki serverın urlsi otomatik olarak verilsin diye.
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("connected...");
	})
	.catch((err) => {
		console.log(err);
		process.exit();
	});

// const db = mongoose.connection;
// db.on("error", (error) => console.log(error));
// db.once("open", () => console.log("Connected to mongoose"));

app.use("/", indexRouter);

app.listen(process.env.PORT || 3000); // projeyi canlıya aldığımızda process.env.PORT kısmı otomatik karar verecek ama aynı zamanda 3000 portunu seçtik.
