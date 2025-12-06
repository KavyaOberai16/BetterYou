module.exports = (fn) =>{
    return (req, res, next) =>{
        fn(req, res, next).catch(next);
    };
};

// ☕ Understanding the error cycle

// Here is Express error flow:

// 1. Error happens inside some async route

// ⬇

// 2. wrapAsync catches it

// ⬇

// 3. wrapAsync calls next(error)

// ⬇

// 4. Express sees an error passed → jumps to your error middleware:
// app.use((err, req, res, next) => {
//   const { statusCode = 500 } = err;
//   res.status(statusCode).render("error", { err });
// });


// ⬇

// 5. Error page rendered safely (no crash)