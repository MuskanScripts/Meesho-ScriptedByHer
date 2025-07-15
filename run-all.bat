@echo off
start "" cmd /k "cd clothes-uploader-backend && node index.js"
start "" cmd /k "cd clothing-chatbot\backend && node index.js"
start "" cmd /k "cd clothing-chatbot\frontend && npm start"
start "" cmd /k "cd ClothesUploaderApp && npx expo start"
start "" cmd /k "mongod"
