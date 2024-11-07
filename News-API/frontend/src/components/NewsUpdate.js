import React, { Component } from "react";

export class NewsUpdate extends Component {
  render() {
    let { title, author, imgUrl, newsUrl, source, date } = this.props;
    return (
      <div className="card" style={{ width: "25rem" }}>
        <div className="card-header bg-warning">
          <b>{source}</b>
        </div>
        <img src={imgUrl} className="card-img-top" alt="..." height="200px" />
        <div className="card-body">
          <div style={{ height: "100px" }}>
            <h5 className="card-title">{title}...</h5>
          </div>
          <a href={newsUrl} className="btn btn-primary">
            Read
          </a>
        </div>
        <div className="card-footer text-success">
          <cite title="Source Title">By : {!author ? source : author}</cite>
          {date}
        </div>
      </div>
    );
  }
}

export default NewsUpdate;
