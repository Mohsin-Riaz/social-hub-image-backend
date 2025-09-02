# Social Hub Image Backend
An Express.js service for uploading, resizing, and deleting images in **AWS S3**.  
Supports avatar and post images with automatic resizing using [Jimp](https://www.npmjs.com/package/jimp).
---
## 🚀 Features
- Upload avatar images (resized to `300x300`)
- Upload post images (resized to `900x600`)
- Delete images from S3
- CORS configured for multiple environments
- Ready for local or serverless deployment
---
## 📂 Project Structure
```
├── .gitignore
├── README.md
├── package-lock.json
├── package.json
├── server.js
└── src
├── controllers
│   └── imageController.js
├── routes
│   └── imageRoutes.js
└── server.js
```
---
## ⚙️ Installation
```bash
# clone repo
git clone https://github.com/yourusername/image-resizer.git
cd image-resizer

# install dependencies
npm install
```
---
## ▶️ Usage
### Development
```bash
npm run dev
```
### Production
```bash
npm start
```
Development Server will run on [http://localhost:3500](http://localhost:3500)
---


## 🔑 Environment Variables
Create a `.env` file in the project root:
```env
AWS_ACCESS_KEY=your-access-key
AWS_SECRET_KEY=your-secret-key
AWS_S3_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name
DEV_SERVER_URL=http://localhost:3000
DEV_BACKEND_URL=http://localhost:3500
PROD_SERVER_1_URL=https://yourdomain.com
```
---
## 📡 API Endpoints
Base path: `/images`
### **Avatar**
* `POST /images/a/:imageId`
  Upload & resize avatar image (`300x300`).
  **Form field:** `avatar`
### **Post**
* `POST /images/p/:imageId`
  Upload & resize post image (`900x600`).
  **Form field:** `avatar`
### **Delete**
* `DELETE /images/d/:imageId`
  Delete image from S3.
---
## 🛠 Tech Stack
* [Express.js](https://expressjs.com/)
* [AWS S3](https://aws.amazon.com/s3/)
* [Jimp](https://www.npmjs.com/package/jimp) (image processing)
* [Multer](https://www.npmjs.com/package/multer) (file upload)
* [Serverless Framework](https://www.serverless.com/) (optional deployment)
