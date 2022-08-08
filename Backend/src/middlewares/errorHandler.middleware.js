export const errorHandler = (err, req, res, next) => {
	console.log("error hondler middleware!");
	const statusCode = err.statusCode || 500;
	console.error(err.message, err.stack);
	res.status(statusCode).json({'message': err.message});
	return;
}