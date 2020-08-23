const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Author = mongoose.model("Author", authorSchema);

// model export edildi..
module.exports = Author;
