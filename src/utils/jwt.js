const jsonwebtoken = require("jsonwebtoken");
const { dbScript, db_sql } = require("./db_script");
const connection = require("../config/database");

const jwt = {
    //create token
    issueJWT: async (user, position) => {
        let payload = {
            id: user.id,
            email: user.email_address,
            position: position
        };
        const expiresIn = 60 * 60 * 24;
        const jwtToken = jsonwebtoken.sign(payload, process.env.KEY, { expiresIn })
        return jwtToken;
    },

    //verify Token 
    verifyTokenFn: async (req, res, next) => {
        var token = req.headers.authorization
        jsonwebtoken.verify(token, process.env.KEY, function (err, decoded) {
            console.log(err, decoded);
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Session timed out. Please sign in again",
                });
            } else {
                req.user = {
                    id: decoded.id,
                    email: decoded.email,
                }
                const checkDeactivated = async (id) => {
                    try {
                        let s1 = dbScript(db_sql['Q6'], { var1: id });
                        let findUser = await connection.query(s1);
                        return findUser.rows[0];
                    } catch (error) {
                        console.error(error);
                        return false;
                    }
                };
                (async () => {
                    let deactivated = await checkDeactivated(req.user.id)
                    if (deactivated) {
                        return res.status(401).json({
                            success: false,
                            message: "Session timed out. Please sign in again",
                        });
                    } else {
                        return next();
                    }
                })();
            }
        });
    },

    verifyUser: async (req, res, next) => {
        var token = req.headers.authorization
        jsonwebtoken.verify(token, process.env.KEY, function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Session timed out. Please sign in again",
                });
            } else {
                req.user = {
                    id: decoded.id,
                    email: decoded.email,
                }
                return next();
            }
        });
    }

};
module.exports = jwt;