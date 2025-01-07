const express = require('express');
const mssql = require('mssql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 8999;

app.use (bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());

const dbConfig={
    server : 'localhost',
    user :'sa',
    password :'root@123',
    database : 'userlogin',
    options: {
      trustServerCertificate: true // Disable certificate validation for local development
    }
};
mssql.connect(dbConfig, (err) =>{
    if (err) {
        console.error(' error connecting to MSSQL:'+err.stack);       
        //return;
    }else {
      console.log('connected to MSSQL successfully');
    }
});

// Register route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const query = 'INSERT INTO users (username, email, password) VALUES (@username, @email, @password)';
    const request = new mssql.Request();
    request.input('username', mssql.VarChar, username);
    request.input('email', mssql.VarChar, email);
    request.input('password', mssql.VarChar, hashedPassword);

    try {
      await request.query(query);
     // res.status(200).send('User registered successfully');
     res.status(200).json({ success: true, message: 'User registered successfully' });

    } catch (error) {
      console.error('Error while registering user: ', error.stack);
      //res.status(500).send('Internal server error');
      res.status(500).json({ success: false, message: 'Internal server error' });

    }    
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Find the user by username
  const query = 'SELECT * FROM users WHERE username = @username';
  const request = new mssql.Request();
  request.input('username', mssql.VarChar, username);
try {
  const result = await request.query(query);
  if(result.recordset.length === 0){
  //  return res.status(401).send('User not available');
     return res.status(401).json({ success: false, message: ' User not avilable' });

  }

  const user = result.recordset[0];
  const ismatch = await bcrypt.compare(password, user.password);
  if(ismatch){
    //res.status(200).send('Login successful');
   res.status(200).json({ success: true, message: 'Login successful' });

  }else {
    //res.status(401).send('Invalid password');
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
} catch (error) {
  console.error('Error querying the database:', error);
  //res.status(500).send('Internal Server Error');  
  res.status(500).json({ success: false, message: 'Internal server error' });

}  
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



