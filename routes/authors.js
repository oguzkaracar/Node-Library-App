const express = require("express");
const router = express.Router();
const Author = require("../models/author");

// author sayfası route. bütün yazarları getir.
router.get("/", async (req, res) => {
    let searchOptions = {};
    if(req.query.name != null && req.query.name !== ''){ 
        // get metodunda form elemanlarının value'suna req.query metodu ile ulaşırız.
        searchOptions.name = new RegExp(req.query.name, 'i'); // regex case sensitive olmaması için 'OGUZ' ve 'oguz' da geçerli olucak.
    }
    try {
        const authors = await Author.find(searchOptions);
        res.render("authors/index", {
            authors:authors,
            searchOptions: req.query
        }) // sonuç olarak inputtan gelen değere göre yazar listelenecek.
    } catch {
        res.redirect('/');
    }
    
    
    //res.render("authors/index");
    
});

// yeni yazarları getir...
router.get("/new", (req, res) => {
	res.render("authors/new", { author: new Author() }); // author değerini get metodu tanımladık.
});

// yazar oluştur.
router.post("/", async (req, res) => {
	const author = new Author({ // yeni bir Author modeli oluşturduk ve özellik olarak formdan gelen ismi modele uygun olarak ekleyecez..
		name: req.body.name, // yazar ekleme işini de post metodu ile ekledik.
	});

	try {
        const newAuthor = await author.save(); 
        // veri tabanına kaydetme işlemi... async kullanarak callback karmaşasından kurtulmuş oluyoruz...
        res.redirect('authors');
	} catch {
		res.render('authors/new',{
		    author: author,
            errorMessage: "Something went wrong!" 
            // eğer hata oluşursa bu şekilde bir değişken oluşturulp, template e gönderilecek.
		});
	}

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

module.exports = router;

// Buradan : https://youtu.be/esy4nRuShl8?t=1286  --- devam et...
