

## Server Setup

### nginx

Need to steup nginx in order fowrard requests from 80 to my application
1. sudo apt-get install nginx
2. sudo nano /etc/nginx/sites-available/myapp
3. Type / paster the following
`
server {
    listen 80;

    server_name research.name.edu;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
`
4. sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/

5. sudo nginx -t

6. sudo systemctl reload nginx


### pm2

After connecting to ssh server do the following steps.
Note these assume nginx is setup and pm2 is installed

1. Goto project directory
2. npm install pm2 -g
3. pm2 start -i max npm -- start
4. restart nginx





