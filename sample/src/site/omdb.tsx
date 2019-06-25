import * as ReactDOM from "react-dom";
import * as React from "react";

import {
  ControlApi,
  CloudAttachment,
  Attachment,
  ItemState
} from "oeq-cloudproviders/controls";
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

interface OMDBAttachmentMeta {
  imdbID: string;
}

CloudControl.register<OMDBConfig>(
  vendorId,
  "omdb",
  api => ReactDOM.render(<OMDBControl {...api} />, api.element),
  ReactDOM.unmountComponentAtNode
);

function isOMDBAttachment(
  a: Attachment
): a is CloudAttachment<OMDBAttachmentMeta> {
  return a.type == "cloud" && a.cloudType == "omdb";
}

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
  const [omdbAttachments, setOmdbAttachments] = React.useState<
    CloudAttachment<OMDBAttachmentMeta>[]
  >(props.attachments.filter(isOMDBAttachment));

  React.useEffect(() => {
    function updated(state: ItemState) {
      setOmdbAttachments(state.attachments.filter(isOMDBAttachment));
    }
    props.subscribeUpdates(updated);
    return () => props.unsubscribeUpdates(updated);
  }, []);
  const doSearch = () => {
    if (searchText.length > 0) {
      search(searchText).then(resp => setResults(resp.data));
    }
  };
  const attachmentMap = omdbAttachments.reduce((res, a) => {
    res[a.meta.imdbID] = a;
    return res;
  }, {});

  function toggleAttachment(
    result: OMDBResult,
    current?: CloudAttachment<OMDBAttachmentMeta>
  ) {
    if (!current) {
      const attachment: CloudAttachment<OMDBAttachmentMeta> = {
        type: "cloud",
        providerId: props.providerId,
        vendorId: props.vendorId,
        cloudType: "omdb",
        description: result.Title,
        display: { Year: result.Year },
        meta: { imdbID: result.imdbID }
      };
      props.edits([
        {
          command: "addAttachment",
          attachment
        }
      ]);
    } else {
      props.edits([{ command: "deleteAttachment", uuid: current.uuid }]);
    }
  }

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
              <input
                type="checkbox"
                checked={Boolean(attachmentMap[r.imdbID])}
                onChange={() => toggleAttachment(r, attachmentMap[r.imdbID])}
              />
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
