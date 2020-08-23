const mongoose = require("mongoose");
const Book = require("./book");

const authorSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

// kitabı olan yazarlar silinmeyecek...
authorSchema.pre("remove", function (next) {
	// pre metodu ile veri tabanındaki async silme fonksiyonunu çalışırken kontrol eder, işlem yaparız.
	Book.find({ author: this.id }, (err, books) => {
		if (err) {
			next(err);
		} else if (books.length > 0) {
			next(new Error("This author has books still"));
		} else {
			next();
		}
	});
});

const Author = mongoose.model("Author", authorSchema);

// model export edildi..
module.exports = Author;
