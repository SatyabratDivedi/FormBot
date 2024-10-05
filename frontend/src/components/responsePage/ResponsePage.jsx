import React from "react";
import style from "./responsePage.module.css";

const ResponsePage = () => {
  return (
    <>
      <div className={style.responseMainContainer}>
        {/* boxContainer */}
        <div className={style.boxContainer}>
          <div className={style.box}>
            <div>Views</div>
            <div>6</div>
          </div>
          <div className={style.box}>
            <div>Start</div>
            <div>3</div>
          </div>
          <div className={style.box}>
            <div>Completion rate</div>
            <div>44%</div>
          </div>
        </div>
        {/* submissionContainer */}
        <table>
          <thead>
            <tr>
              <th>Submitted at</th>
              <th>Button 1</th>
              <th>Email 1</th>
              <th>Text 1</th>
              <th>Button 2</th>
              <th>Rating 1</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jul 17, 03:23 PM</td>
              <td>Hi!</td>
              <td>abc@g.com</td>
              <td>goodie and the pasta </td>
              <td>Studio App to Manage Clients,s Tracking App for care </td>
              <td>5</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ResponsePage;
