const http = require('http');
const path = require('path');
const fs = require('fs');
const { dirname } = require('path');

//creat a new server obejct
const server = http
  .createServer((req,res) => {

    //------------------------------Uncomment for Basic http JS stuff -----------//
    
    // //prints the url that the usr is requesting to go to
    // console.log(req.url);
    // //if the request url is the homepage i.e. '/' then read the index.html file
    // //we do this by getting the directory using path.join, public and the filename.
    // //then do the function with two parametres, err and content, content being the file
    // //if no error we writeHead success (200) and content type. Then while ending the response
    // //we can write the content of the file to the server
    // if (req.url === '/') {
    //     fs.readFile(path.join(__dirname, 'public', 'index.html'), 
    //       (err,content) => {
    //         if (err) throw err;
    //         res.writeHead(200, {'Content-Type': 'text/html'});
    //         res.end(content);
    //       })
    // }
    
    // //If the url is /about then we load the about.html
    // if (req.url === '/about') {
    //   fs.readFile(
    //     path.join(__dirname, 'public', 'about.html'), 
    //     (err,content) => {
    //       if (err) throw err;
    //       res.writeHead(200, {'Content-Type': 'text/html'});
    //       res.end(content);
    //     }
    //   );
    // }
    // //when goign to an apit address... (JSON is hard coded)
    // if (req.url === '/api/users') {
    //   const users = [
    //     {name: 'Bob Smith', age: 40},
    //     {name: 'Tom S', age: 22},
    //   ];
    //   //we still want a 200 response, but the content type is JSON
    //   res.writeHead(200, {'Content-type': 'application/json'});
    //   //now convert the Javascript objects to JSON strings using stringify
    //   res.end(JSON.stringify(users));
    // }

    //--------------------------------------------------------------------//

    //---------------------- Building a dynamic file path ------------------//
    // for use with CSS

    let filepath = path.join(
        __dirname, 
        'public', 
        req.url === '/' ? 'index.html' : req.url
    );

    //file extension
    let extname = path.extname(filepath);

    //Initial content type (use html as it will be most used)
    let contentType = 'text/html';

    //check extenstion and then set content type if needed
    switch(extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'text/javascript';
            break;
        case '.js':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
    } 

    //Read a file
    fs.readFile(filepath, (err,content) => {
        //we wanna check for a specific type of error
        if(err) {
            if(err.code == 'ENOENT') {  //ENOENT usually means page not found
                //Page not found
                fs.readFile(path.join(__dirname, 'public', '404.html'),
                (err, content) => {
                    res.writeHead(200, {'Content-type': 'text/html'});
                    res.end(content,'utf8');
                })
            } else {  //if a differnt error then ENOENT
                //some other server error
                res.writeHead(500);
                res.end(`Server error: ${err.code}`);
            }
        } else { //SUCCESS
            //load content with whatever content type and then send the content of the file
            res.writeHead(200, {'Content-type': contentType});
            res.end(content,'utf8'); //specify utf8
        }
    })

  });

//creat a const PORT Variable. First look for environemtn port variable, if not found then run on 5000
const PORT = process.env.PORT ||5000;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));