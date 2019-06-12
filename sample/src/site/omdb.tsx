import * as ReactDOM from "react-dom";
import * as React from "react";

import { ControlApi } from "oeq-cloudproviders/controls";
import { vendorId } from "../shared/registration";
import axios, { AxiosPromise } from "axios";
interface OMDBConfig {
  apiKey: string;
}

interface OMDBResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}
interface OMDBResults {
  Search: OMDBResult[];
}

CloudControl.register<OMDBConfig>(
  vendorId,
  "omdb",
  api => ReactDOM.render(<OMDBControl {...api} />, api.element),
  ReactDOM.unmountComponentAtNode
);

function OMDBControl(props: ControlApi<OMDBConfig>) {
  const config = props.config;

  function search(s: string): AxiosPromise<OMDBResults> {
    return axios.get(
      "http://www.omdbapi.com/?s=" +
        encodeURIComponent(s) +
        "&apiKey=" +
        encodeURIComponent(config.apiKey)
    );
  }

  const [searchText, setSearchText] = React.useState("");
  const [results, setResults] = React.useState<OMDBResults>();

  const doSearch = () => {
    if (searchText.length > 0) {
      search(searchText).then(resp => setResults(resp.data));
    }
  };

  function renderResults(results: OMDBResults) {
    return (
      <div style={{ margin: 20 }}>
        {results.Search.map(r => {
          const posterImg =
            r.Poster != "N/A" ? (
              <img src={r.Poster} height={200} />
            ) : (
              <div
                style={{
                  background: "#eeeeee",
                  display: "inline-block",
                  width: 160,
                  height: 200
                }}
              >
                No poster
              </div>
            );
          return (
            <div
              key={r.imdbID}
              style={{ display: "flex", alignItems: "center" }}
            >
              {posterImg}{" "}
              <div style={{ marginLeft: 20 }}>
                <a
                  href={
                    "https://www.imdb.com/title/" +
                    encodeURIComponent(r.imdbID) +
                    "/"
                  }
                  target="blank"
                >
                  {r.Title}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="control">
      <h3>{props.title}</h3>
      <input
        type="text"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
      />
      <button onClick={doSearch}>Search</button>
      {results && renderResults(results)}
    </div>
  );
}
