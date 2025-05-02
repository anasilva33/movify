# 🎬 Movify

Movify: Filmes que te movem  - is a modern web application built with **React** and **Vite** that allows users to explore and discover movies. Fast, lightweight, and scalable, Movify is a great starting point for any media or movie catalog-related project.

## 🚀 Technologies Used

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Docker](https://www.docker.com/)

## 📐 Sizes

To view the app at its optimal size, resize the window to the dimensions defined in the [design](https://xd.adobe.com/view/ea7b4a6b-b5b4-40cf-8d34-fffd1ed91d8c-bf28/specs/) (1366x768)

---

## 📦 How to Run the Project with Docker

Make sure you have **Docker** installed on your machine.

### 1. Build the Docker image

```bash
docker build -t movify -f ./Dockerfile . 
```

### 2. Run the container on port 8080

```bash
docker run -d -p 8080:80 --name movify movify 
```

### 3. Access the App

The application will be available at [http://localhost:8080](http://localhost:8080).



