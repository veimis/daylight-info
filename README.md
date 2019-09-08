# daylight-info
Information website about sunrise-sundown times and daylight in Finland.

# how to
Switch to root directory and run nginx docker container in powershell with
`docker run -d -v ${pwd}/src:/www/data/ -v ${pwd}/nginx.conf:/etc/nginx/nginx.conf -p 80:80 --name proxy nginx:alpine`

Then access the site using browser at localhost
