const express = require('express');
const app = express();
app.set('view engine', 'ejs');

var port = 8080;
app.listen(port, () => {
    console.log(`start app listening at http://localhost:${port}`)
});

app.get('/', (req, res) => {
    res.render('studyLayout.ejs');
});