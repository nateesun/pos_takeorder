# pull images from Dockerfile

docker stop api_pos
docker rm api_pos
docker build -t api_pos .
docker run --name api_pos -d -p 5000:5000 api_pos