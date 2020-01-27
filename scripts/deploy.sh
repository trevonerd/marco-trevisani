echo "- Stop container"
docker stop marco-trevisani

echo "- Build image"
docker build -t nextjs-docker .

echo "- Run marcotrevisani.com"
docker-compose up -d
