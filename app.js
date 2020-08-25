if (process.env.NODE_ENV !== "production") {
	// eğer node evn olarak production yok ise ekle..
	require("dotenv").config();
}
// modules
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

// --Router ---- index sayfası route işlemleri
const indexRouter = require("./routes/index");
// --Router ---- author route işlemleri
const authorRouter = require("./routes/authors");
const bookRouter = require("./routes/books");

// -- View - layout - Static files işlemleri
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout"); // bütün viewlar burada gösterilecek aslında...
app.use(expressLayouts); // layout olarak express-ejs-layouts modülünü kullanacağımızı belirttik..
app.use(methodOverride('_method')); // post,delete,put methodlarını kontrol etmek için...
app.use(express.static("public")); // static dosyalarımızın path'ini belirttik..
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

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

// mongodb://localhost/mybrary -- Eğer bilgisauarımda mongoDB yüklü olsaydı, bu şekilde kullanılacaktı...

// const db = mongoose.connection;
// db.on("error", (error) => console.log(error));
// db.once("open", () => console.log("Connected to mongoose"));

app.use("/", indexRouter);
app.use("/authors", authorRouter);
app.use("/books", bookRouter);

app.listen(process.env.PORT || 3000);
// projeyi canlıya aldığımızda process.env.PORT kısmı otomatik karar verecek ama localde 3000 portundan devam edecek...
