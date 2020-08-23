const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");

 const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];


// books sayfası route. bütün kitapları getir.
router.get("/", async (req, res) => {
	let query = Book.find(); // database query objesi olarak, kullanılacak...

	// title a göre arama query-si..
	if (req.query.title != null && req.query.title != "") {
		query = query.regex("title", new RegExp(req.query.title, "i")); // case sensitive olmayacak..
	}
	// tarihe göre arama işlemleri
	if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
		query = query.lte("publishDate", req.query.publishedBefore);
		//lte ==> less than equal to demek, bu metod ile eşitlik karşılaştırmaları yapabiliriz...
	}
	if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
		query = query.gte("publishDate", req.query.publishedAfter);
		//gte ==> greater than equal to demek, bu metod ile eşitlik karşılaştırmaları yapabiliriz...
	}
	// kullanıcıdan inputtan gelen verilere göre req.query oluşturmak için...
	try {
		const books = await query.exec();
		res.render("books/index", {
			books: books,
			searchOptions: req.query,
		});
	} catch {
		res.redirect("/");
	}
});

// yeni kitapları getir...
router.get("/new", async (req, res) => {
	renderNewPages(res, new Book()); //
});

// kitap ekle.
router.post("/", async (req, res) => {
	const book = new Book({
		title: req.body.title,
		author: req.body.author,
		publishDate: new Date(req.body.publishDate),
		pageCount: req.body.pageCount,

		description: req.body.description,
	});

	saveCover(book, req.body.cover);

	try {
		const newBook = await book.save();
		//res.redirect(`authors/${newBook.id}`); // yeni yazar oluşturulunca sayfasına git..
		res.redirect("books");
	} catch {
		renderNewPages(res, book, true);
	}
});

async function renderNewPages(res, book, hasError = false) {
	try {
		const authors = await Author.find({});
		const params = {
			authors: authors,
			book: book,
		};
		if (hasError) {
			params.errorMessage = "Error Creating Book";
		}
		res.render("books/new", params);
	} catch {
		res.redirect("/books");
	}
}

function saveCover(book, coverEncoded) {
	if (coverEncoded == null) return;
	const cover = JSON.parse(coverEncoded);

	if (cover != null && imageMimeTypes.includes(cover.type)) {
		book.coverImage = new Buffer.from(cover.data, "base64");
		book.coverImageType = cover.type;
	}
}

module.exports = router;
