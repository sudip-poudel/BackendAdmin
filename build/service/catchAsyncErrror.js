"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (fn) => {
    return (req, res) => {
        fn(req, res).catch((err) => {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error 500 !!",
                errMessage: err.message
            });
        });
    };
};
exports.default = errorHandler;
