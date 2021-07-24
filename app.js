const mysql = require('mysql');
const express = require('express');
const ejs = require('ejs');
const schedule = require('node-schedule');
const cookie = require('cookie-parser');
const session = require('express-session');
const http=require('http');
const socketio = require('socket.io');

// mysql 연결
var conn = mysql.createConnection({
    host : '3.36.243.240',
    user : 'test',
    password : 'test',
    database : 'test',
    dateStrings : 'data'
});
conn.connect();

// express 사용
const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// session 사용
//app.use(cookieParser());
app.use(session({
    key: 'sid',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 10 * 60 * 1000 // 쿠키 유효기간 10분
    }
}));

// server 생성
var port = 3000;
const server = app.listen(port, () => {
    console.log(`start app listening at http://localhost:${port}`)
});

// socket 연결
const io = socketio(server);

io.on("connection", (socket) => {
    console.log(`connect: ${socket.id}`);

    var lastRowID = -1;
    var job = schedule.scheduleJob(
        '*/5 * * * *', // 주기 (5분마다)
    function() {
        var sql = 'select * from backup order by id desc limit 1';
        conn.query(sql, (err, row) => {
            if (err) {
                console.log(err);
            } else {
                if (lastRowID != row[0].id) {
                    lastRowID = row[0].id;
                    console.log(row[0]);
                    socket.emit("outlierData", row[0]);
                } else {
                    console.log('not update database');
                }
            }
        });
    });
});



app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    let session = req.session;
    console.log("session.email", session.email);
    if (session.email) {
        res.redirect('/mainPage');
    } else {
        res.render('./loginPage.ejs');
    }
});

app.post('/login', (req, res) => {
    console.log(req.body.userId);
    var sql = 'select * from user_info where user_id = ?'
    conn.query(sql, [req.body.userId], (err, row) => {
        if (err) {
            console.log(err);
        } else {
            if (row.length == 0) {
                res.write('<script>alert("Wrong ID. Please check the ID"); history.back();</script>');
            } else {
                if (row[0].user_pw != req.body.userPw) {
                    res.write('<script>alert("Wrong Passward. Please check the Passward"); history.back();</script>');
                } else {
                    req.session.email = req.body.userId;
                    res.redirect('/mainPage');
                }
            }
        }
    });
});


app.get('/mainPage', (req, res) => {
    if (!req.session.email) {
        res.redirect('/login');
    }
    var sql = 'select min(start_date), max(end_date) from test';
    conn.query(sql, (err, row) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(row);
            res.render('./mainPage.ejs', { data: row[0], port: port }); // min(start_date), max(end_date)
        }
    });
});

// 데이터 새로고침
app.post('/mainPage/refreshData', (req, res) => {
    console.log(req.body);
    var sql = 'select * from test order by id desc limit 1'
    conn.query(sql, (err, row) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(row);
            res.json(row[0]); // latest row
        }
    });
});


//합계 데이터 조회 - 기간 조회
app.post('/mainPage/dateSelect', (req, res) => {
    var data = req.body;
    var sql = 'select sum(people), sum(vehicle) from test where start_date >= ? and end_date <= ?'
    conn.query(sql, [data.startDate, data.endDate], (err, row) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(row);
            res.json(row[0]); // sum(people), sum(vehicle)
        }
    });
});

//합계 데이터 조회 - 일간 조회
app.post('/mainPage/daySelect', (req, res) => {
    var data = req.body;
    var sql = "select sum(people), sum(vehicle) from test WHERE start_date >= CONCAT(?,' 00:00:00') AND start_date <= CONCAT(?,' 23:59:59')";
    conn.query(sql,[data._Date,data._Date], (err, row) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(row);
            res.json(row[0]); // sum(people), sum(vehicle)
        }
    });
});

//합계 데이터 조회 - 시간 조회
app.post('/mainPage/timeSelect', (req, res) => {
    var data = req.body;
    var sql =  "select sum(people), sum(vehicle) from test WHERE start_date >= CONCAT(?,' ',?,':00') AND start_date <= CONCAT(?,' ',?,':00')";
    conn.query(sql, [data.start_Date,data.startTime,data.end_Date,data.endTime], (err,row) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(row);
            res.json(row[0]); // sum(people), sum(vehicle)
        }
    });
});


//시작시간/종료시간을 지정하고, 수신한 데이터를 테이블로 표시
app.post('/mainPage/tableDatetimeSelect', (req, res) => {
    var data = req.body;
    console.log(data.startDate);
    var sql = 'SELECT * FROM test WHERE start_date >= ? and end_date <= ?'
    conn.query(sql, [data.startDate, data.endDate], (err, row) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(row);
            res.json(row);
        }
    });
});

//메인페이지 로그아웃
app.post('/mainPage/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('sid');

    res.redirect('/login');
});


// Create Sample Data
app.get('/createSampleData', (req, res) => {
    res.render('./createDataPage.ejs');
});

app.post('/createSampleData', (req, res) => {
    console.log(req.body);
    var data = req.body;

    var startTime = new Date(data.startDate).setHours(data.startTime);
    var endTime = new Date(data.endDate).setHours(data.endDate);

    var flag = 1;
    var job = schedule.scheduleJob({
        start: startTime,
        end: endTime+1,
        rule: '*/5 * * * *' // 주기 (5분마다)
    },
    function() {
        if (flag == 1) {
            res.json('Scheduler is Working');
            flag = flag + 1;
        }

        var data = createData(5*60);
        var sql = 'INSERT into test(start_date, end_date, people, vehicle) value (?, ?, ?, ?)';
        conn.query(sql, [data.startDate, data.endDate, data.peopleNum, data.vehicleNum], (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('complete insert data');
            }
        });
    });
})

// 샘플 데이터 랜덤으로 생성
function createData(updateTime) {
    var peopleNum = Math.floor(Math.random() * 10);
    var vehicleNum = Math.floor(Math.random() * 5);
    console.log(peopleNum, vehicleNum);

    var currentDate = new Date();
    var endDate = new Date(currentDate);
    var startDate = new Date(currentDate.setSeconds(currentDate.getSeconds() - updateTime));
    console.log(startDate.toString(), endDate.toString());

    return {
        peopleNum: peopleNum,
        vehicleNum: vehicleNum,
        startDate: startDate,
        endDate: endDate
    };
}
