import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/index.mjs";

const auth = (req, res, next) => {
	const token = req.header("x-auth-token");
	if (!token)
		return res
			.status(401)
			.json({ message: "No Token. Authorization denied" });
	try {
		console.log(token);
		
		const decoded = jwt.verify(token, jwtSecret);
		req.user = decoded.user;
		console.log(decoded);
		next();
	} catch (err) {
		// console.error(err);
		res.status(401).json({ message: "Token is not valid" });
	}
};

export default auth;
