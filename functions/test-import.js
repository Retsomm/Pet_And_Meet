// 簡單測試檔案來驗證 ES modules 是否正常工作
import { https } from "firebase-functions";
import fetch from "node-fetch";
import cors from "cors";

console.log("ES modules import test successful");
console.log("firebase-functions imported:", typeof https);
console.log("node-fetch imported:", typeof fetch);
console.log("cors imported:", typeof cors);
