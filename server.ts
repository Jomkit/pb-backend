import app from "./src/app";
const port = process.env.PORT || 3001;

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});