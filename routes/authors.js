const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

// author sayfası route. bütün yazarları getir.
router.get("/", async (req, res) => {
	let searchOptions = {};
	if (req.query.name != null && req.query.name !== "") {
		// get metodunda form elemanlarının value'suna req.query metodu ile ulaşırız.
		searchOptions.name = new RegExp(req.query.name, "i"); // regex case sensitive olmaması için 'OGUZ' ve 'oguz' da geçerli olucak.
	}
	try {
		const authors = await Author.find(searchOptions);
		res.render("authors/index", {
			authors: authors,
			searchOptions: req.query,
		}); // sonuç olarak inputtan gelen değere göre yazar listelenecek.
	} catch {
		res.redirect("/");
	}
});

// yeni yazarları getir...
router.get("/new", (req, res) => {
	res.render("authors/new", { author: new Author() }); // author değerini get metodu tanımladık.
});

// yazar oluştur.
router.post("/", async (req, res) => {
	const author = new Author({
		// yeni bir Author koleksiyonu oluşturduk ve özellik olarak formdan gelen ismi modele uygun olarak ekleyecez..
		name: req.body.name, // yazar ekleme işini de post metodu ile ekledik.
	});

	try {
		const newAuthor = await author.save();
		// veri tabanına kaydetme işlemi... async kullanarak callback karmaşasından kurtulmuş oluyoruz...
		res.redirect(`authors/${newAuthor.id}`); // yeni yazar oluşturulunca sayfasına git..
		//res.redirect("authors");
	} catch {
		res.render("authors/new", {
			author: author,
			errorMessage: "Something went wrong!",
			// eğer hata oluşursa bu şekilde bir değişken oluşturulp, template e gönderilecek.
		});
	}
	// ----------- klasik callback stili ile yaparsak --------
	// author.save((err, newAuthor) =>{// form inputtan gelen yeni yazarı database'e ekleyecez.
	//     if(err){
	//         let locals = {errorMessage: 'Something went wrong!'}; // local variable tanımlama...
	//         // res.render('authors/',{
	//         //     author: author,
	//         //     errorMessage: locals
	//         // });
	//         res.render('authors/new', locals);
	//         // eğer hata oluşursa, hata objesi dönecek...
	//     }
	//     //res.redirect(`authors/${newAuthor.id}`); // yeni yazar oluşturulunca sayfasına git..
	//     res.redirect('authors');
	// })
});

// author details
router.get("/:id", async (req, res) => {
	try {
		const author = await Author.findById(req.params.id);
		const books = await Book.find({author: author.id}).limit(6).exec();
		res.render('authors/show', {
			author: author,
			booksByAuthor: books
		})
	} catch  {
		res.redirect('/')
	}
});

// edit author
router.get("/:id/edit", async (req, res) => {
	try {
		const author = await Author.findById(req.params.id);
		res.render("authors/edit", { author: author });
	} catch {
		res.redirect("/authors");
	}
});

// --- update the author ---
router.put("/:id/", async (req, res) => {
	let author;
	try {
		author = await Author.findById(req.params.id);
		author.name = req.body.name;
		await author.save();
		res.redirect(`/authors/${author.id}`); 
	} catch {
		if (author == null){
			res.redirect('/'); 
		}else{
			res.render("authors/edit", {
				author: author,
				errorMessage: "Something went wrong! ",
			});
		}
	}
});

// delete author -- 
router.delete("/:id/", async (req, res) => {
	let author;
	try {
		author = await Author.findById(req.params.id);
		console.log(author);
		await author.remove();
		res.redirect('/authors');
	} catch {
		if (author == null){
			res.redirect('/'); 
		}else{
			//res.redirect(`/authors/${author.id}`);
			// bu kısımda düzeltme yapılacak. authors sayfasında silme işlemi yapınca author detail sayfasına gitmemesi gerekiyor...
			res.redirect(`/authors/${author.id}`,) 
		}
	}
});

module.exports = router;
