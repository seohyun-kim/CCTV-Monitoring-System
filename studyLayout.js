const express = require('express');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname+'/views/images')));

var port = 8080;
app.listen(port, () => {
    console.log(`start app listening at http://localhost:${port}`)
});

app.get('/', (req, res) => {
    res.render(path.join(__dirname + '/views/studyLayout.ejs'));
});