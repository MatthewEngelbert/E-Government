How to Run : INSTALL ALL DEPENDENCIES

BLOCKCHAIN

cd client/blockchain
npm install --save-dev hardhat
CLIENT

cd client
npm install
SERVER

cd server
npm install busboy
RUN BLOCKCHAIN

cd client/blockchain
npx hardhat node
CLIENT

cd client
npm run dev
SERVER

cd server
npm run dev
Miscellanous Compiling Smart Contract

npx hardhat run scripts/deploy.js --network localhost
.