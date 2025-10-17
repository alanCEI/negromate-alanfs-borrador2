const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack); // Muestra el error en la consola del servidor

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Ha ocurrido un error interno en el servidor.';

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};

export default errorMiddleware;