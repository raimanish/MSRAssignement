const Book = require('../models/book');


exports.getbooks = (req, res) =>{
    const pageSize = +req.query.pageSize; // +sign is to convert string query parameter to numeric
	const currentPage = +req.query.page;
	const bookQuery = Book.find().skip(pageSize * (currentPage - 1))
    .limit(pageSize);;
	
	bookQuery.then((books) => {   
        if(books){
            res.status(200).json({
                success: true,
                books: books
            });
        }   
        else{
            res.status(404)
                .json({
                    success: false,
                    message: "No Record Found"
                })
        }  
       
	})
	.catch((error) => {
        res.status(500)
            .json({
                success: false,
                message: error.message
            })
	});
}

exports.getTotalBoks = (req, res) => {
    Book.find({})
        .then(books => {
            if(books){
                res.status(200).json({
                    success: true,
                    books: books.length
                });
            }   
            else{
                res.status(404)
                    .json({
                        success: false,
                        message: "No Record Found"
                    })
            }  
        })
        .catch((error) => {
            res.status(500)
                .json({
                    success: false,
                    message: error.message
                })
        });
}


exports.getAvailableBooks = (req, res) => {

}

exports.getBook = (req, res) => {
    Book.findById(req.params.id)
        .then(response => {
            if(response){
                res.status(200)
                    .json({
                        success: true,
                        book:response 
                    })
            }else{
                res.status(400)
                    .json({
                        success: false,
                        message: "Book Not found" 
                    })
            }
        })
        .catch(error => {
            res.status(500)
                .json({
                    success: false,
                    message: error.message
                })
        })
}

exports.updateBook = (req, res) => {
    const book = new Book({
        _id: req.params.id,
        name: req.body.name,
        available: req.body.available
    })

    Book.updateOne({_id: req.params.id}, book)
        .then(response => {
            console.log(response);
            if(response.nModified > 0)
                res.status(200).json({
                    success: true,
                    message: "Book updated successfully"
                });
            else{
                res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
            }
        })
        .catch(error => {
            res.status(500)
                .json({
                    success: false,
                    message: error.message
                })
        })
}

exports.deleteBook = (req, res) => {
    Book.deleteOne({ _id: req.params.id}).then((result) => {
		console.log('record deleted');
		if(result.n > 0){
			res.status(200).json({
                success: true,
				message: "post deleted sucessfully",
			});
		}
		else{
			res.status(401).json({
                success: false,
				message: "Something went wrong"
			});
		}
	}).catch((error) => {
			console.log("error occured while deleting the record");
            console.log(error);
            res.status(500).json({
                success: false,
				message: error.message
			});
	});
}

exports.createBook = (req, res) => {

    const book = new Book({
        name: req.body.name,
        available: req.body.available
    });

    book.save()
        .then(response => {
            res.status(200).json({
                success: true,
                message: "Book Saved Successfully",
            })
        })
        .catch(error => {
            res.status(500)
                .json({
                    success: false,
                    message: "Something went wrong"
                })
        })

}