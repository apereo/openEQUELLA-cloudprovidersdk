import express from "express";
import Bundler from "parcel-bundler";
import path from "path";
import { CloudControls } from "../../controls";
import { providerRegistration } from "./shared/registration";

const app = express();
const port = 5000 || process.env.PORT;

const controls: CloudControls = {
  omdb: {
    name: "OMDB Lookup",
    configuration: [
      { id: "apiKey", name: "API Key", configType: "Textfield", min: 1 }
    ]
  }
};

app.get("/controls", (req, res) => res.send(controls));
app.post("/refresh", (req, res) => res.send(providerRegistration()));

const bundler = new Bundler([
  path.join(__dirname, "../src/site/index.html"),
  path.join(__dirname, "../src/site/omdb.tsx")
]);
app.use(bundler.middleware());

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
